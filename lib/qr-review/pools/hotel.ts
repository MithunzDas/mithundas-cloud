import { IndustryConfig } from "./types";

export const HOTEL_POOL: IndustryConfig = {
  id: "LUXURY_HOTEL",
  name: "Luxury Hotel, Resort & Hospitality",
  icon: "🏨",
  defaultPlaceHolder: "The Grand Horizon Resort & Spa",
  sampleReview: "A dream stay from start to finish! The suite was whisper-quiet with cloud-like bedding, the infinity pool has jaw-dropping views, and the concierge team treated us like royalty. Breakfast buffet was gourmet heaven. 5 stars! ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "hot_room_01",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "How was the comfort of your room and the bed?",
    "options": [
      {
        "label": "Cloud-Like Mattress & Silky Linens 🛏️",
        "sentiment": "positive",
        "keywords": [
          "luxurious bed",
          "plush mattress",
          "best sleep ever"
        ]
      },
      {
        "label": "Whisper-Quiet & Deep Restful Sleep 💤",
        "sentiment": "positive",
        "keywords": [
          "soundproof room",
          "quiet hotel",
          "restful night"
        ]
      },
      {
        "label": "Breathtaking Balcony / Skyline View 🌅",
        "sentiment": "positive",
        "keywords": [
          "panoramic view",
          "scenic balcony"
        ]
      },
      {
        "label": "Spacious Suite with Designer Furnishings 🛋️",
        "sentiment": "positive",
        "keywords": [
          "spacious suite",
          "elegant interior design"
        ]
      }
    ]
  },
  {
    "id": "hot_room_02",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "How was the bathroom, shower, and bath amenities?",
    "options": [
      {
        "label": "Spa-Like Rainfall Shower & Deep Soaking Tub 🛁",
        "sentiment": "positive",
        "keywords": [
          "rain shower",
          "soaking bathtub",
          "marble bathroom"
        ]
      },
      {
        "label": "Luxury Designer Bath Toiletries & Fluffy Robes 🧴",
        "sentiment": "positive",
        "keywords": [
          "premium bath amenities",
          "plush towels and robes"
        ]
      },
      {
        "label": "Impeccably Sanitized & Spotless Marble ✨",
        "sentiment": "positive",
        "keywords": [
          "gleaming clean bathroom",
          "immaculate hygiene"
        ]
      }
    ]
  },
  {
    "id": "hot_room_03",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "How was the room temperature and climate control?",
    "options": [
      {
        "label": "Whisper-Quiet AC with Perfect Thermostat ❄️",
        "sentiment": "positive",
        "keywords": [
          "silent air conditioning",
          "precise climate control"
        ]
      },
      {
        "label": "Cozy & Warm Room Temperature 🔥",
        "sentiment": "positive",
        "keywords": [
          "cozy warmth",
          "comfortable climate"
        ]
      },
      {
        "label": "Fresh Air Flow & Clean Air Filtration 🍃",
        "sentiment": "positive",
        "keywords": [
          "purified room air",
          "fresh fragrance"
        ]
      }
    ]
  },
  {
    "id": "hot_room_04",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "Did you notice the daily housekeeping and turndown service?",
    "options": [
      {
        "label": "Housekeeping Left the Room Immaculate Everyday 🧹",
        "sentiment": "positive",
        "keywords": [
          "spotless housekeeping",
          "meticulous room cleaning"
        ]
      },
      {
        "label": "Lovely Evening Turndown with Chocolates 🍫",
        "sentiment": "positive",
        "keywords": [
          "evening turndown service",
          "thoughtful chocolates"
        ]
      },
      {
        "label": "Fresh Linens and Restocked Mini-Bar Promptly 🍷",
        "sentiment": "positive",
        "keywords": [
          "fresh towels daily",
          "stocked mini bar"
        ]
      }
    ]
  },
  {
    "id": "hot_room_05",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "How was the in-room technology (TV, Wi-Fi, lighting)?",
    "options": [
      {
        "label": "Smart TV with Easy Streaming & High-Speed Wi-Fi 📺",
        "sentiment": "positive",
        "keywords": [
          "smart tv streaming",
          "fast hotel wifi"
        ]
      },
      {
        "label": "Intuitive Bedside Touch Lighting Controls 💡",
        "sentiment": "positive",
        "keywords": [
          "bedside touch controls",
          "modern lighting"
        ]
      },
      {
        "label": "Abundant USB and Fast-Charging Outlets 🔌",
        "sentiment": "positive",
        "keywords": [
          "bedside charging",
          "convenient outlets"
        ]
      }
    ]
  },
  {
    "id": "hot_room_06",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "How effective were the blackout curtains for morning sleep?",
    "options": [
      {
        "label": "Total Pitch-Black Darkness, Slept In Peacefully 🌙",
        "sentiment": "positive",
        "keywords": [
          "100% blackout curtains",
          "slept in late"
        ]
      },
      {
        "label": "Effortless Motorized Curtain Controls 🪟",
        "sentiment": "positive",
        "keywords": [
          "motorized curtains",
          "luxury touch"
        ]
      },
      {
        "label": "Zero Street Glare or Morning Sun Disturbance ☀️",
        "sentiment": "positive",
        "keywords": [
          "peaceful sleep",
          "no light leak"
        ]
      }
    ]
  },
  {
    "id": "hot_room_07",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "How was the in-room espresso machine and refreshments?",
    "options": [
      {
        "label": "Nespresso Machine with Generous Pod Selection ☕",
        "sentiment": "positive",
        "keywords": [
          "in room nespresso",
          "morning coffee in bed"
        ]
      },
      {
        "label": "Complimentary Bottled Mineral Water Daily 💧",
        "sentiment": "positive",
        "keywords": [
          "complimentary bottled water",
          "thoughtful refreshments"
        ]
      },
      {
        "label": "Artisanal Teas & Welcome Fruit Basket 🍎",
        "sentiment": "positive",
        "keywords": [
          "welcome fruit basket",
          "premium tea selection"
        ]
      }
    ]
  },
  {
    "id": "hot_room_08",
    "category": "room_comfort",
    "categoryLabel": "Room Luxury & Bed Comfort",
    "question": "Overall, how would you rate your room experience?",
    "options": [
      {
        "label": "A True 5-Star Sanctuary of Rest & Luxury 🏆",
        "sentiment": "positive",
        "keywords": [
          "5 star luxury suite",
          "sanctuary of rest"
        ]
      },
      {
        "label": "One of the Finest Hotel Rooms I've Ever Stayed In 💎",
        "sentiment": "positive",
        "keywords": [
          "finest hotel room",
          "flawless luxury"
        ]
      },
      {
        "label": "Did Not Want to Check Out! 🌟",
        "sentiment": "positive",
        "keywords": [
          "never wanted to leave",
          "ultimate hospitality"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_01",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How welcoming was the front desk team upon your arrival?",
    "options": [
      {
        "label": "Greeted by Name with Warm Smiles & Welcome Drinks 🥂",
        "sentiment": "positive",
        "keywords": [
          "warm welcome drink",
          "personalized check in",
          "friendly front desk"
        ]
      },
      {
        "label": "Luggage Handled Instantly by Courteous Bell Staff 🧳",
        "sentiment": "positive",
        "keywords": [
          "prompt bellhop service",
          "effortless luggage handling"
        ]
      },
      {
        "label": "Express VIP Check-in Completed in 2 Minutes ⚡",
        "sentiment": "positive",
        "keywords": [
          "fast check in",
          "zero front desk wait"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_02",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How helpful was the hotel concierge with bookings and local tips?",
    "options": [
      {
        "label": "Secured Impossible Restaurant Reservations Effortlessly 🍽️",
        "sentiment": "positive",
        "keywords": [
          "miracle concierge",
          "vip restaurant booking"
        ]
      },
      {
        "label": "Curated Fantastic Local Hidden-Gem Recommendations 🗺️",
        "sentiment": "positive",
        "keywords": [
          "expert concierge tips",
          "insider local guide"
        ]
      },
      {
        "label": "Arranged Private Transportation Seamlessly 🚗",
        "sentiment": "positive",
        "keywords": [
          "private airport transfer",
          "prompt valet"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_03",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How responsive was the staff to any special requests during your stay?",
    "options": [
      {
        "label": "Extra Pillows / Amenities Delivered in 5 Minutes ⏱️",
        "sentiment": "positive",
        "keywords": [
          "lightning fast room service",
          "attentive hotel team"
        ]
      },
      {
        "label": "Accommodated Early Check-in Without Hesitation 🌅",
        "sentiment": "positive",
        "keywords": [
          "early check in granted",
          "generous hospitality"
        ]
      },
      {
        "label": "Exceeded Every Expectation with Genuine Warmth ❤️",
        "sentiment": "positive",
        "keywords": [
          "exceptional hotel service",
          "genuine hospitality"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_04",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How did the team acknowledge special milestones (anniversary, birthday, honeymoon)?",
    "options": [
      {
        "label": "Chilled Champagne & Handwritten Welcome Card 🍾",
        "sentiment": "positive",
        "keywords": [
          "anniversary champagne",
          "handwritten welcome note"
        ]
      },
      {
        "label": "Surprise Room Upgrade to an Executive Suite! 🌟",
        "sentiment": "positive",
        "keywords": [
          "complimentary suite upgrade",
          "vip treatment"
        ]
      },
      {
        "label": "Made Our Celebration Truly Magical ✨",
        "sentiment": "positive",
        "keywords": [
          "magical honeymoon stay",
          "memorable celebration"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_05",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How was the valet and parking team?",
    "options": [
      {
        "label": "Car Brought Around Promptly with Bottled Water Inside 🚗",
        "sentiment": "positive",
        "keywords": [
          "fast valet service",
          "car ready with water"
        ]
      },
      {
        "label": "Courteous & Careful with Our Vehicle 🔑",
        "sentiment": "positive",
        "keywords": [
          "careful valet staff",
          "professional greeting"
        ]
      },
      {
        "label": "Effortless Digital Valet Ticket System 📲",
        "sentiment": "positive",
        "keywords": [
          "digital valet call",
          "seamless parking"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_06",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How prompt and seamless was the check-out process?",
    "options": [
      {
        "label": "Express 1-Click Mobile Check-Out 📲",
        "sentiment": "positive",
        "keywords": [
          "express checkout",
          "contactless departure"
        ]
      },
      {
        "label": "Accurate Final Folio with Zero Surprise Charges 🧾",
        "sentiment": "positive",
        "keywords": [
          "clear hotel bill",
          "honest pricing"
        ]
      },
      {
        "label": "Warm Farewell from the Entire Lobby Team 👋",
        "sentiment": "positive",
        "keywords": [
          "gracious farewell",
          "warm hospitality"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_07",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "How did the general manager and floor supervisors engage with guests?",
    "options": [
      {
        "label": "Manager Personally Checked In to Ensure a Great Stay 🤝",
        "sentiment": "positive",
        "keywords": [
          "attentive general manager",
          "caring hotel management"
        ]
      },
      {
        "label": "World-Class 5-Star Service Standards Everywhere 🏅",
        "sentiment": "positive",
        "keywords": [
          "five star hospitality standards",
          "distinguished luxury"
        ]
      },
      {
        "label": "Staff Remembered Our Names and Preferences 🧠",
        "sentiment": "positive",
        "keywords": [
          "remembered guest preferences",
          "personalized luxury"
        ]
      }
    ]
  },
  {
    "id": "hot_srv_08",
    "category": "hospitality_service",
    "categoryLabel": "Front Desk & Concierge Care",
    "question": "Would you choose this hotel again for your next getaway or business trip?",
    "options": [
      {
        "label": "My Permanent Hotel Choice Whenever in Town! 🏆",
        "sentiment": "positive",
        "keywords": [
          "preferred luxury hotel",
          "will definitely return"
        ]
      },
      {
        "label": "Already Booking Our Next Family Holiday Here 🌴",
        "sentiment": "positive",
        "keywords": [
          "booked next vacation",
          "unbeatable hotel experience"
        ]
      },
      {
        "label": "Highest Recommendation for Discerning Travelers 🌟",
        "sentiment": "positive",
        "keywords": [
          "best hotel in the region",
          "top luxury recommendation"
        ]
      }
    ]
  },
  {
    "id": "hot_din_01",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How was the breakfast buffet spread and quality?",
    "options": [
      {
        "label": "Lavish Buffet with Live Chef Egg / Omelet Station 🍳",
        "sentiment": "positive",
        "keywords": [
          "lavish breakfast buffet",
          "made to order omelets",
          "fresh bakery"
        ]
      },
      {
        "label": "Fresh Exotic Tropical Fruits & Artisanal Pastries 🥐",
        "sentiment": "positive",
        "keywords": [
          "fresh fruit spread",
          "gourmet breakfast"
        ]
      },
      {
        "label": "Barista-Made Specialty Coffees Served to Table ☕",
        "sentiment": "positive",
        "keywords": [
          "fresh cappuccino at breakfast",
          "attentive dining staff"
        ]
      }
    ]
  },
  {
    "id": "hot_din_02",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How was the 24/7 in-room dining (room service)?",
    "options": [
      {
        "label": "Delivered Piping Hot on an Elegant Silver Trolley 🛎️",
        "sentiment": "positive",
        "keywords": [
          "gourmet room service",
          "silver service trolley"
        ]
      },
      {
        "label": "Arrived in Under 25 Minutes with Perfect Orders ⏱️",
        "sentiment": "positive",
        "keywords": [
          "fast room service",
          "accurate orders"
        ]
      },
      {
        "label": "Delicious Late-Night Gourmet Comfort Food 🍔",
        "sentiment": "positive",
        "keywords": [
          "late night room dining",
          "comfort food luxury"
        ]
      }
    ]
  },
  {
    "id": "hot_din_03",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How did you find the hotel's fine dining restaurant or signature eatery?",
    "options": [
      {
        "label": "Michelin-Caliber Culinary Flavors & Plating 🍽️",
        "sentiment": "positive",
        "keywords": [
          "fine dining excellence",
          "michelin caliber cuisine"
        ]
      },
      {
        "label": "Extensive Sommelier-Curated Wine Cellar 🍷",
        "sentiment": "positive",
        "keywords": [
          "impressive wine cellar",
          "expert pairings"
        ]
      },
      {
        "label": "Romantic, Intimate Setting with Live Piano Music 🎹",
        "sentiment": "positive",
        "keywords": [
          "romantic dinner ambiance",
          "live acoustic music"
        ]
      }
    ]
  },
  {
    "id": "hot_din_04",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How was the rooftop lounge or cocktail bar on-site?",
    "options": [
      {
        "label": "Spectacular Sunset Views & Signature Cocktails 🍸",
        "sentiment": "positive",
        "keywords": [
          "rooftop sunset view",
          "craft cocktails"
        ]
      },
      {
        "label": "Chic Vibe, Great Music & Sophisticated Crowd 🎷",
        "sentiment": "positive",
        "keywords": [
          "chic hotel lounge",
          "sophisticated crowd"
        ]
      },
      {
        "label": "Top-Tier Bartenders with Creative Mixology 🍹",
        "sentiment": "positive",
        "keywords": [
          "skilled mixologists",
          "inventive drinks"
        ]
      }
    ]
  },
  {
    "id": "hot_din_05",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "Were dietary preferences (vegan, gluten-free, halal, dairy-free) accommodated well?",
    "options": [
      {
        "label": "Abundant Labeled Vegan & Gluten-Free Options 🥗",
        "sentiment": "positive",
        "keywords": [
          "dietary friendly buffet",
          "gluten free options"
        ]
      },
      {
        "label": "Chef Prepared Custom Meals with Genuine Care 👨‍🍳",
        "sentiment": "positive",
        "keywords": [
          "custom allergy meals",
          "accommodating chef"
        ]
      },
      {
        "label": "Almond, Oat & Soya Milks Readily Available 🌾",
        "sentiment": "positive",
        "keywords": [
          "alternative milk options",
          "thoughtful dining"
        ]
      }
    ]
  },
  {
    "id": "hot_din_06",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How was the poolside food and beverage service?",
    "options": [
      {
        "label": "Chilled Cocktails & Fresh Bites Delivered to Cabana 🏖️",
        "sentiment": "positive",
        "keywords": [
          "poolside cabana service",
          "refreshing cocktails"
        ]
      },
      {
        "label": "Complimentary Frozen Fruit Skewers and Popsicles 🍉",
        "sentiment": "positive",
        "keywords": [
          "complimentary pool amenities",
          "attentive pool attendants"
        ]
      },
      {
        "label": "Fast, Smiling Service with Zero Delays ☀️",
        "sentiment": "positive",
        "keywords": [
          "prompt poolside service",
          "friendly staff"
        ]
      }
    ]
  },
  {
    "id": "hot_din_07",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How was the coffee and afternoon tea service in the lounge?",
    "options": [
      {
        "label": "Traditional English Afternoon Tea with Scones & Clotted Cream 🫖",
        "sentiment": "positive",
        "keywords": [
          "high tea service",
          "fresh scones and clotted cream"
        ]
      },
      {
        "label": "Exquisite Finger Sandwiches & Petits Fours 🥪",
        "sentiment": "positive",
        "keywords": [
          "artisan finger sandwiches",
          "luxurious tea experience"
        ]
      },
      {
        "label": "Peaceful Atmosphere for Relaxed Conversations 🛋️",
        "sentiment": "positive",
        "keywords": [
          "peaceful lounge",
          "elegant afternoon tea"
        ]
      }
    ]
  },
  {
    "id": "hot_din_08",
    "category": "dining_breakfast",
    "categoryLabel": "Breakfast Buffet & Dining",
    "question": "How would you rate the overall culinary and dining program?",
    "options": [
      {
        "label": "A Food Lover's Paradise from Morning to Midnight 🏆",
        "sentiment": "positive",
        "keywords": [
          "culinary paradise",
          "outstanding hotel dining"
        ]
      },
      {
        "label": "Did Not Feel the Need to Eat Outside the Resort! 🍴",
        "sentiment": "positive",
        "keywords": [
          "resort dining perfection",
          "exquisite food"
        ]
      },
      {
        "label": "5 Stars Across Every Meal and Drink ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star hotel cuisine",
          "exceptional dining"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_01",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "How was the swimming pool and sun terrace area?",
    "options": [
      {
        "label": "Crystal Clear Infinity Pool with Plush Loungers 🏊",
        "sentiment": "positive",
        "keywords": [
          "stunning infinity pool",
          "heated swimming pool",
          "plush daybeds"
        ]
      },
      {
        "label": "Attentive Pool Staff with Fresh Towels & Spritzes 🧴",
        "sentiment": "positive",
        "keywords": [
          "poolside towel service",
          "refreshing mist"
        ]
      },
      {
        "label": "Peaceful Adult-Only Quiet Sanctuary Section 🌿",
        "sentiment": "positive",
        "keywords": [
          "adults only pool",
          "tranquil relaxation"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_02",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "Did you experience the hotel spa and wellness facilities?",
    "options": [
      {
        "label": "Deeply Relaxing Massage by Master Therapists 💆",
        "sentiment": "positive",
        "keywords": [
          "heavenly massage",
          "world-class hotel spa",
          "aromatherapy"
        ]
      },
      {
        "label": "Revitalizing Sauna, Steam Room & Vitality Pool 🧖",
        "sentiment": "positive",
        "keywords": [
          "steam room and sauna",
          "hydrotherapy pool"
        ]
      },
      {
        "label": "Left Feeling Completely Renewed and Stress-Free ✨",
        "sentiment": "positive",
        "keywords": [
          "restored vitality",
          "pure relaxation"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_03",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "How was the fitness center and workout gym?",
    "options": [
      {
        "label": "Equipped with Top-Tier Technogym / Life Fitness Gear 🏋️",
        "sentiment": "positive",
        "keywords": [
          "state of the art gym",
          "technogym equipment"
        ]
      },
      {
        "label": "Chilled Towels, Fresh Apples & Cold Bottled Water 🍏",
        "sentiment": "positive",
        "keywords": [
          "gym amenities",
          "chilled towels and water"
        ]
      },
      {
        "label": "Bright Panoramic Windows with Motivating Views 🌅",
        "sentiment": "positive",
        "keywords": [
          "panoramic gym view",
          "spacious workout area"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_04",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "How well-maintained were the resort grounds, gardens and public spaces?",
    "options": [
      {
        "label": "Lush, Meticulously Landscaped Tropical Gardens 🌴",
        "sentiment": "positive",
        "keywords": [
          "manicured hotel grounds",
          "scenic gardens"
        ]
      },
      {
        "label": "Spotless Common Areas and Grand Marble Lobby 🏛️",
        "sentiment": "positive",
        "keywords": [
          "grand lobby",
          "immaculate public spaces"
        ]
      },
      {
        "label": "Photogenic Architecture at Every Turn 📸",
        "sentiment": "positive",
        "keywords": [
          "stunning hotel architecture",
          "instagram worthy grounds"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_05",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "Did you utilize the executive club lounge or business center?",
    "options": [
      {
        "label": "Quiet Executive Lounge with Complimentary Evening Canapés 🍷",
        "sentiment": "positive",
        "keywords": [
          "executive lounge access",
          "free evening wine and hors d'oeuvres"
        ]
      },
      {
        "label": "High-Speed Private Workstations and Meeting Rooms 💼",
        "sentiment": "positive",
        "keywords": [
          "private meeting room",
          "seamless business trip"
        ]
      },
      {
        "label": "Dedicated Concierge Inside the Lounge 🤝",
        "sentiment": "positive",
        "keywords": [
          "club floor concierge",
          "vip lounge experience"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_06",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "If traveling with children, how was the kids' club or family amenities?",
    "options": [
      {
        "label": "Fun, Supervised Kids' Activities Kept Little Ones Thrilled 🧒",
        "sentiment": "positive",
        "keywords": [
          "wonderful kids club",
          "family friendly luxury"
        ]
      },
      {
        "label": "Child-Safe Shallow Pool and Play Equipment 🧸",
        "sentiment": "positive",
        "keywords": [
          "shallow kids pool",
          "family pool area"
        ]
      },
      {
        "label": "Parents Got to Relax Completely! 🧘",
        "sentiment": "positive",
        "keywords": [
          "relaxing family vacation",
          "accommodating family hotel"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_07",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "How was the hotel's location and accessibility to attractions?",
    "options": [
      {
        "label": "Prime Central Location, Walkable to Top Attractions 📍",
        "sentiment": "positive",
        "keywords": [
          "prime location",
          "walkable to sights and dining"
        ]
      },
      {
        "label": "Quiet, Secluded Sanctuary Away from City Noise 🌿",
        "sentiment": "positive",
        "keywords": [
          "peaceful oasis",
          "secluded luxury retreat"
        ]
      },
      {
        "label": "Direct Beachfront / Lakefront Access 🏖️",
        "sentiment": "positive",
        "keywords": [
          "direct beach access",
          "waterfront hotel"
        ]
      }
    ]
  },
  {
    "id": "hot_amn_08",
    "category": "hotel_amenities",
    "categoryLabel": "Pool, Spa & Resort Amenities",
    "question": "How would you summarize your overall stay experience?",
    "options": [
      {
        "label": "The Pinnacle of Luxury, Hospitality and Relaxation 🏆",
        "sentiment": "positive",
        "keywords": [
          "pinnacle of luxury",
          "best resort stay ever"
        ]
      },
      {
        "label": "An Unforgettable Experience in Every Way ✨",
        "sentiment": "positive",
        "keywords": [
          "unforgettable getaway",
          "pure magic"
        ]
      },
      {
        "label": "5 Stars Across Every Detail! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star hospitality",
          "impeccable luxury hotel"
        ]
      }
    ]
  },
  {
    "id": "hot_val_01",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "How secure and safe did you feel throughout the property?",
    "options": [
      {
        "label": "24/7 Professional Security & Keycard Lift Access 🛡️",
        "sentiment": "positive",
        "keywords": [
          "secure hotel",
          "safe property"
        ]
      },
      {
        "label": "Discreet & Vigilant Security Team 👮",
        "sentiment": "positive",
        "keywords": [
          "discreet security",
          "peace of mind"
        ]
      },
      {
        "label": "Felt Completely Safe Traveling Solo / with Family 👨‍👩‍👧",
        "sentiment": "positive",
        "keywords": [
          "safe solo travel",
          "family safe hotel"
        ]
      }
    ]
  },
  {
    "id": "hot_val_02",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "How was the transparency of your bill and room charges?",
    "options": [
      {
        "label": "100% Transparent Folio with No Hidden Resort Fees 💵",
        "sentiment": "positive",
        "keywords": [
          "transparent billing",
          "no hidden resort fees"
        ]
      },
      {
        "label": "Clear Itemization of Dinners, Spa and Minibar 🧾",
        "sentiment": "positive",
        "keywords": [
          "itemized invoice",
          "accurate room charges"
        ]
      },
      {
        "label": "Smooth Deposit Release upon Checkout 💳",
        "sentiment": "positive",
        "keywords": [
          "prompt deposit release",
          "hassle free billing"
        ]
      }
    ]
  },
  {
    "id": "hot_val_03",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "Did the experience live up to the pricing and expectations?",
    "options": [
      {
        "label": "Exceeded Every Expectation, Worth Every Cent 💎",
        "sentiment": "positive",
        "keywords": [
          "worth every dollar",
          "exceeded expectations"
        ]
      },
      {
        "label": "Superior Value Compared to Other 5-Star Properties 🏅",
        "sentiment": "positive",
        "keywords": [
          "best luxury value",
          "fair high-end rates"
        ]
      },
      {
        "label": "Unrivaled Level of Quality & Attention to Detail 🌟",
        "sentiment": "positive",
        "keywords": [
          "unrivaled luxury",
          "meticulous attention to detail"
        ]
      }
    ]
  },
  {
    "id": "hot_val_04",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "How was the luggage storage service before check-in or after check-out?",
    "options": [
      {
        "label": "Stored Securely with Tagged Claim Checks 🧳",
        "sentiment": "positive",
        "keywords": [
          "secure luggage hold",
          "tagged bag check"
        ]
      },
      {
        "label": "Allowed Us to Enjoy the Pool After Check-Out ☀️",
        "sentiment": "positive",
        "keywords": [
          "pool access after checkout",
          "generous hospitality"
        ]
      },
      {
        "label": "Bags Were Already Placed in Our Car at Valet 🚗",
        "sentiment": "positive",
        "keywords": [
          "seamless bag transfer",
          "thoughtful bell staff"
        ]
      }
    ]
  },
  {
    "id": "hot_val_05",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "How was the ambient lighting and nighttime safety around the grounds?",
    "options": [
      {
        "label": "Beautifully Illuminated Walkways and Paths 🏮",
        "sentiment": "positive",
        "keywords": [
          "well lit pathways",
          "romantic nighttime lighting"
        ]
      },
      {
        "label": "Easy to Navigate at Any Hour of the Night 🌙",
        "sentiment": "positive",
        "keywords": [
          "clear night signage",
          "comfortable navigation"
        ]
      },
      {
        "label": "Peaceful and Quiet Atmosphere After Hours 🤫",
        "sentiment": "positive",
        "keywords": [
          "quiet nighttime grounds",
          "peaceful retreat"
        ]
      }
    ]
  },
  {
    "id": "hot_val_06",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "How well did the hotel handle sustainability and eco-conscious practices?",
    "options": [
      {
        "label": "Plastic-Free Amenities & Large Ceramic Dispensers 🌿",
        "sentiment": "positive",
        "keywords": [
          "eco-friendly luxury",
          "zero single use plastics"
        ]
      },
      {
        "label": "Towel Re-Use Program Respected Thoughtfully ♻️",
        "sentiment": "positive",
        "keywords": [
          "sustainable hospitality",
          "water conservation"
        ]
      },
      {
        "label": "Locally Sourced Ingredients in All Restaurants 🥕",
        "sentiment": "positive",
        "keywords": [
          "farm to table dining",
          "sustainable sourcing"
        ]
      }
    ]
  },
  {
    "id": "hot_val_07",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "How was the consistency of service across all departments?",
    "options": [
      {
        "label": "Uniform Excellence from Bellman to General Manager 🏆",
        "sentiment": "positive",
        "keywords": [
          "seamless team service",
          "uniform excellence"
        ]
      },
      {
        "label": "Every Staff Member Greeted Us with a Smile 😊",
        "sentiment": "positive",
        "keywords": [
          "warm smiling team",
          "consistent 5-star service"
        ]
      },
      {
        "label": "A Masterclass in True Luxury Hospitality 🎩",
        "sentiment": "positive",
        "keywords": [
          "masterclass in hospitality",
          "distinguished service"
        ]
      }
    ]
  },
  {
    "id": "hot_val_08",
    "category": "safety_value",
    "categoryLabel": "Safety, Value & Overall Excellence",
    "question": "What is your final verdict on this hotel / resort?",
    "options": [
      {
        "label": "An Absolute Gem That Deserves Worldwide Acclaim 🌟",
        "sentiment": "positive",
        "keywords": [
          "world class resort",
          "gem of a hotel"
        ]
      },
      {
        "label": "The Highlight of Our Entire Vacation 🌴",
        "sentiment": "positive",
        "keywords": [
          "vacation highlight",
          "unmatched memory"
        ]
      },
      {
        "label": "Perfection in Every Sense of the Word! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "pure perfection",
          "flawless 5-star stay"
        ]
      }
    ]
  }
]
};
