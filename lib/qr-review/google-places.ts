/**
 * Utility functions for Google Maps review deep links and Place IDs
 */

/**
 * Converts Google Maps hex coordinates (feature ID pair, e.g. 0x39f8b05712b0a273:0xe1f29e6b10990650)
 * into a standard Google Place ID (e.g. ChIJc6KwElew-DkRUAaZEGue8uE).
 * Uses pure Uint8Array + BigInt so it works in both Browser and Node.js environments.
 */
export function convertHexPairToPlaceId(hex1: string, hex2: string): string {
  try {
    const u8 = new Uint8Array(20);
    u8[0] = 0x0a; // Protobuf wire type 2, field 1
    u8[1] = 0x12; // Length: 18 bytes
    u8[2] = 0x09; // Field 1: fixed64 ((1 << 3) | 1)

    // Write hex1 in little-endian 64-bit unsigned integer
    let b1 = BigInt(hex1.startsWith("0x") || hex1.startsWith("0X") ? hex1 : `0x${hex1}`);
    for (let i = 0; i < 8; i++) {
      u8[3 + i] = Number(b1 & BigInt(0xff));
      b1 >>= BigInt(8);
    }

    u8[11] = 0x11; // Field 2: fixed64 ((2 << 3) | 1)
    // Write hex2 in little-endian 64-bit unsigned integer
    let b2 = BigInt(hex2.startsWith("0x") || hex2.startsWith("0X") ? hex2 : `0x${hex2}`);
    for (let i = 0; i < 8; i++) {
      u8[12 + i] = Number(b2 & BigInt(0xff));
      b2 >>= BigInt(8);
    }

    // Convert Uint8Array to base64url string
    let binary = "";
    for (let i = 0; i < u8.length; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    const base64 = typeof btoa === "function" 
      ? btoa(binary) 
      : Buffer.from(u8).toString("base64");

    // Convert base64 to base64url without padding
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

/**
 * Generates the direct Google Maps review submission link.
 * When clicked on iOS / Android, this opens the official Google Maps app or browser
 * directly with the 5-star review modal open and cursor in the text box.
 */
export function getGoogleReviewDeepLink(placeId?: string | null, businessName?: string, city?: string): string {
  if (placeId && placeId.trim().length > 5) {
    const cleanId = placeId.trim();
    // If user passed a full URL instead of raw ID, extract it
    const extracted = extractPlaceIdFromUrl(cleanId);
    const finalId = extracted || cleanId;
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(finalId)}`;
  }

  // Fallback: direct Google search query for review
  const query = [businessName, city, "reviews"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Attempts to extract a business name from a Google Maps URL path if present
 */
export function extractBusinessNameFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/place\/([^/@?]+)/i);
  if (match && match[1]) {
    try {
      const decoded = decodeURIComponent(match[1].replace(/\+/g, " "));
      // Clean up common pipe suffixes like " | BEST RESTAURANTS IN..." if desirable, or keep exact title
      return decoded.trim();
    } catch {
      return match[1].replace(/\+/g, " ").trim();
    }
  }
  return null;
}

/**
 * Attempts to extract a clean Place ID from various Google Maps link formats:
 * 1. Hex coordinate pairs: !1s0x...:0x... or ftid=0x...:0x...
 * 2. Explicit placeid parameter: ?placeid=... or place_id=...
 * 3. Protobuf Place ID: !1s(ChIJ...)
 * 4. Raw ChIJ string
 */
export function extractPlaceIdFromUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Format 1: Raw Place ID starting with ChIJ
  if (/^ChIJ[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  // Format 2: Hex coordinate pair embedded in Google Maps data string (!1s0x...:0x...)
  const matchHexPair = trimmed.match(/!1s(0x[0-9a-fA-F]+):(0x[0-9a-fA-F]+)/);
  if (matchHexPair && matchHexPair[1] && matchHexPair[2]) {
    const converted = convertHexPairToPlaceId(matchHexPair[1], matchHexPair[2]);
    if (converted) return converted;
  }

  // Format 3: ftid query parameter (ftid=0x...:0x...)
  const matchFtid = trimmed.match(/[?&]ftid=(0x[0-9a-fA-F]+):(0x[0-9a-fA-F]+)/);
  if (matchFtid && matchFtid[1] && matchFtid[2]) {
    const converted = convertHexPairToPlaceId(matchFtid[1], matchFtid[2]);
    if (converted) return converted;
  }

  // Format 4: ?placeid=ChIJ... or ?place_id=ChIJ...
  const matchPlaceIdParam = trimmed.match(/[?&]place_?id=([a-zA-Z0-9_-]+)/i);
  if (matchPlaceIdParam && matchPlaceIdParam[1]) {
    return matchPlaceIdParam[1];
  }

  // Format 5: ...place/.../data=...!1s(ChIJ...)
  const matchHexData = trimmed.match(/!1s(ChIJ[a-zA-Z0-9_-]+)/i);
  if (matchHexData && matchHexData[1]) {
    return matchHexData[1];
  }

  return null;
}

/**
 * Detects the country name based on coordinates, city name, address, or Google Maps URL
 */
export function detectCountryFromLocation(params: {
  lat?: number | string | null;
  lng?: number | string | null;
  city?: string | null;
  address?: string | null;
  url?: string | null;
}): string {
  const { lat, lng, city, address, url } = params;

  // 1. Check address string
  if (address) {
    if (/\b(india|bharat)\b/i.test(address)) return "India";
    if (/\b(united kingdom|uk|england|scotland|wales|great britain)\b/i.test(address)) return "United Kingdom";
    if (/\b(united states|usa|u\.s\.a\.|u\.s\.)\b/i.test(address)) return "United States";
    if (/\bcanada\b/i.test(address)) return "Canada";
    if (/\b(uae|united arab emirates|dubai|abu dhabi)\b/i.test(address)) return "United Arab Emirates";
    if (/\baustralia\b/i.test(address)) return "Australia";
  }

  // 2. Extract coordinates from URL if not provided directly
  let nLat = typeof lat === "number" ? lat : lat ? parseFloat(lat) : NaN;
  let nLng = typeof lng === "number" ? lng : lng ? parseFloat(lng) : NaN;

  if ((isNaN(nLat) || isNaN(nLng)) && url) {
    // Check format @lat,lng
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch && coordsMatch[1] && coordsMatch[2]) {
      nLat = parseFloat(coordsMatch[1]);
      nLng = parseFloat(coordsMatch[2]);
    } else {
      // Check format !3dlat!4dlng
      const protoCoords = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (protoCoords && protoCoords[1] && protoCoords[2]) {
        nLat = parseFloat(protoCoords[1]);
        nLng = parseFloat(protoCoords[2]);
      }
    }
  }

  // 3. Geographic coordinate bounding boxes
  if (!isNaN(nLat) && !isNaN(nLng)) {
    // India: Lat 8.0 to 37.5, Lng 68.5 to 97.5
    if (nLat >= 8.0 && nLat <= 37.5 && nLng >= 68.5 && nLng <= 97.5) return "India";
    // United Kingdom: Lat 49.8 to 60.8, Lng -8.6 to 1.8
    if (nLat >= 49.8 && nLat <= 60.8 && nLng >= -8.6 && nLng <= 1.8) return "United Kingdom";
    // United States (contiguous): Lat 24.5 to 49.4, Lng -125.0 to -66.9
    if (nLat >= 24.5 && nLat <= 49.4 && nLng >= -125.0 && nLng <= -66.9) return "United States";
    // Canada: Lat 41.7 to 83.0, Lng -141.0 to -52.6
    if (nLat >= 41.7 && nLat <= 83.0 && nLng >= -141.0 && nLng <= -52.6) return "Canada";
    // UAE: Lat 22.6 to 26.1, Lng 51.5 to 56.4
    if (nLat >= 22.6 && nLat <= 26.1 && nLng >= 51.5 && nLng <= 56.4) return "United Arab Emirates";
    // Australia: Lat -44.0 to -10.0, Lng 113.0 to 154.0
    if (nLat >= -44.0 && nLat <= -10.0 && nLng >= 113.0 && nLng <= 154.0) return "Australia";
  }

  // 4. Known cities and states lookup
  const locLower = ((city || "") + " " + (address || "")).toLowerCase().trim();
  if (locLower) {
    if (
      /\b(india|bharat|west bengal|bengal|maharashtra|karnataka|tamil nadu|telangana|telengana|gujarat|rajasthan|uttar pradesh|kerala|punjab|haryana|bihar|odisha|assam|madhya pradesh|andhra|delhi|kolkata|calcutta|habra|barasat|purba bardhaman|bardhaman|burdwan|hanamkonda|siliguri|salt lake|durgapur|asansol|howrah|warangal|secunderabad|mumbai|bengaluru|bangalore|chennai|hyderabad|hydrabad|pune|ahmedabad|jaipur|surat|lucknow|kanpur|nagpur|indore|thane|bhopal|patna|vadodara|ghaziabad|ludhiana|agra|nashik|faridabad|varanasi|noida|gurgaon|gurugram|kochi|cochin|trivandrum|coimbatore|madurai|chandigarh|dehradun|guwahati|ranchi|jamshedpur)\b/i.test(
        locLower
      )
    ) {
      return "India";
    }

    if (
      /\b(united kingdom|england|scotland|wales|northern ireland|great britain|london|manchester|birmingham|leeds|glasgow|liverpool|edinburgh|bristol|sheffield|cardiff|belfast|newcastle|nottingham|southampton|oxford|cambridge)\b/i.test(
        locLower
      )
    ) {
      return "United Kingdom";
    }

    if (
      /\b(united states|usa|u\.s\.a\.|u\.s\.|california|texas|florida|new york|illinois|pennsylvania|ohio|georgia|north carolina|michigan|washington|arizona|colorado|los angeles|chicago|houston|phoenix|philadelphia|san antonio|san diego|dallas|san jose|austin|seattle|denver|boston|las vegas|miami|atlanta|orlando)\b/i.test(
        locLower
      ) ||
      /,\s*(ca|tx|fl|ny|il|pa|oh|ga|nc|mi|wa|az|co|ma|tn|mo|md|wi|mn|co)\b/i.test(locLower)
    ) {
      return "United States";
    }

    if (
      /\b(canada|ontario|british columbia|quebec|alberta|manitoba|toronto|montreal|vancouver|calgary|edmonton|ottawa|winnipeg|quebec city|hamilton|halifax)\b/i.test(
        locLower
      )
    ) {
      return "Canada";
    }

    if (
      /\b(united arab emirates|uae|dubai|abu dhabi|sharjah|ajman|ras al khaimah|fujairah|al ain)\b/i.test(
        locLower
      )
    ) {
      return "United Arab Emirates";
    }

    if (
      /\b(australia|new south wales|nsw|victoria|queensland|western australia|sydney|melbourne|brisbane|perth|adelaide|gold coast|canberra)\b/i.test(
        locLower
      )
    ) {
      return "Australia";
    }
  }

  return "";
}

/**
 * Detects user's default country from client-side timezone
 */
export function detectUserCountryFromTimezone(): string {
  if (typeof Intl === "undefined" || !Intl.DateTimeFormat) return "India";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("Asia/Calcutta") || tz.startsWith("Asia/Kolkata")) return "India";
    if (
      tz.startsWith("America/New_York") ||
      tz.startsWith("America/Chicago") ||
      tz.startsWith("America/Los_Angeles") ||
      tz.startsWith("America/Denver") ||
      tz.startsWith("America/Phoenix") ||
      tz.startsWith("America/Detroit") ||
      tz.startsWith("America/Indiana")
    )
      return "United States";
    if (tz.startsWith("Europe/London")) return "United Kingdom";
    if (
      tz.startsWith("America/Toronto") ||
      tz.startsWith("America/Vancouver") ||
      tz.startsWith("America/Montreal") ||
      tz.startsWith("America/Edmonton")
    )
      return "Canada";
    if (tz.startsWith("Australia/")) return "Australia";
    if (tz.startsWith("Asia/Dubai")) return "United Arab Emirates";
    if (tz.startsWith("Asia/Singapore")) return "Singapore";
    if (tz.startsWith("Europe/Berlin") || tz.startsWith("Europe/Frankfurt")) return "Germany";
    if (tz.startsWith("Europe/Paris")) return "France";
    if (tz.startsWith("Europe/Dublin")) return "Ireland";
  } catch {
    // fallback
  }
  return "India";
}

/**
 * Parses raw city string (e.g. "Barasat, West Bengal" or "Austin, TX")
 * into a clean city and detected country
 */
export function cleanCityAndCountry(params: {
  rawCity?: string | null;
  rawCountry?: string | null;
  address?: string | null;
  url?: string | null;
}): { city: string; country: string } {
  const { rawCity, rawCountry, address, url } = params;
  let cleanCity = (rawCity || "").trim();
  let cleanCountry = (rawCountry || "").trim();

  // If city contains comma (e.g. "Barasat, West Bengal" or "Kolkata, India")
  if (cleanCity.includes(",")) {
    const parts = cleanCity.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      // Check if last part is country or state
      const detected = detectCountryFromLocation({ city: lastPart, address, url });
      if (detected) {
        cleanCountry = detected;
        cleanCity = parts[0]; // "Barasat" or "Kolkata"
      }
    }
  }

  if (!cleanCountry) {
    cleanCountry = detectCountryFromLocation({ city: cleanCity, address, url });
  }

  return {
    city: cleanCity,
    country: cleanCountry || "India",
  };
}


