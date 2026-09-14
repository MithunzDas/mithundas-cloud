import { IndustryConfig } from "./types";

export const RESTAURANT_POOL: IndustryConfig = {
  id: "RESTAURANT",
  name: "Restaurant, Fine Dining & Bistro",
  icon: "🍽️",
  defaultPlaceHolder: "The Bistro & Grill",
  sampleReview: "Unbelievable culinary experience! The ribeye was cooked to absolute perfection, the wine pairing was spot on, and the ambiance made our evening unforgettable. Our server was attentive and warm. 5 stars! ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "rest_food_01",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "How was the flavor and taste of your food?",
    "options": [
      {
        "label": "Absolute Perfection! Rich, Deep Flavors 🤤",
        "sentiment": "positive",
        "keywords": [
          "delicious food",
          "bursting with flavor",
          "culinary excellence"
        ]
      },
      {
        "label": "Seasoned Just Right, Cooked to Perfection 🥩",
        "sentiment": "positive",
        "keywords": [
          "cooked to perfection",
          "tender and juicy"
        ]
      },
      {
        "label": "Fresh, High-Quality Ingredients You Can Taste 🌿",
        "sentiment": "positive",
        "keywords": [
          "fresh ingredients",
          "high quality dining"
        ]
      },
      {
        "label": "One of the Best Meals I've Had in Months 🏆",
        "sentiment": "positive",
        "keywords": [
          "best restaurant in town",
          "unforgettable meal"
        ]
      }
    ]
  },
  {
    "id": "rest_food_02",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "How was the temperature and freshness of the food served?",
    "options": [
      {
        "label": "Piping Hot Straight from the Kitchen 🔥",
        "sentiment": "positive",
        "keywords": [
          "piping hot",
          "served fresh"
        ]
      },
      {
        "label": "Crisp Salads & Fresh Vegetables 🥗",
        "sentiment": "positive",
        "keywords": [
          "crisp fresh vegetables",
          "refreshing salad"
        ]
      },
      {
        "label": "Perfect Temperature from First Bite to Last 👍",
        "sentiment": "positive",
        "keywords": [
          "perfect food temperature",
          "flawless execution"
        ]
      }
    ]
  },
  {
    "id": "rest_food_03",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "How was the plating and visual presentation of your dishes?",
    "options": [
      {
        "label": "Stunning, Fine-Dining Masterpiece Plating 🎨",
        "sentiment": "positive",
        "keywords": [
          "gorgeous plating",
          "artistic food presentation"
        ]
      },
      {
        "label": "Generous Portions and Vibrant Colors 🌈",
        "sentiment": "positive",
        "keywords": [
          "generous portion sizes",
          "vibrant appetizing dishes"
        ]
      },
      {
        "label": "Instagram-Worthy Presentation 📸",
        "sentiment": "positive",
        "keywords": [
          "picture perfect food",
          "beautiful presentation"
        ]
      }
    ]
  },
  {
    "id": "rest_food_04",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "Did you try the chef's signature dish or house specialty?",
    "options": [
      {
        "label": "Signature Dish Was Mind-Blowing! 🌟",
        "sentiment": "positive",
        "keywords": [
          "must try signature dish",
          "house specialty excellence"
        ]
      },
      {
        "label": "Unique Twist on Classic Flavors 🍴",
        "sentiment": "positive",
        "keywords": [
          "creative culinary twist",
          "innovative recipes"
        ]
      },
      {
        "label": "Will Be Craving This Dish Every Week! 🤤",
        "sentiment": "positive",
        "keywords": [
          "crave-worthy food",
          "memorable flavor"
        ]
      }
    ]
  },
  {
    "id": "rest_food_05",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "How did you find the meat, poultry or seafood tenderness and quality?",
    "options": [
      {
        "label": "Melt-in-Your-Mouth Tender & Juicy 🥩",
        "sentiment": "positive",
        "keywords": [
          "melt in your mouth tender",
          "succulent meat"
        ]
      },
      {
        "label": "Fresh, Flaky & Delicate Seafood 🐟",
        "sentiment": "positive",
        "keywords": [
          "fresh seafood",
          "catch of the day quality"
        ]
      },
      {
        "label": "Perfect Sear and Caramelization 🍳",
        "sentiment": "positive",
        "keywords": [
          "perfect sear",
          "expert grilling"
        ]
      }
    ]
  },
  {
    "id": "rest_food_06",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "How was the balance of spices, herbs, and sauces?",
    "options": [
      {
        "label": "Harmonious Balance of Spices & Aromas 🌿",
        "sentiment": "positive",
        "keywords": [
          "harmonious spices",
          "rich aromatic sauces"
        ]
      },
      {
        "label": "House-Made Sauces Were Incredible! 🍯",
        "sentiment": "positive",
        "keywords": [
          "house made sauces",
          "signature dressings"
        ]
      },
      {
        "label": "Authentic, Traditional Recipe Taste 🍲",
        "sentiment": "positive",
        "keywords": [
          "authentic traditional taste",
          "real culinary craft"
        ]
      }
    ]
  },
  {
    "id": "rest_food_07",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "How did you like the desserts or sweet finishes?",
    "options": [
      {
        "label": "Heavenly Dessert to Cap Off the Night 🍰",
        "sentiment": "positive",
        "keywords": [
          "decadent dessert",
          "sweet perfection"
        ]
      },
      {
        "label": "Rich, Decadent & Not Overly Sweet 🍫",
        "sentiment": "positive",
        "keywords": [
          "rich chocolate dessert",
          "balanced sweetness"
        ]
      },
      {
        "label": "Freshly Made & Artisanal 🍨",
        "sentiment": "positive",
        "keywords": [
          "artisanal dessert",
          "fresh pastry chef quality"
        ]
      }
    ]
  },
  {
    "id": "rest_food_08",
    "category": "food_quality",
    "categoryLabel": "Food Taste, Flavor & Quality",
    "question": "Overall, how does this restaurant's food compare to other spots in the city?",
    "options": [
      {
        "label": "Hands Down the Best in the Entire City 🏆",
        "sentiment": "positive",
        "keywords": [
          "best food in town",
          "top rated restaurant"
        ]
      },
      {
        "label": "Worth Every Single Penny & More 💎",
        "sentiment": "positive",
        "keywords": [
          "worth every penny",
          "exceptional dining value"
        ]
      },
      {
        "label": "Can't Wait to Return and Try More Dishes! 🔄",
        "sentiment": "positive",
        "keywords": [
          "already planning next visit",
          "loyal customer"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_01",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "How attentive and friendly was your server / waiter?",
    "options": [
      {
        "label": "Attentive Without Being Intrusive 🏆",
        "sentiment": "positive",
        "keywords": [
          "attentive waiter",
          "flawless table service",
          "friendly server"
        ]
      },
      {
        "label": "Anticipated Every Need Before We Asked 👍",
        "sentiment": "positive",
        "keywords": [
          "anticipated needs",
          "top notch service"
        ]
      },
      {
        "label": "Warm, Courteous & Smiling Throughout 😊",
        "sentiment": "positive",
        "keywords": [
          "warm hospitality",
          "polite waiting staff"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_02",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "How was the greeting and seating experience at the front door?",
    "options": [
      {
        "label": "Seated Immediately with a Warm Welcome 🚪",
        "sentiment": "positive",
        "keywords": [
          "warm host greeting",
          "seated right away"
        ]
      },
      {
        "label": "Friendly Host Accommodated Table Preference 🪑",
        "sentiment": "positive",
        "keywords": [
          "great table placement",
          "accommodating host"
        ]
      },
      {
        "label": "Efficient Reservation Check-in 📋",
        "sentiment": "positive",
        "keywords": [
          "smooth reservation",
          "prompt host team"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_03",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "Did the staff provide helpful menu recommendations?",
    "options": [
      {
        "label": "Server's Recommendations Were Spot-On! 🎯",
        "sentiment": "positive",
        "keywords": [
          "spot on food recommendations",
          "knowledgeable server"
        ]
      },
      {
        "label": "Deep Knowledge of Daily Specials & Ingredients 📖",
        "sentiment": "positive",
        "keywords": [
          "explained menu in detail",
          "daily specials guidance"
        ]
      },
      {
        "label": "Guided Us to Amazing Drink Pairings 🍷",
        "sentiment": "positive",
        "keywords": [
          "great wine pairing",
          "cocktail recommendation"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_04",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "How fast were drinks, bread and water refilled at your table?",
    "options": [
      {
        "label": "Water Glasses Never Reached Empty 💧",
        "sentiment": "positive",
        "keywords": [
          "constant water refills",
          "attentive bussers"
        ]
      },
      {
        "label": "Drinks Arrived Within Minutes of Ordering 🍹",
        "sentiment": "positive",
        "keywords": [
          "prompt beverage service",
          "quick drink orders"
        ]
      },
      {
        "label": "Prompt Table Maintenance Throughout 🧽",
        "sentiment": "positive",
        "keywords": [
          "clean table maintenance",
          "seamless dining"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_05",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "How accommodating was the kitchen with dietary requests or allergies?",
    "options": [
      {
        "label": "Handled Allergies with Extreme Care & Precision 🛡️",
        "sentiment": "positive",
        "keywords": [
          "allergy friendly restaurant",
          "careful kitchen precautions"
        ]
      },
      {
        "label": "Customized Dishes for Gluten-Free / Vegan Needs 🥗",
        "sentiment": "positive",
        "keywords": [
          "accommodating vegetarian options",
          "gluten free choices"
        ]
      },
      {
        "label": "Chef Personally Confirmed Dietary Modifications 👨‍🍳",
        "sentiment": "positive",
        "keywords": [
          "chef attended dietary needs",
          "caring staff"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_06",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "If celebrating a special occasion (birthday, anniversary), how was it recognized?",
    "options": [
      {
        "label": "Made the Celebration Truly Unforgettable! 🎉",
        "sentiment": "positive",
        "keywords": [
          "unforgettable anniversary dinner",
          "birthday celebration"
        ]
      },
      {
        "label": "Complimentary Dessert with a Candle 🕯️",
        "sentiment": "positive",
        "keywords": [
          "thoughtful birthday treat",
          "generous hospitality"
        ]
      },
      {
        "label": "Personalized Card or Warm Wishes from Staff 💌",
        "sentiment": "positive",
        "keywords": [
          "personalized touch",
          "delightful experience"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_07",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "How prompt was the bill delivery and payment handling?",
    "options": [
      {
        "label": "Bill Delivered Promptly, No Awkward Waiting 💳",
        "sentiment": "positive",
        "keywords": [
          "fast checkout",
          "prompt bill delivery"
        ]
      },
      {
        "label": "Split Bill Smoothly with Zero Confusion 🧾",
        "sentiment": "positive",
        "keywords": [
          "easy bill split",
          "accurate invoice"
        ]
      },
      {
        "label": "Contactless & Fast Payment Options 📲",
        "sentiment": "positive",
        "keywords": [
          "contactless payment",
          "seamless checkout"
        ]
      }
    ]
  },
  {
    "id": "rest_srv_08",
    "category": "hospitality_service",
    "categoryLabel": "Warm Hospitality & Attentive Service",
    "question": "How did the management or floor supervisor treat guests?",
    "options": [
      {
        "label": "Manager Stopped by to Ensure Everything Was Great 👍",
        "sentiment": "positive",
        "keywords": [
          "attentive manager",
          "caring restaurant management"
        ]
      },
      {
        "label": "Felt Like a VIP Regular on My First Visit 🌟",
        "sentiment": "positive",
        "keywords": [
          "vip dining experience",
          "valued guest"
        ]
      },
      {
        "label": "Flawless Service From Top to Bottom 🏆",
        "sentiment": "positive",
        "keywords": [
          "5 star restaurant service",
          "impeccable staff"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_01",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "How would you describe the restaurant's atmosphere and interior design?",
    "options": [
      {
        "label": "Gorgeous Decor & Warm, Romantic Lighting 🕯️",
        "sentiment": "positive",
        "keywords": [
          "beautiful decor",
          "romantic lighting",
          "cozy atmosphere"
        ]
      },
      {
        "label": "Vibrant, Upbeat & Trendy Energy 🎉",
        "sentiment": "positive",
        "keywords": [
          "great vibe",
          "lively atmosphere"
        ]
      },
      {
        "label": "Intimate, Sophisticated & Classy 🍷",
        "sentiment": "positive",
        "keywords": [
          "sophisticated dining",
          "classy interior"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_02",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "How was the background music and acoustic volume?",
    "options": [
      {
        "label": "Curated Playlist at the Perfect Volume 🎵",
        "sentiment": "positive",
        "keywords": [
          "great background music",
          "perfect playlist volume"
        ]
      },
      {
        "label": "Easy to Have Intimate Conversations 💬",
        "sentiment": "positive",
        "keywords": [
          "easy conversation",
          "good acoustics"
        ]
      },
      {
        "label": "Set a Relaxing, Feel-Good Mood 🎷",
        "sentiment": "positive",
        "keywords": [
          "relaxing mood",
          "ambient dining vibe"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_03",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "How was the comfort of the chairs, booths, and table spacing?",
    "options": [
      {
        "label": "Spacious Booths & Plush Comfortable Seating 🛋️",
        "sentiment": "positive",
        "keywords": [
          "comfortable seating",
          "cozy booth"
        ]
      },
      {
        "label": "Generous Distance Between Tables for Privacy 🛡️",
        "sentiment": "positive",
        "keywords": [
          "private tables",
          "generous spacing"
        ]
      },
      {
        "label": "Clean, Sturdy & Well-Appointed Tables 🪑",
        "sentiment": "positive",
        "keywords": [
          "sturdy table setup",
          "inviting dining space"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_04",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "How was the outdoor patio or terrace dining (if applicable)?",
    "options": [
      {
        "label": "Charming Patio with Heaters & String Lights 🏮",
        "sentiment": "positive",
        "keywords": [
          "charming patio dining",
          "cozy outdoor heaters"
        ]
      },
      {
        "label": "Breezy, Scenic & Wonderful Outdoor Vibe 🌿",
        "sentiment": "positive",
        "keywords": [
          "scenic terrace",
          "delightful alfresco dining"
        ]
      },
      {
        "label": "Pet-Friendly & Welcoming Patio Area 🐾",
        "sentiment": "positive",
        "keywords": [
          "dog friendly patio",
          "relaxed outdoor seating"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_05",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "Is this a great venue for date nights, business dinners, or family gatherings?",
    "options": [
      {
        "label": "The Ultimate Date Night Spot! ❤️",
        "sentiment": "positive",
        "keywords": [
          "perfect date night restaurant",
          "romantic dinner"
        ]
      },
      {
        "label": "Ideal for Business Dinners & Entertaining Clients 💼",
        "sentiment": "positive",
        "keywords": [
          "impressive client dinner",
          "upscale business lunch"
        ]
      },
      {
        "label": "Wonderful for Family Celebrations 👨‍👩‍👧‍👦",
        "sentiment": "positive",
        "keywords": [
          "family friendly celebration",
          "versatile dining spot"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_06",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "How was the bar or cocktail lounge area?",
    "options": [
      {
        "label": "Vibrant Bar with Master Mixologists 🍸",
        "sentiment": "positive",
        "keywords": [
          "craft cocktail lounge",
          "skilled mixologist"
        ]
      },
      {
        "label": "Great Happy Hour & High-Top Seating 🍻",
        "sentiment": "positive",
        "keywords": [
          "fun happy hour",
          "cozy bar counter"
        ]
      },
      {
        "label": "Extensive Wine & Spirit Selection 🍷",
        "sentiment": "positive",
        "keywords": [
          "curated wine list",
          "impressive spirit selection"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_07",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "How was the indoor temperature and climate control?",
    "options": [
      {
        "label": "Comfortably Cool and Well-Ventilated ❄️",
        "sentiment": "positive",
        "keywords": [
          "comfortable room temp",
          "well air-conditioned"
        ]
      },
      {
        "label": "Cozy & Warm on a Chilly Evening 🔥",
        "sentiment": "positive",
        "keywords": [
          "cozy fireplace warmth",
          "inviting ambiance"
        ]
      },
      {
        "label": "Fresh Air Flow with Zero Kitchen Smoke 🍃",
        "sentiment": "positive",
        "keywords": [
          "smoke free dining room",
          "fresh ventilation"
        ]
      }
    ]
  },
  {
    "id": "rest_amb_08",
    "category": "ambiance_vibe",
    "categoryLabel": "Ambiance, Atmosphere & Decor",
    "question": "Overall, what rating would you give the dining vibe and aesthetic?",
    "options": [
      {
        "label": "10/10 Aesthetic and Vibe! 🌟",
        "sentiment": "positive",
        "keywords": [
          "10/10 dining vibe",
          "chic restaurant decor"
        ]
      },
      {
        "label": "Felt Like a Michelin-Star Level Setting 🏆",
        "sentiment": "positive",
        "keywords": [
          "michelin level atmosphere",
          "world class dining room"
        ]
      },
      {
        "label": "Warm, Welcoming & Memorable ✨",
        "sentiment": "positive",
        "keywords": [
          "memorable atmosphere",
          "unbeatable ambiance"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_01",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "How fast did appetizers and starters arrive after ordering?",
    "options": [
      {
        "label": "Arrived Quickly While Drinks Were Fresh ⚡",
        "sentiment": "positive",
        "keywords": [
          "prompt appetizers",
          "fast kitchen service"
        ]
      },
      {
        "label": "Perfect Pacing Before the Main Courses ⏱️",
        "sentiment": "positive",
        "keywords": [
          "well paced courses",
          "smooth timing"
        ]
      },
      {
        "label": "Hot & Crisp in Record Time 🔥",
        "sentiment": "positive",
        "keywords": [
          "quick starters",
          "fresh and fast"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_02",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "How was the timing between the appetizers and main entrees?",
    "options": [
      {
        "label": "Flawless Pacing, Never Rushed or Delayed ⏳",
        "sentiment": "positive",
        "keywords": [
          "flawless course pacing",
          "unrushed dining"
        ]
      },
      {
        "label": "Entrees Arrived Right as Starters Were Cleared 🍽️",
        "sentiment": "positive",
        "keywords": [
          "seamless course transition",
          "prompt clearing"
        ]
      },
      {
        "label": "Relaxed, Leisurely Dining Experience 🍷",
        "sentiment": "positive",
        "keywords": [
          "leisurely dinner",
          "relaxing pace"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_03",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "Even during peak busy hours, how was the kitchen turnaround?",
    "options": [
      {
        "label": "Impressively Fast Even with a Packed House 🏆",
        "sentiment": "positive",
        "keywords": [
          "fast during peak rush",
          "impressive kitchen speed"
        ]
      },
      {
        "label": "Zero Disruption in Quality or Temperature 🔥",
        "sentiment": "positive",
        "keywords": [
          "consistent quality under rush",
          "reliable kitchen"
        ]
      },
      {
        "label": "Handled the Busy Friday Night Crowd Effortlessly 👏",
        "sentiment": "positive",
        "keywords": [
          "well organized dinner rush",
          "efficient team"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_04",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "How quickly were empty plates and glasses cleared from your table?",
    "options": [
      {
        "label": "Cleared Discretely and Immediately 🧽",
        "sentiment": "positive",
        "keywords": [
          "quick plate clearing",
          "attentive table staff"
        ]
      },
      {
        "label": "Table Remained Clean Throughout the Meal ✨",
        "sentiment": "positive",
        "keywords": [
          "spotless table management",
          "clean dining area"
        ]
      },
      {
        "label": "Fresh Silverware Provided for Every Course 🍴",
        "sentiment": "positive",
        "keywords": [
          "fresh cutlery between courses",
          "fine service standards"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_05",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "How was the speed for lunchtime dining if you were on a schedule?",
    "options": [
      {
        "label": "In and Out in 45 Minutes for Work Lunch ⏱️",
        "sentiment": "positive",
        "keywords": [
          "quick business lunch",
          "fast lunch turnaround"
        ]
      },
      {
        "label": "Quick Service Without Compromising Gourmet Quality 🥪",
        "sentiment": "positive",
        "keywords": [
          "speedy gourmet lunch",
          "time efficient"
        ]
      },
      {
        "label": "Prompt Seating & Express Menu Options 🚀",
        "sentiment": "positive",
        "keywords": [
          "express lunch",
          "convenient dining"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_06",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "If you ordered takeout or curbside pickup, how fast and accurate was it?",
    "options": [
      {
        "label": "Packaged Meticulously, Ready at Exact Time 📦",
        "sentiment": "positive",
        "keywords": [
          "accurate takeout order",
          "ready on time"
        ]
      },
      {
        "label": "Food Was Piping Hot When I Got Home 🚗",
        "sentiment": "positive",
        "keywords": [
          "sturdy packaging",
          "hot takeout food"
        ]
      },
      {
        "label": "All Sauces, Utensils & Sides 100% Included 🥢",
        "sentiment": "positive",
        "keywords": [
          "nothing missing",
          "flawless takeout execution"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_07",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "Did the server check in at the exact right moments?",
    "options": [
      {
        "label": "Checked in After First Bites, Then Left Us to Enjoy 💬",
        "sentiment": "positive",
        "keywords": [
          "intuitive check in",
          "discreet waiting staff"
        ]
      },
      {
        "label": "Always Available with a Simple Eye Catch 👁️",
        "sentiment": "positive",
        "keywords": [
          "responsive server",
          "easy to flag down"
        ]
      },
      {
        "label": "Perfect Balance of Attentiveness and Space ⚖️",
        "sentiment": "positive",
        "keywords": [
          "balanced service",
          "considerate hospitality"
        ]
      }
    ]
  },
  {
    "id": "rest_spd_08",
    "category": "speed_timing",
    "categoryLabel": "Speed of Service & Kitchen Pacing",
    "question": "How smoothly did the whole dining timeline flow?",
    "options": [
      {
        "label": "Seamless Flow from Welcome to Farewell 🌟",
        "sentiment": "positive",
        "keywords": [
          "seamless dining experience",
          "smooth execution"
        ]
      },
      {
        "label": "One of the Most Efficient Dining Experiences Ever ⏱️",
        "sentiment": "positive",
        "keywords": [
          "efficient restaurant operation",
          "well coordinated"
        ]
      },
      {
        "label": "5 Stars for Service Speed & Hospitality! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "fast and friendly",
          "top tier restaurant"
        ]
      }
    ]
  },
  {
    "id": "rest_cln_01",
    "category": "cleanliness_setup",
    "categoryLabel": "Cleanliness & Sanitation",
    "question": "How was the cleanliness of the tables, chairs and menus?",
    "options": [
      {
        "label": "Spotless Table, Sanitized Menus & Polished Cutlery ✨",
        "sentiment": "positive",
        "keywords": [
          "spotless table",
          "polished cutlery",
          "sanitized menus"
        ]
      },
      {
        "label": "Crisp Linens and Sparkling Glassware 🍷",
        "sentiment": "positive",
        "keywords": [
          "clean glassware",
          "pristine table linen"
        ]
      },
      {
        "label": "Clean Floors and Tidy Surroundings 🧽",
        "sentiment": "positive",
        "keywords": [
          "clean restaurant floor",
          "tidy dining room"
        ]
      }
    ]
  },
  {
    "id": "rest_cln_02",
    "category": "cleanliness_setup",
    "categoryLabel": "Cleanliness & Sanitation",
    "question": "How clean and maintained were the customer restrooms?",
    "options": [
      {
        "label": "Immaculate, Fresh Scented & Fully Stocked Restrooms 🧼",
        "sentiment": "positive",
        "keywords": [
          "immaculate restrooms",
          "luxury hand soap"
        ]
      },
      {
        "label": "Clean, Dry Counters and Paper Towels Ready 🧻",
        "sentiment": "positive",
        "keywords": [
          "clean bathroom facilities",
          "well maintained"
        ]
      },
      {
        "label": "Upscale Hand Soaps & Lotions Provided 🌿",
        "sentiment": "positive",
        "keywords": [
          "premium hand wash",
          "upscale amenities"
        ]
      }
    ]
  },
  {
    "id": "rest_cln_03",
    "category": "cleanliness_setup",
    "categoryLabel": "Cleanliness & Sanitation",
    "question": "Did you observe high food safety and hygiene protocols?",
    "options": [
      {
        "label": "Staff Wore Clean Attire with Groomed Appearance 👔",
        "sentiment": "positive",
        "keywords": [
          "professional attire",
          "high hygiene standards"
        ]
      },
      {
        "label": "Visible Cleanliness in Open Kitchen / Pass 👨‍🍳",
        "sentiment": "positive",
        "keywords": [
          "spotless open kitchen",
          "hygienic food prep"
        ]
      },
      {
        "label": "Felt 100% Confident in Food Safety & Freshness 🛡️",
        "sentiment": "positive",
        "keywords": [
          "safe and sanitary food",
          "trusted restaurant"
        ]
      }
    ]
  },
  {
    "id": "rest_cln_04",
    "category": "cleanliness_setup",
    "categoryLabel": "Cleanliness & Sanitation",
    "question": "How orderly was the host stand and entrance foyer?",
    "options": [
      {
        "label": "Clutter-Free, Welcoming & Beautifully Maintained 🚪",
        "sentiment": "positive",
        "keywords": [
          "tidy entryway",
          "inviting reception"
        ]
      },
      {
        "label": "Prompt Coat Check / Umbrella Stand Available 🧥",
        "sentiment": "positive",
        "keywords": [
          "organized coat check",
          "thoughtful guest amenities"
        ]
      },
      {
        "label": "Clean Glass Doors and Polished Hardware ✨",
        "sentiment": "positive",
        "keywords": [
          "well maintained building",
          "gleaming entrance"
        ]
      }
    ]
  },
  {
    "id": "rest_var_01",
    "category": "menu_variety",
    "categoryLabel": "Menu Variety & Drink Selection",
    "question": "How was the breadth and variety of the food menu?",
    "options": [
      {
        "label": "Diverse Menu with Options for Every Palate 📖",
        "sentiment": "positive",
        "keywords": [
          "diverse menu options",
          "something for everyone"
        ]
      },
      {
        "label": "Great Balance of Seafood, Steaks & Pastas 🍝",
        "sentiment": "positive",
        "keywords": [
          "balanced dining choices",
          "rich variety"
        ]
      },
      {
        "label": "Exciting Seasonal Specialties Rotated In 🍁",
        "sentiment": "positive",
        "keywords": [
          "seasonal menu items",
          "innovative chef specials"
        ]
      }
    ]
  },
  {
    "id": "rest_var_02",
    "category": "menu_variety",
    "categoryLabel": "Menu Variety & Drink Selection",
    "question": "How would you rate the craft cocktail, beer or wine list?",
    "options": [
      {
        "label": "Exceptional Sommelier-Selected Wine List 🍷",
        "sentiment": "positive",
        "keywords": [
          "impressive wine list",
          "sommelier curated bottles"
        ]
      },
      {
        "label": "Creative Handcrafted Cocktails with Fresh Ingredients 🍸",
        "sentiment": "positive",
        "keywords": [
          "craft cocktail menu",
          "fresh cocktail garnishes"
        ]
      },
      {
        "label": "Great Local Craft Beers on Tap 🍺",
        "sentiment": "positive",
        "keywords": [
          "local craft beer",
          "great draft selection"
        ]
      }
    ]
  },
  {
    "id": "rest_var_03",
    "category": "menu_variety",
    "categoryLabel": "Menu Variety & Drink Selection",
    "question": "Were there high quality non-alcoholic or mocktail choices?",
    "options": [
      {
        "label": "Inventive, Delicious Zero-Proof Mocktails 🍹",
        "sentiment": "positive",
        "keywords": [
          "creative mocktails",
          "zero-proof beverages"
        ]
      },
      {
        "label": "Artisanal Sodas, Fresh Juices & Teas 🫖",
        "sentiment": "positive",
        "keywords": [
          "fresh pressed juices",
          "specialty teas"
        ]
      },
      {
        "label": "Thoughtful Non-Alcoholic Pairings Offered 🌿",
        "sentiment": "positive",
        "keywords": [
          "inclusive drink menu",
          "great non-alcoholic options"
        ]
      }
    ]
  },
  {
    "id": "rest_var_04",
    "category": "menu_variety",
    "categoryLabel": "Menu Variety & Drink Selection",
    "question": "Did the pricing offer good value for the dining experience?",
    "options": [
      {
        "label": "Outstanding Value for Fine-Dining Quality 💎",
        "sentiment": "positive",
        "keywords": [
          "high culinary value",
          "fair fine dining prices"
        ]
      },
      {
        "label": "Generous Portions That Left Us Satisfied 🍽️",
        "sentiment": "positive",
        "keywords": [
          "generous portions",
          "great bang for the buck"
        ]
      },
      {
        "label": "Worth Every Cent for Such a Memorable Evening 🌟",
        "sentiment": "positive",
        "keywords": [
          "unbeatable value",
          "memorable culinary experience"
        ]
      }
    ]
  }
]
};
