import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const format = searchParams.get("format") || "png"; // "png" | "svg"

    if (!text) {
      return NextResponse.json({ error: "Text parameter is required" }, { status: 400 });
    }

    if (format === "svg") {
      const svg = await QRCode.toString(text, {
        type: "svg",
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      return new Response(svg, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    // Default: Return high-res PNG data URL
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 600,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return NextResponse.json({ success: true, dataUrl });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
