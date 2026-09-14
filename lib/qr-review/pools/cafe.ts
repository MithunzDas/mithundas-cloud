import { IndustryConfig } from "./types";

export const CAFE_POOL: IndustryConfig = {
  id: "CAFE",
  name: "Cafe, Specialty Coffee & Bakery",
  icon: "☕",
  defaultPlaceHolder: "Artisan Roast & Bakery",
  sampleReview: "Hands down the best coffee in the neighborhood! The oat milk flat white had silky microfoam, and the almond croissant was warm, buttery, and flaky. Super cozy vibe with fast Wi-Fi and friendly baristas. ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "cafe_cof_01",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "How was the taste and extraction of your coffee or espresso?",
    "options": [
      {
        "label": "Velvety Crema, Perfectly Balanced & Rich ☕",
        "sentiment": "positive",
        "keywords": [
          "best espresso in town",
          "smooth coffee",
          "rich crema"
        ]
      },
      {
        "label": "Zero Bitterness, Smooth & Aromatic 🌿",
        "sentiment": "positive",
        "keywords": [
          "smooth specialty coffee",
          "aromatic brew"
        ]
      },
      {
        "label": "Poured at the Perfect Sipping Temperature 🌡️",
        "sentiment": "positive",
        "keywords": [
          "ideal drink temperature",
          "expertly brewed"
        ]
      },
      {
        "label": "Outstanding Specialty Single-Origin Beans 🌍",
        "sentiment": "positive",
        "keywords": [
          "single origin coffee",
          "third wave roaster"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_02",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "How was the milk steaming, microfoam, and latte art?",
    "options": [
      {
        "label": "Gorgeous Silky Latte Art on Top 🎨",
        "sentiment": "positive",
        "keywords": [
          "beautiful latte art",
          "silky microfoam"
        ]
      },
      {
        "label": "Sweet, Smooth & Perfectly Textured Milk 🥛",
        "sentiment": "positive",
        "keywords": [
          "properly steamed milk",
          "velvety cappuccino"
        ]
      },
      {
        "label": "Great Non-Dairy Steaming (Oat/Almond) 🌾",
        "sentiment": "positive",
        "keywords": [
          "creamy oat milk latte",
          "great dairy alternatives"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_03",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "If you ordered iced coffee or cold brew, how was it?",
    "options": [
      {
        "label": "Crisp, Cold & Steeped to Perfection ❄️",
        "sentiment": "positive",
        "keywords": [
          "smooth cold brew",
          "crisp iced coffee"
        ]
      },
      {
        "label": "Strong, Flavorful & Not Watered Down 🧊",
        "sentiment": "positive",
        "keywords": [
          "strong cold brew",
          "robust flavor"
        ]
      },
      {
        "label": "Delicious Signature Cold Foam Topping ☁️",
        "sentiment": "positive",
        "keywords": [
          "vanilla sweet cream foam",
          "custom cold foam"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_04",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "How was the specialty matcha, chai, or loose-leaf tea?",
    "options": [
      {
        "label": "Vibrant Ceremonial-Grade Green Matcha 🍵",
        "sentiment": "positive",
        "keywords": [
          "ceremonial matcha latte",
          "authentic matcha"
        ]
      },
      {
        "label": "Spiced Authentic Chai with Rich Aroma 🍂",
        "sentiment": "positive",
        "keywords": [
          "house spiced chai",
          "aromatic chai latte"
        ]
      },
      {
        "label": "Fragrant Loose-Leaf Tea Selection 🫖",
        "sentiment": "positive",
        "keywords": [
          "organic loose leaf tea",
          "fragrant herbal tea"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_05",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "How was the syrup or flavor balance in your specialty drink?",
    "options": [
      {
        "label": "House-Made Real Vanilla / Caramel Syrups 🍯",
        "sentiment": "positive",
        "keywords": [
          "house made vanilla syrup",
          "natural flavors"
        ]
      },
      {
        "label": "Subtle Sweetness That Let Coffee Shine ☕",
        "sentiment": "positive",
        "keywords": [
          "balanced sweetness",
          "coffee forward"
        ]
      },
      {
        "label": "Exciting Seasonal Flavor Combinations 🍁",
        "sentiment": "positive",
        "keywords": [
          "seasonal specialty latte",
          "creative cafe drinks"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_06",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "Did you buy whole bean coffee bags to take home?",
    "options": [
      {
        "label": "Freshly Roasted Beans with Clear Roast Dates 🏷️",
        "sentiment": "positive",
        "keywords": [
          "freshly roasted coffee beans",
          "roast date on bag"
        ]
      },
      {
        "label": "Barista Ground It Perfectly for My French Press / Chemex ⚙️",
        "sentiment": "positive",
        "keywords": [
          "custom coffee grind",
          "helpful barista advice"
        ]
      },
      {
        "label": "Tastes as Good at Home as in the Shop! 🏠",
        "sentiment": "positive",
        "keywords": [
          "home brewing excellence",
          "top tier coffee beans"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_07",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "How consistent is the coffee quality across your visits?",
    "options": [
      {
        "label": "Consistently Exceptional Cup Every Single Day 🏆",
        "sentiment": "positive",
        "keywords": [
          "consistent coffee quality",
          "daily coffee staple"
        ]
      },
      {
        "label": "Never Had a Bad Drink Here 👍",
        "sentiment": "positive",
        "keywords": [
          "dependable barista skills",
          "reliable quality"
        ]
      },
      {
        "label": "My Favorite Morning Ritual ☀️",
        "sentiment": "positive",
        "keywords": [
          "morning coffee spot",
          "best daily coffee"
        ]
      }
    ]
  },
  {
    "id": "cafe_cof_08",
    "category": "coffee_quality",
    "categoryLabel": "Specialty Coffee & Brew Quality",
    "question": "Overall, how does this cafe's coffee compare to corporate chains?",
    "options": [
      {
        "label": "Blows the Big Chains Out of the Water! 🌟",
        "sentiment": "positive",
        "keywords": [
          "way better than starbucks",
          "independent specialty coffee"
        ]
      },
      {
        "label": "True Artisan Craft in Every Pour 💎",
        "sentiment": "positive",
        "keywords": [
          "artisan coffee craft",
          "third wave cafe"
        ]
      },
      {
        "label": "The Undisputed Coffee King of the Neighborhood 👑",
        "sentiment": "positive",
        "keywords": [
          "best coffee shop in neighborhood",
          "local coffee gem"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_01",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "How fresh and flaky were the croissants or pastries?",
    "options": [
      {
        "label": "Ultra Flaky, Buttery & Melt-in-Mouth 🥐",
        "sentiment": "positive",
        "keywords": [
          "flaky butter croissant",
          "fresh baked pastry"
        ]
      },
      {
        "label": "Warmed Up for Me to Golden Perfection 🔥",
        "sentiment": "positive",
        "keywords": [
          "warmed pastry",
          "golden and crisp"
        ]
      },
      {
        "label": "Tasted Straight Out of a Parisian Bakery 🇫🇷",
        "sentiment": "positive",
        "keywords": [
          "authentic bakery",
          "french pastry quality"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_02",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "How was the breakfast sandwich or savory toast?",
    "options": [
      {
        "label": "Avocado Sourdough Toast Was Incredible 🥑",
        "sentiment": "positive",
        "keywords": [
          "avocado toast sourdough",
          "fresh healthy breakfast"
        ]
      },
      {
        "label": "Hearty, Cheesy & Flavorful Breakfast Sandwich 🍳",
        "sentiment": "positive",
        "keywords": [
          "tasty breakfast sandwich",
          "warm brioche bun"
        ]
      },
      {
        "label": "High-Quality Local Bacon & Farm Fresh Eggs 🥓",
        "sentiment": "positive",
        "keywords": [
          "farm fresh ingredients",
          "satisfying breakfast"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_03",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "Did you find good vegan, vegetarian or gluten-free bakery choices?",
    "options": [
      {
        "label": "Delicious Gluten-Free Pastry Options 🌾",
        "sentiment": "positive",
        "keywords": [
          "gluten free bakery",
          "tasty gluten free options"
        ]
      },
      {
        "label": "Decadent Vegan Muffins and Cookies 🌱",
        "sentiment": "positive",
        "keywords": [
          "vegan baked goods",
          "dairy free treats"
        ]
      },
      {
        "label": "Clearly Labeled Allergen Menu 🏷️",
        "sentiment": "positive",
        "keywords": [
          "allergen friendly cafe",
          "clearly labeled pastries"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_04",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "How was the cookies, brownies or sweet treats?",
    "options": [
      {
        "label": "Gooey Chocolate Chip Cookie with Sea Salt 🍪",
        "sentiment": "positive",
        "keywords": [
          "fresh baked cookie",
          "sea salt chocolate chip"
        ]
      },
      {
        "label": "Fudgy Brownie That Paired Perfectly with Coffee 🍫",
        "sentiment": "positive",
        "keywords": [
          "rich chocolate brownie",
          "perfect coffee pairing"
        ]
      },
      {
        "label": "Artisanal Cake Slices Full of Flavor 🍰",
        "sentiment": "positive",
        "keywords": [
          "delicious cake slice",
          "fresh baked daily"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_05",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "How was the lunchtime sandwich, wrap or salad options?",
    "options": [
      {
        "label": "Artisan Panini Pressed to Crispy Perfection 🥪",
        "sentiment": "positive",
        "keywords": [
          "crispy panini sandwich",
          "fresh lunch options"
        ]
      },
      {
        "label": "Fresh, Colorful Green Salad with House Dressing 🥗",
        "sentiment": "positive",
        "keywords": [
          "vibrant lunch salad",
          "healthy cafe lunch"
        ]
      },
      {
        "label": "Quick, Healthy & Energizing Lunch Pick ⚡",
        "sentiment": "positive",
        "keywords": [
          "quick healthy lunch",
          "energizing meal"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_06",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "How generously filled and sized were the food portions?",
    "options": [
      {
        "label": "Substantial Size That Kept Me Full for Hours 🍽️",
        "sentiment": "positive",
        "keywords": [
          "filling portions",
          "great breakfast portion"
        ]
      },
      {
        "label": "Generous Layers of Cheese, Greens & Protein 🧀",
        "sentiment": "positive",
        "keywords": [
          "generously filled sandwich",
          "quality ingredients"
        ]
      },
      {
        "label": "Great Price-to-Portion Value 💎",
        "sentiment": "positive",
        "keywords": [
          "fair food prices",
          "worth the price"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_07",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "How early were fresh pastries and food stocked in the morning?",
    "options": [
      {
        "label": "Display Case Fully Stocked at 7 AM 🌅",
        "sentiment": "positive",
        "keywords": [
          "early morning baked goods",
          "freshly stocked display"
        ]
      },
      {
        "label": "Smelled Like Fresh Bread the Second I Walked In 🥖",
        "sentiment": "positive",
        "keywords": [
          "fresh bakery aroma",
          "baked on premises"
        ]
      },
      {
        "label": "Warm Batch Just Came Out of the Oven 🔥",
        "sentiment": "positive",
        "keywords": [
          "warm oven fresh treats",
          "flawless timing"
        ]
      }
    ]
  },
  {
    "id": "cafe_bak_08",
    "category": "bakery_food",
    "categoryLabel": "Fresh Pastries & Food",
    "question": "Would you come here specifically for the bakery and food items?",
    "options": [
      {
        "label": "Food is Just as Outstanding as the Coffee! 🌟",
        "sentiment": "positive",
        "keywords": [
          "great cafe food",
          "best cafe bakery"
        ]
      },
      {
        "label": "My Go-To Weekend Breakfast & Pastry Spot 🥐",
        "sentiment": "positive",
        "keywords": [
          "weekend breakfast spot",
          "favorite local bakery"
        ]
      },
      {
        "label": "10/10 Deliciousness Across the Entire Menu 🏆",
        "sentiment": "positive",
        "keywords": [
          "delicious cafe snacks",
          "highly recommended cafe"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_01",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "How was the cafe's interior aesthetic and atmosphere?",
    "options": [
      {
        "label": "Cozy, Plant-Filled Aesthetic with Warm Wood 🌿",
        "sentiment": "positive",
        "keywords": [
          "aesthetic coffee shop",
          "plants and natural light",
          "cozy vibes"
        ]
      },
      {
        "label": "Sunlit Spaces with Great Street Views ☀️",
        "sentiment": "positive",
        "keywords": [
          "bright natural light",
          "big windows street view"
        ]
      },
      {
        "label": "Warm, Welcoming Neighborhood Community Vibe 🏡",
        "sentiment": "positive",
        "keywords": [
          "neighborhood coffee hub",
          "friendly atmosphere"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_02",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "How was the Wi-Fi speed and availability of electrical power outlets?",
    "options": [
      {
        "label": "Blazing Fast, Reliable Wi-Fi for Remote Work 💻",
        "sentiment": "positive",
        "keywords": [
          "fast cafe wifi",
          "laptop friendly cafe"
        ]
      },
      {
        "label": "Plentiful Outlets Near Almost Every Seat 🔌",
        "sentiment": "positive",
        "keywords": [
          "plenty of power outlets",
          "great work spot"
        ]
      },
      {
        "label": "Got 3 Hours of Deep Work Done Uninterrupted 🎯",
        "sentiment": "positive",
        "keywords": [
          "productive workspace",
          "remote work friendly"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_03",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "How comfortable were the tables, chairs and couches?",
    "options": [
      {
        "label": "Plush Leather Couches & Ergonomic Chairs 🛋️",
        "sentiment": "positive",
        "keywords": [
          "comfortable armchairs",
          "cozy seating"
        ]
      },
      {
        "label": "Spacious Wooden Tables with Plenty of Room 📖",
        "sentiment": "positive",
        "keywords": [
          "spacious work tables",
          "room for laptop and notebook"
        ]
      },
      {
        "label": "Great Choice of Counter Stools or Low Tables 🪑",
        "sentiment": "positive",
        "keywords": [
          "varied seating options",
          "inviting cafe layout"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_04",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "How was the background music volume and sound ambiance?",
    "options": [
      {
        "label": "Chill Acoustic / Lo-Fi Playlist at Perfect Volume 🎵",
        "sentiment": "positive",
        "keywords": [
          "chill lo-fi playlist",
          "relaxing music volume"
        ]
      },
      {
        "label": "Easy to Chat with Friends or Take a Call 💬",
        "sentiment": "positive",
        "keywords": [
          "moderate noise level",
          "great acoustics"
        ]
      },
      {
        "label": "Calming White Noise and Coffee Grinder Sounds ☕",
        "sentiment": "positive",
        "keywords": [
          "peaceful coffeehouse ambiance",
          "calm atmosphere"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_05",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "How was the outdoor sidewalk or patio seating (if available)?",
    "options": [
      {
        "label": "Lovely Sidewalk Tables for People Watching 🚶",
        "sentiment": "positive",
        "keywords": [
          "sidewalk coffee seating",
          "charming outdoor patio"
        ]
      },
      {
        "label": "Shaded Umbrellas and Fresh Morning Air ⛱️",
        "sentiment": "positive",
        "keywords": [
          "shaded patio",
          "enjoyable outdoor coffee"
        ]
      },
      {
        "label": "Dog-Friendly with Water Bowls Outside 🐾",
        "sentiment": "positive",
        "keywords": [
          "dog friendly cafe",
          "welcoming outdoor area"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_06",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "Is this a great place to read a book, meet a friend, or have a casual meeting?",
    "options": [
      {
        "label": "The Perfect Book-Reading Sanctuary 📚",
        "sentiment": "positive",
        "keywords": [
          "quiet reading corner",
          "relaxing coffee break"
        ]
      },
      {
        "label": "Wonderful Place to Catch Up with Friends ☕",
        "sentiment": "positive",
        "keywords": [
          "catch up over coffee",
          "social coffee shop"
        ]
      },
      {
        "label": "Great Casual Spot for Quick Coffee Meetings 💼",
        "sentiment": "positive",
        "keywords": [
          "casual business meeting spot",
          "professional atmosphere"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_07",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "How easy was it to find a comfortable seat during your visit?",
    "options": [
      {
        "label": "Found a Great Window Seat Immediately 🪟",
        "sentiment": "positive",
        "keywords": [
          "found seating easily",
          "great window view"
        ]
      },
      {
        "label": "Ample Seating for Both Individuals and Groups 👥",
        "sentiment": "positive",
        "keywords": [
          "plenty of tables",
          "room for groups"
        ]
      },
      {
        "label": "Quick Table Turnover Kept Seats Available 👍",
        "sentiment": "positive",
        "keywords": [
          "good table turnover",
          "never too crowded"
        ]
      }
    ]
  },
  {
    "id": "cafe_vib_08",
    "category": "cafe_vibe",
    "categoryLabel": "Cozy Vibe, Seating & Workspace",
    "question": "Overall, what makes this cafe's atmosphere special to you?",
    "options": [
      {
        "label": "Feels Like a Cozy Second Living Room 🛋️",
        "sentiment": "positive",
        "keywords": [
          "feels like home",
          "warm coffee sanctuary"
        ]
      },
      {
        "label": "Inspiring Creative Energy Everywhere 🎨",
        "sentiment": "positive",
        "keywords": [
          "creative coffee environment",
          "inspiring workspace"
        ]
      },
      {
        "label": "My Absolute Favorite Third Place 🌟",
        "sentiment": "positive",
        "keywords": [
          "favorite third place",
          "top coffee shop"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_01",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How friendly and welcoming were the baristas at the counter?",
    "options": [
      {
        "label": "Greeted Warmly the Second I Walked In 😊",
        "sentiment": "positive",
        "keywords": [
          "friendly baristas",
          "warm welcome",
          "cheerful staff"
        ]
      },
      {
        "label": "Passionate About Coffee & Happy to Answer Questions ☕",
        "sentiment": "positive",
        "keywords": [
          "knowledgeable baristas",
          "coffee passion"
        ]
      },
      {
        "label": "Remembered My Name and Usual Order! 🌟",
        "sentiment": "positive",
        "keywords": [
          "remembered my order",
          "personalized service"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_02",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How fast was your drink prepared after ordering?",
    "options": [
      {
        "label": "Ready in Under 2 Minutes, Super Efficient ⚡",
        "sentiment": "positive",
        "keywords": [
          "fast drink preparation",
          "speedy barista"
        ]
      },
      {
        "label": "Fast Service Even with a Morning Line ⏱️",
        "sentiment": "positive",
        "keywords": [
          "moved line fast",
          "efficient morning rush"
        ]
      },
      {
        "label": "Crafted with Care Without Long Delays 🎯",
        "sentiment": "positive",
        "keywords": [
          "careful craft without delay",
          "prompt pickup"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_03",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How accurately was your customized drink order made?",
    "options": [
      {
        "label": "Made 100% Exactly to My Specifications 🎯",
        "sentiment": "positive",
        "keywords": [
          "accurate custom drink",
          "exact milk and syrup ratio"
        ]
      },
      {
        "label": "Followed Extra Hot / Iced Preference Perfectly ❄️",
        "sentiment": "positive",
        "keywords": [
          "perfect custom temperature",
          "attentive barista"
        ]
      },
      {
        "label": "Handled Special Dairy-Free Request Flawlessly 🌾",
        "sentiment": "positive",
        "keywords": [
          "careful dairy free prep",
          "respected allergy request"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_04",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How smooth was the contactless ordering or digital payment?",
    "options": [
      {
        "label": "Quick Apple Pay / Tap-to-Pay at Counter 📲",
        "sentiment": "positive",
        "keywords": [
          "smooth tap to pay",
          "fast contactless checkout"
        ]
      },
      {
        "label": "Convenient Mobile Pre-Order & Pickup Counter 📱",
        "sentiment": "positive",
        "keywords": [
          "mobile order pickup ready",
          "hassle free pickup"
        ]
      },
      {
        "label": "Digital Loyalty Stamp Applied Effortlessly 💳",
        "sentiment": "positive",
        "keywords": [
          "loyalty rewards program",
          "easy stamp tracking"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_05",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How was the barista's attitude and energy during your visit?",
    "options": [
      {
        "label": "Upbeat, Smiling & Brightened My Entire Day ☀️",
        "sentiment": "positive",
        "keywords": [
          "brightened my morning",
          "contagious positive energy"
        ]
      },
      {
        "label": "Calm, Patient & Gracious Under Busy Rush 🧘",
        "sentiment": "positive",
        "keywords": [
          "patient under rush",
          "graceful service"
        ]
      },
      {
        "label": "Courteous Goodbye When Leaving the Shop 👋",
        "sentiment": "positive",
        "keywords": [
          "polite goodbye",
          "welcoming staff"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_06",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "Did the staff keep the condiment and pickup station clean and stocked?",
    "options": [
      {
        "label": "Spotless Milk, Straw & Napkin Station 🧽",
        "sentiment": "positive",
        "keywords": [
          "clean condiment bar",
          "fully stocked napkins"
        ]
      },
      {
        "label": "Clear Order Calling with Names / Numbers 🗣️",
        "sentiment": "positive",
        "keywords": [
          "clear drink handoff",
          "no confusion at pickup"
        ]
      },
      {
        "label": "Clean Sleeves, Trays and Lids Ready to Go ☕",
        "sentiment": "positive",
        "keywords": [
          "tidy pickup counter",
          "well organized station"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_07",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How did the team handle special drink adjustments or tweaks?",
    "options": [
      {
        "label": "Cheerfully Adjusted Without Hesitation 👍",
        "sentiment": "positive",
        "keywords": [
          "accommodating baristas",
          "willing to adjust"
        ]
      },
      {
        "label": "Offered a Generous Taste Test First 🥄",
        "sentiment": "positive",
        "keywords": [
          "helpful taste sample",
          "customer first mindset"
        ]
      },
      {
        "label": "Exceeded My Expectations with Friendly Service 🌟",
        "sentiment": "positive",
        "keywords": [
          "exceeded expectations",
          "delightful customer care"
        ]
      }
    ]
  },
  {
    "id": "cafe_bar_08",
    "category": "barista_service",
    "categoryLabel": "Barista Warmth & Speed",
    "question": "How would you rate the overall customer experience at this cafe?",
    "options": [
      {
        "label": "5-Star Service from Amazing Human Beings ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star cafe",
          "best baristas in town"
        ]
      },
      {
        "label": "Always Leaves Me with a Smile on My Face 😊",
        "sentiment": "positive",
        "keywords": [
          "leaves with a smile",
          "joyful coffee experience"
        ]
      },
      {
        "label": "Proud to Support this Local Small Business ❤️",
        "sentiment": "positive",
        "keywords": [
          "proud to support local",
          "gem of a coffee shop"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_01",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "How clean were the tables, chairs and floors?",
    "options": [
      {
        "label": "Spotless Tables Wiped Down Continuously ✨",
        "sentiment": "positive",
        "keywords": [
          "clean cafe tables",
          "spotless coffee shop"
        ]
      },
      {
        "label": "Clean, Tidy & Crumbs Swept Promptly 🧽",
        "sentiment": "positive",
        "keywords": [
          "tidy seating area",
          "well maintained cafe"
        ]
      },
      {
        "label": "High Standard of Cleanliness Throughout 🧼",
        "sentiment": "positive",
        "keywords": [
          "immaculate hygiene",
          "fresh cafe environment"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_02",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "How clean and maintained was the customer restroom?",
    "options": [
      {
        "label": "Immaculate, Fresh Scented & Stocked Restroom 🌸",
        "sentiment": "positive",
        "keywords": [
          "clean cafe restroom",
          "fully stocked bathroom"
        ]
      },
      {
        "label": "Touchless Soap Dispenser & Clean Mirror 🪞",
        "sentiment": "positive",
        "keywords": [
          "sanitary restroom",
          "modern facilities"
        ]
      },
      {
        "label": "One of the Cleanest Cafe Restrooms in the City 👍",
        "sentiment": "positive",
        "keywords": [
          "cleanest public restroom",
          "respectable hygiene"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_03",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "How was the pricing and value for the quality of specialty coffee?",
    "options": [
      {
        "label": "Exceptional Value for Artisan Roasted Coffee 💎",
        "sentiment": "positive",
        "keywords": [
          "great coffee value",
          "fair specialty prices"
        ]
      },
      {
        "label": "Cheaper Than Commercial Chains & 10x Better Quality ☕",
        "sentiment": "positive",
        "keywords": [
          "better value than starbucks",
          "affordable specialty brew"
        ]
      },
      {
        "label": "Worth Every Penny for the Craftsmanship 💰",
        "sentiment": "positive",
        "keywords": [
          "worth the price",
          "high quality coffee"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_04",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "Did the cafe offer reusable cup discounts or eco-friendly packaging?",
    "options": [
      {
        "label": "Generous Bring-Your-Own-Cup Discount 🌿",
        "sentiment": "positive",
        "keywords": [
          "eco-friendly cafe",
          "reusable cup discount"
        ]
      },
      {
        "label": "100% Compostable Cups, Lids & Straws ♻️",
        "sentiment": "positive",
        "keywords": [
          "compostable packaging",
          "sustainable coffee"
        ]
      },
      {
        "label": "Beautiful Ceramic Mugs for In-House Dining ☕",
        "sentiment": "positive",
        "keywords": [
          "ceramic mugs",
          "sustainable dining"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_05",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "How was the organization of the bus tubs and dish return area?",
    "options": [
      {
        "label": "Discreet, Tidy & Emptied Regularly 🧽",
        "sentiment": "positive",
        "keywords": [
          "tidy dish return",
          "organized bus station"
        ]
      },
      {
        "label": "Staff Cleared Empty Cups from Tables Promptly 🧹",
        "sentiment": "positive",
        "keywords": [
          "attentive floor clearing",
          "clean tables"
        ]
      },
      {
        "label": "Clear Recycling & Trash Separation Bins ♻️",
        "sentiment": "positive",
        "keywords": [
          "organized waste sorting",
          "clean trash stations"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_06",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "How was the retail merchandise, mugs and coffee bean display?",
    "options": [
      {
        "label": "Beautifully Curated Tumblers, Mugs & Brewers 🛍️",
        "sentiment": "positive",
        "keywords": [
          "great cafe merchandise",
          "stylish coffee mugs"
        ]
      },
      {
        "label": "Well-Organized Coffee Beans with Flavor Notes 🏷️",
        "sentiment": "positive",
        "keywords": [
          "clear coffee tasting notes",
          "fresh bean selection"
        ]
      },
      {
        "label": "Picked Up Wonderful Coffee Gifts for Friends 🎁",
        "sentiment": "positive",
        "keywords": [
          "great gifts",
          "coffee lover merchandise"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_07",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "How was the ease of parking or public transit access to this cafe?",
    "options": [
      {
        "label": "Easy Street Parking / Dedicated Customer Spots 🚗",
        "sentiment": "positive",
        "keywords": [
          "convenient parking",
          "easy access"
        ]
      },
      {
        "label": "Steps from Transit, Perfect Commute Stop 🚇",
        "sentiment": "positive",
        "keywords": [
          "convenient commute stop",
          "near transit"
        ]
      },
      {
        "label": "Ample Bike Racks Right in Front 🚲",
        "sentiment": "positive",
        "keywords": [
          "bike friendly cafe",
          "accessible location"
        ]
      }
    ]
  },
  {
    "id": "cafe_cln_08",
    "category": "cleanliness_value",
    "categoryLabel": "Cleanliness, Restrooms & Value",
    "question": "Will you be making this cafe your regular daily or weekly spot?",
    "options": [
      {
        "label": "Found My Permanent Daily Coffee Haven! 🏆",
        "sentiment": "positive",
        "keywords": [
          "regular customer",
          "my go-to coffee shop"
        ]
      },
      {
        "label": "Already Planning My Next Visit Tomorrow Morning ☀️",
        "sentiment": "positive",
        "keywords": [
          "coming back tomorrow",
          "habit forming coffee"
        ]
      },
      {
        "label": "An Essential Part of My Routine! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "essential morning ritual",
          "5-star cafe"
        ]
      }
    ]
  }
]
};
