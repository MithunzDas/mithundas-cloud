import { IndustryConfig } from "./types";

export const AUTO_POOL: IndustryConfig = {
  id: "AUTO_REPAIR",
  name: "Auto Repair, Tires & Detailing",
  icon: "🚗",
  defaultPlaceHolder: "Apex Precision Auto Care",
  sampleReview: "Hands down the most honest auto repair shop in town! They diagnosed my check engine light quickly, explained the exact issue with photos, and the final bill was hundreds cheaper than the dealer. Car drives like a dream. ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "auto_diag_01",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "How well did the mechanics diagnose and fix your car's issue?",
    "options": [
      {
        "label": "Diagnosed the Exact Problem Accurately on the First Try 🎯",
        "sentiment": "positive",
        "keywords": [
          "accurate auto diagnosis",
          "pinpointed mechanical issue",
          "expert mechanics"
        ]
      },
      {
        "label": "Fixed Mysterious Noise / Warning Light Permanently 🛠️",
        "sentiment": "positive",
        "keywords": [
          "check engine light fixed",
          "eliminated strange noise"
        ]
      },
      {
        "label": "Car Runs Smoothly and Feels Brand New Again 🚗",
        "sentiment": "positive",
        "keywords": [
          "car drives like new",
          "smooth engine performance"
        ]
      },
      {
        "label": "Honest Mechanical Expertise You Can Rely On 🛡️",
        "sentiment": "positive",
        "keywords": [
          "honest mechanic",
          "trusted auto repair shop"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_02",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "How was the brake service or suspension repair?",
    "options": [
      {
        "label": "Firm, Responsive Brakes with Zero Squeal or Shudder 🛑",
        "sentiment": "positive",
        "keywords": [
          "responsive new brakes",
          "no brake squeal",
          "smooth stopping"
        ]
      },
      {
        "label": "Suspension Restored Smooth, Pothole-Proof Ride 🚙",
        "sentiment": "positive",
        "keywords": [
          "smooth suspension repair",
          "tight steering"
        ]
      },
      {
        "label": "Precision Wheel Alignment and Tire Balancing ⚖️",
        "sentiment": "positive",
        "keywords": [
          "perfect wheel alignment",
          "balanced tires"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_03",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "How was your oil change and routine maintenance service?",
    "options": [
      {
        "label": "Quick Synthetic Oil Change & Filter Replacement 🛢️",
        "sentiment": "positive",
        "keywords": [
          "synthetic oil change",
          "quick lube service"
        ]
      },
      {
        "label": "Complimentary 30-Point Vehicle Health Inspection 📋",
        "sentiment": "positive",
        "keywords": [
          "courtesy vehicle inspection",
          "thorough safety check"
        ]
      },
      {
        "label": "All Fluid Levels Topped Off and Tires Checked 💧",
        "sentiment": "positive",
        "keywords": [
          "topped off fluids",
          "checked tire pressure"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_04",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "How was the AC or heating system repair?",
    "options": [
      {
        "label": "Blowing Ice Cold AC Air Within Seconds ❄️",
        "sentiment": "positive",
        "keywords": [
          "ice cold ac repair",
          "fast refrigerant recharge"
        ]
      },
      {
        "label": "Heating Core & Blower Working at Full Power 🔥",
        "sentiment": "positive",
        "keywords": [
          "warm heating repair",
          "blower fan fixed"
        ]
      },
      {
        "label": "Replaced Cabin Air Filter for Fresh In-Car Air 🍃",
        "sentiment": "positive",
        "keywords": [
          "fresh cabin air filter",
          "odor free vehicle"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_05",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "Did the shop use high-quality OEM or certified parts?",
    "options": [
      {
        "label": "Installed Genuine OEM / Heavy-Duty Parts 🔩",
        "sentiment": "positive",
        "keywords": [
          "genuine oem parts",
          "high quality auto parts"
        ]
      },
      {
        "label": "Showed Me the Old Worn Parts and Explained Why 🔍",
        "sentiment": "positive",
        "keywords": [
          "showed old parts",
          "transparent repair"
        ]
      },
      {
        "label": "Full Parts and Labor Warranty Provided 🛡️",
        "sentiment": "positive",
        "keywords": [
          "nationwide warranty",
          "warranty on parts and labor"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_06",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "How was the transmission, clutch, or drivetrain repair?",
    "options": [
      {
        "label": "Shifts Like Butter, Perfectly Smooth Gear Changes ⚙️",
        "sentiment": "positive",
        "keywords": [
          "smooth transmission shift",
          "seamless gear change"
        ]
      },
      {
        "label": "Clutch Engagement Feels Crisp and Responsive 🚗",
        "sentiment": "positive",
        "keywords": [
          "responsive clutch replacement",
          "drivetrain expertise"
        ]
      },
      {
        "label": "Eliminated Vibrations and Grinding Completely 🔇",
        "sentiment": "positive",
        "keywords": [
          "eliminated grinding noise",
          "quiet drivetrain"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_07",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "How was the electrical, battery or starter repair?",
    "options": [
      {
        "label": "Engine Cranks Instantly on the First Turn ⚡",
        "sentiment": "positive",
        "keywords": [
          "fast starter replacement",
          "reliable battery install"
        ]
      },
      {
        "label": "Traced and Fixed Complex Electrical Gremlin 🔌",
        "sentiment": "positive",
        "keywords": [
          "expert electrical auto diagnosis",
          "fixed wiring issue"
        ]
      },
      {
        "label": "Alternator Charging System Tested & Verified 🔋",
        "sentiment": "positive",
        "keywords": [
          "alternator repair",
          "battery charging test"
        ]
      }
    ]
  },
  {
    "id": "auto_diag_08",
    "category": "diagnostic_repair",
    "categoryLabel": "Mechanical Expertise & Repair Quality",
    "question": "Overall, how confident are you driving your car after this repair?",
    "options": [
      {
        "label": "100% Peace of Mind on the Highway and Road Trips 🛣️",
        "sentiment": "positive",
        "keywords": [
          "peace of mind driving",
          "road trip ready"
        ]
      },
      {
        "label": "Drives Straight, Quiet and Reliable 🚙",
        "sentiment": "positive",
        "keywords": [
          "reliable vehicle performance",
          "drives straight"
        ]
      },
      {
        "label": "Found My Go-To Auto Repair Shop for Life! 🏆",
        "sentiment": "positive",
        "keywords": [
          "best mechanic in town",
          "trusted auto repair"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_01",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "Was the quote and pricing explained clearly before work began?",
    "options": [
      {
        "label": "Upfront Written Estimate with Zero Surprise Charges 📋",
        "sentiment": "positive",
        "keywords": [
          "upfront auto estimate",
          "no hidden fees",
          "fair pricing"
        ]
      },
      {
        "label": "Final Invoice Matched the Initial Quote Exactly 💵",
        "sentiment": "positive",
        "keywords": [
          "honest repair invoice",
          "exact quote honored"
        ]
      },
      {
        "label": "No High-Pressure Upsells for Things I Didn't Need 🛡️",
        "sentiment": "positive",
        "keywords": [
          "no pushy upsells",
          "honest service advisor"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_02",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "Did the mechanic prioritize urgent safety repairs versus optional items?",
    "options": [
      {
        "label": "Clearly Explained What Needed Immediate Attention vs Later 🚦",
        "sentiment": "positive",
        "keywords": [
          "prioritized urgent safety repairs",
          "transparent advice"
        ]
      },
      {
        "label": "Helped Me Plan and Budget for Future Maintenance 📅",
        "sentiment": "positive",
        "keywords": [
          "budget friendly maintenance",
          "long term vehicle care"
        ]
      },
      {
        "label": "Respected My Budget Without Any Pressure 🤝",
        "sentiment": "positive",
        "keywords": [
          "respected budget",
          "ethical mechanics"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_03",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "How did the pricing compare to the local dealership rates?",
    "options": [
      {
        "label": "Half the Price of the Dealership with 2x the Quality 💰",
        "sentiment": "positive",
        "keywords": [
          "way cheaper than dealership",
          "affordable auto repair"
        ]
      },
      {
        "label": "Fair Labor Rates and Reasonable Parts Markup 💎",
        "sentiment": "positive",
        "keywords": [
          "fair labor rates",
          "reasonable parts cost"
        ]
      },
      {
        "label": "Saved Me Hundreds of Dollars! 💵",
        "sentiment": "positive",
        "keywords": [
          "saved money on car repair",
          "exceptional value"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_04",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "Did the shop call to approve any additional discoveries before doing the work?",
    "options": [
      {
        "label": "Called Promptly with Photos & Cost Before Proceeding 📲",
        "sentiment": "positive",
        "keywords": [
          "called for repair approval",
          "digital inspection photos"
        ]
      },
      {
        "label": "Sent a Clear Digital Inspection Report to My Phone 📱",
        "sentiment": "positive",
        "keywords": [
          "digital inspection report",
          "transparent photo evidence"
        ]
      },
      {
        "label": "Never Did Any Unauthorized Work 🛡️",
        "sentiment": "positive",
        "keywords": [
          "authorized repairs only",
          "honest auto shop"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_05",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "Were flexible financing or payment plans available for major repairs?",
    "options": [
      {
        "label": "Convenient 0% Interest Financing Option Available 💳",
        "sentiment": "positive",
        "keywords": [
          "auto repair financing",
          "flexible payment plans"
        ]
      },
      {
        "label": "Multiple Payment Methods Accepted Smoothly 📲",
        "sentiment": "positive",
        "keywords": [
          "easy payment methods",
          "contactless checkout"
        ]
      },
      {
        "label": "Helped Ease the Financial Stress of an Unexpected Breakdown 😌",
        "sentiment": "positive",
        "keywords": [
          "stress free car repair",
          "caring team"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_06",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "How detailed and easy to read was the final itemized receipt?",
    "options": [
      {
        "label": "Line-by-Line Breakdown of Labor, Parts & Fluids 🧾",
        "sentiment": "positive",
        "keywords": [
          "itemized repair invoice",
          "clear receipt breakdown"
        ]
      },
      {
        "label": "Includes Warranty Information in Writing 📄",
        "sentiment": "positive",
        "keywords": [
          "written warranty on invoice",
          "clear guarantee"
        ]
      },
      {
        "label": "Digital Copy Emailed Automatically for Records 📧",
        "sentiment": "positive",
        "keywords": [
          "emailed maintenance record",
          "well documented service"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_07",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "Did you receive any coupons, discounts, or loyalty savings?",
    "options": [
      {
        "label": "Honored Online Coupon Without Any Fuss 🏷️",
        "sentiment": "positive",
        "keywords": [
          "honored auto coupon",
          "great discount savings"
        ]
      },
      {
        "label": "Complimentary Tire Rotation with Brake Job 🔄",
        "sentiment": "positive",
        "keywords": [
          "free tire rotation",
          "generous service perks"
        ]
      },
      {
        "label": "Military / Senior / First-Responder Discount Applied 🎖️",
        "sentiment": "positive",
        "keywords": [
          "community discount",
          "appreciated customer care"
        ]
      }
    ]
  },
  {
    "id": "auto_prc_08",
    "category": "pricing_honesty",
    "categoryLabel": "Pricing Transparency & Honesty",
    "question": "How would you rate the overall value and integrity of this business?",
    "options": [
      {
        "label": "The Rare Honest Mechanic You Can Trust 100% 🌟",
        "sentiment": "positive",
        "keywords": [
          "honest mechanic you can trust",
          "unquestionable integrity"
        ]
      },
      {
        "label": "Best Return on Investment for My Vehicle's Lifespan 🚗",
        "sentiment": "positive",
        "keywords": [
          "prolonged car lifespan",
          "top automotive value"
        ]
      },
      {
        "label": "5 Stars for Honesty and Transparency! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star auto repair",
          "highly recommended garage"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_01",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "Was your vehicle ready at the promised time?",
    "options": [
      {
        "label": "Finished Exactly When Promised (Even Early!) ⏱️",
        "sentiment": "positive",
        "keywords": [
          "ready on time",
          "fast auto turnaround",
          "respected schedule"
        ]
      },
      {
        "label": "Same-Day Turnaround for Routine Maintenance 🌅",
        "sentiment": "positive",
        "keywords": [
          "same day repair",
          "quick vehicle service"
        ]
      },
      {
        "label": "Kept Me Updated via Text Throughout the Day 📲",
        "sentiment": "positive",
        "keywords": [
          "text status updates",
          "great communication"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_02",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "How fast was the initial vehicle drop-off and intake process?",
    "options": [
      {
        "label": "Drop-Off Completed in Under 3 Minutes ⚡",
        "sentiment": "positive",
        "keywords": [
          "fast vehicle drop off",
          "smooth morning intake"
        ]
      },
      {
        "label": "Convenient Early Bird / Night Owl Key Drop Box 🌙",
        "sentiment": "positive",
        "keywords": [
          "night owl key drop",
          "convenient drop off"
        ]
      },
      {
        "label": "Service Advisor Listened Carefully to All Symptoms 📝",
        "sentiment": "positive",
        "keywords": [
          "attentive service advisor",
          "noted all issues"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_03",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "If parts needed to be ordered, how fast did they arrive?",
    "options": [
      {
        "label": "Parts Sourced and Delivered Same Afternoon 🚀",
        "sentiment": "positive",
        "keywords": [
          "fast parts delivery",
          "rapid parts sourcing"
        ]
      },
      {
        "label": "OEM Parts Sourced Overnight Without Delay 📦",
        "sentiment": "positive",
        "keywords": [
          "overnight parts arrival",
          "efficient workflow"
        ]
      },
      {
        "label": "Minimized Vehicle Downtime Significantly ⏱️",
        "sentiment": "positive",
        "keywords": [
          "minimal vehicle downtime",
          "quick repair completion"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_04",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "Did the shop provide a courtesy shuttle, loaner car or ride share?",
    "options": [
      {
        "label": "Complimentary Shuttle Ride Back to My Home / Office 🚐",
        "sentiment": "positive",
        "keywords": [
          "courtesy shuttle service",
          "ride to work provided"
        ]
      },
      {
        "label": "Uber / Lyft Ride Credit Provided by Shop 🚗",
        "sentiment": "positive",
        "keywords": [
          "rideshare credit",
          "convenient customer service"
        ]
      },
      {
        "label": "Clean Loaner Car Kept My Day on Track 🔑",
        "sentiment": "positive",
        "keywords": [
          "loaner vehicle provided",
          "uninterrupted day"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_05",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "How prompt was the phone call or text when your car was ready?",
    "options": [
      {
        "label": "Text Alert Sent Immediately with Link to Invoice 📲",
        "sentiment": "positive",
        "keywords": [
          "instant text notification",
          "ready for pickup alert"
        ]
      },
      {
        "label": "Gave Plenty of Notice Before Closing Time ⏰",
        "sentiment": "positive",
        "keywords": [
          "plenty of pickup notice",
          "considerate team"
        ]
      },
      {
        "label": "Flexible Evening Pickup Options 🌇",
        "sentiment": "positive",
        "keywords": [
          "flexible pickup hours",
          "lockbox pickup option"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_06",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "How was the speed of quick services (battery test, tire patch, bulb)?",
    "options": [
      {
        "label": "Handled on the Spot in Under 20 Minutes! ⚡",
        "sentiment": "positive",
        "keywords": [
          "repaired on the spot",
          "instant battery replacement"
        ]
      },
      {
        "label": "Tire Puncture Patched Safely and Quickly 🛞",
        "sentiment": "positive",
        "keywords": [
          "fast tire patch",
          "saved my flat tire"
        ]
      },
      {
        "label": "Back on the Road with Zero Stress 🛣️",
        "sentiment": "positive",
        "keywords": [
          "back on road quickly",
          "lifesaver garage"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_07",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "Did the mechanics work diligently without unnecessary delays?",
    "options": [
      {
        "label": "Dedicated Focus, Car Was on the Lift Immediately 🚗",
        "sentiment": "positive",
        "keywords": [
          "no wasted time",
          "dedicated mechanic focus"
        ]
      },
      {
        "label": "Organized Service Bays and Efficient Technicians 👨‍🔧",
        "sentiment": "positive",
        "keywords": [
          "efficient shop operations",
          "organized mechanics"
        ]
      },
      {
        "label": "Respected My Time from Start to Finish ⏱️",
        "sentiment": "positive",
        "keywords": [
          "respected customer time",
          "punctual service"
        ]
      }
    ]
  },
  {
    "id": "auto_spd_08",
    "category": "speed_turnaround",
    "categoryLabel": "Turnaround Speed & Punctuality",
    "question": "How would you rate the overall speed and efficiency of this shop?",
    "options": [
      {
        "label": "Fastest and Most Professional Shop I've Used 🏆",
        "sentiment": "positive",
        "keywords": [
          "fast auto repair",
          "efficient automotive service"
        ]
      },
      {
        "label": "Exceeded My Expectations on Turnaround Time 🚀",
        "sentiment": "positive",
        "keywords": [
          "exceeded turnaround expectations",
          "quick service"
        ]
      },
      {
        "label": "5 Stars for Punctuality & Work Ethic! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star speed",
          "dependable auto mechanics"
        ]
      }
    ]
  },
  {
    "id": "auto_com_01",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "How friendly and courteous was the service advisor and staff?",
    "options": [
      {
        "label": "Warm, Respectful & Explained Things in Plain English 🗣️",
        "sentiment": "positive",
        "keywords": [
          "friendly service advisor",
          "no jargon explanation",
          "courteous staff"
        ]
      },
      {
        "label": "Treated Me with Dignity and Complete Respect 🤝",
        "sentiment": "positive",
        "keywords": [
          "respectful auto shop",
          "dignified customer service"
        ]
      },
      {
        "label": "Patient in Answering All My Technical Questions 💬",
        "sentiment": "positive",
        "keywords": [
          "patient with questions",
          "great communicator"
        ]
      }
    ]
  },
  {
    "id": "auto_com_02",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "How clean and comfortable was the customer waiting lounge?",
    "options": [
      {
        "label": "Spotless Lounge with Soft Couches, Wi-Fi & TV 🛋️",
        "sentiment": "positive",
        "keywords": [
          "comfortable waiting lounge",
          "clean customer waiting area",
          "free wifi"
        ]
      },
      {
        "label": "Complimentary Fresh Coffee, Cold Water & Snacks ☕",
        "sentiment": "positive",
        "keywords": [
          "free coffee and snacks",
          "pleasant waiting room"
        ]
      },
      {
        "label": "Quiet Desk Space Where I Could Work on My Laptop 💻",
        "sentiment": "positive",
        "keywords": [
          "work friendly waiting room",
          "quiet customer desk"
        ]
      }
    ]
  },
  {
    "id": "auto_com_03",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "How was the cleanliness of your car when returned to you?",
    "options": [
      {
        "label": "Paper Floor Mats & Plastic Seat Covers Kept It Spotless 🧼",
        "sentiment": "positive",
        "keywords": [
          "protective floor mats",
          "clean steering wheel",
          "no grease stains"
        ]
      },
      {
        "label": "Zero Greasy Smudges on Steering Wheel or Door Handles 🧽",
        "sentiment": "positive",
        "keywords": [
          "clean car return",
          "respectful mechanics"
        ]
      },
      {
        "label": "Even Washed the Windshield and Vacuumed the Footwells! ✨",
        "sentiment": "positive",
        "keywords": [
          "vacuumed interior",
          "complimentary car wash touch"
        ]
      }
    ]
  },
  {
    "id": "auto_com_04",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "Did the mechanic take time to explain preventative car maintenance?",
    "options": [
      {
        "label": "Helpful Advice on How to Maximize Tire and Brake Life 🛞",
        "sentiment": "positive",
        "keywords": [
          "preventative maintenance advice",
          "prolonged tire life"
        ]
      },
      {
        "label": "Showed Me Fluid Dipsticks and Battery Health Status 🔋",
        "sentiment": "positive",
        "keywords": [
          "educational car advice",
          "battery health check"
        ]
      },
      {
        "label": "Empowered Me to Take Better Care of My Car 💡",
        "sentiment": "positive",
        "keywords": [
          "empowered vehicle owner",
          "caring mechanics"
        ]
      }
    ]
  },
  {
    "id": "auto_com_05",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "How clean were the customer restrooms in the auto shop?",
    "options": [
      {
        "label": "Remarkably Clean Restroom, Unlike Typical Garages! 🚽",
        "sentiment": "positive",
        "keywords": [
          "clean garage restroom",
          "spotless bathroom"
        ]
      },
      {
        "label": "Fresh Smelling, Stocked with Soap and Paper Towels 🌸",
        "sentiment": "positive",
        "keywords": [
          "fresh bathroom",
          "well maintained facilities"
        ]
      },
      {
        "label": "High Level of Facility Pride and Cleanliness 🧼",
        "sentiment": "positive",
        "keywords": [
          "high cleanliness standards",
          "tidy auto shop"
        ]
      }
    ]
  },
  {
    "id": "auto_com_06",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "Did the shop follow up after the repair to ensure the car was running great?",
    "options": [
      {
        "label": "Received a Caring Follow-Up Text 2 Days Later 📲",
        "sentiment": "positive",
        "keywords": [
          "post repair follow up",
          "attentive auto customer care"
        ]
      },
      {
        "label": "Ensured All Questions Were Answered Post-Service 📞",
        "sentiment": "positive",
        "keywords": [
          "post service support",
          "dedicated garage"
        ]
      },
      {
        "label": "Felt Genuinely Valued as a Long-Term Customer ❤️",
        "sentiment": "positive",
        "keywords": [
          "valued customer",
          "customer first approach"
        ]
      }
    ]
  },
  {
    "id": "auto_com_07",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "How would you describe the honesty and ethics of this shop?",
    "options": [
      {
        "label": "Honest Mechanics Are Hard to Find — This Shop is Gold! 💎",
        "sentiment": "positive",
        "keywords": [
          "rare honest mechanic",
          "100% trustworthy garage"
        ]
      },
      {
        "label": "Never Felt Taken Advantage of as a Non-Car Person 🛡️",
        "sentiment": "positive",
        "keywords": [
          "trustworthy for non-mechanics",
          "safe auto shop"
        ]
      },
      {
        "label": "Treated Like Family from Day One 👨‍👩‍👧",
        "sentiment": "positive",
        "keywords": [
          "treated like family",
          "ethical business"
        ]
      }
    ]
  },
  {
    "id": "auto_com_08",
    "category": "staff_communication",
    "categoryLabel": "Communication & Customer Waiting Lounge",
    "question": "Will you be returning here for all future car repairs and maintenance?",
    "options": [
      {
        "label": "The Only Place I Will Ever Take My Vehicles! 🚗",
        "sentiment": "positive",
        "keywords": [
          "lifelong auto repair shop",
          "dedicated customer"
        ]
      },
      {
        "label": "Telling All My Friends and Coworkers About Them 👍",
        "sentiment": "positive",
        "keywords": [
          "raving recommendation",
          "top rated mechanics"
        ]
      },
      {
        "label": "5 Stars for Flawless Mechanical Craftsmanship! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star auto repair",
          "outstanding automotive care"
        ]
      }
    ]
  },
  {
    "id": "auto_det_01",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "How was the exterior wash, clay bar, or paint correction?",
    "options": [
      {
        "label": "Paint Looks Like a Glass Mirror with Swirls Removed 🪞",
        "sentiment": "positive",
        "keywords": [
          "flawless paint correction",
          "mirror finish detailing"
        ]
      },
      {
        "label": "Ceramic Coating Makes Water Bead Off Effortlessly 🌧️",
        "sentiment": "positive",
        "keywords": [
          "hydrophobic ceramic coating",
          "deep paint gloss"
        ]
      },
      {
        "label": "Car Looked Better Than When It Rolled Off the Showroom Floor 🌟",
        "sentiment": "positive",
        "keywords": [
          "showroom condition",
          "best auto detailing"
        ]
      }
    ]
  },
  {
    "id": "auto_det_02",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "How clean and detailed was the vehicle interior?",
    "options": [
      {
        "label": "Deep Steam Cleaned Carpets & Restored Leather Seats 🧽",
        "sentiment": "positive",
        "keywords": [
          "deep interior steam cleaning",
          "conditioned leather seats"
        ]
      },
      {
        "label": "Every Nook, Cranny and AC Vent Cleaned of Dust 💨",
        "sentiment": "positive",
        "keywords": [
          "detailed dashboard and vents",
          "spotless interior"
        ]
      },
      {
        "label": "Eliminated Pet Hair and Odors Completely 🐾",
        "sentiment": "positive",
        "keywords": [
          "pet hair removal",
          "fresh new car scent"
        ]
      }
    ]
  },
  {
    "id": "auto_det_03",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "How was the tire replacement and wheel mounting service?",
    "options": [
      {
        "label": "Mounted and Road-Force Balanced with Zero Vibration 🛞",
        "sentiment": "positive",
        "keywords": [
          "road force balancing",
          "smooth tire mounting"
        ]
      },
      {
        "label": "Great Tire Recommendations for Wet / Snow Traction ❄️",
        "sentiment": "positive",
        "keywords": [
          "all season tire advice",
          "great wet traction"
        ]
      },
      {
        "label": "Tires Dressed and Wheels Cleaned of Brake Dust ✨",
        "sentiment": "positive",
        "keywords": [
          "clean wheels",
          "tire shine finish"
        ]
      }
    ]
  },
  {
    "id": "auto_det_04",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "How was the window tinting or glass repair (if applicable)?",
    "options": [
      {
        "label": "Flawless Ceramic Tint with Zero Bubbles or Peeling 🕶️",
        "sentiment": "positive",
        "keywords": [
          "bubble free ceramic tint",
          "heat rejection window tint"
        ]
      },
      {
        "label": "Cracked Windshield Replaced and Calibrated Perfectly 🪟",
        "sentiment": "positive",
        "keywords": [
          "windshield replacement",
          "adas camera calibration"
        ]
      },
      {
        "label": "Blocks Intense Heat and Keeps Interior Cool ❄️",
        "sentiment": "positive",
        "keywords": [
          "cool interior heat rejection",
          "uv protection tint"
        ]
      }
    ]
  },
  {
    "id": "auto_det_05",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "How was the vehicle inspection report for state or annual registration?",
    "options": [
      {
        "label": "Passed State Safety & Emissions Inspection Quickly 📋",
        "sentiment": "positive",
        "keywords": [
          "fast state inspection",
          "emissions test passed"
        ]
      },
      {
        "label": "Thorough Pre-Purchase Inspection Saved Me from a Lemon 🍋",
        "sentiment": "positive",
        "keywords": [
          "pre purchase inspection",
          "saved from bad car purchase"
        ]
      },
      {
        "label": "Clear Pass/Fail Checkpoints with Detailed Notes 📝",
        "sentiment": "positive",
        "keywords": [
          "detailed inspection report",
          "accurate vehicle safety check"
        ]
      }
    ]
  },
  {
    "id": "auto_det_06",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "How was the hybrid, electric (EV) or diesel diagnostic capability?",
    "options": [
      {
        "label": "Expert Certified Hybrid / EV High-Voltage Knowledge ⚡",
        "sentiment": "positive",
        "keywords": [
          "hybrid battery service",
          "certified ev mechanic"
        ]
      },
      {
        "label": "Diesel Engine Tuned for Maximum Power & Mileage 🚚",
        "sentiment": "positive",
        "keywords": [
          "diesel mechanic expertise",
          "optimal fuel efficiency"
        ]
      },
      {
        "label": "Advanced OEM Diagnostic Scanners on Site 🖥️",
        "sentiment": "positive",
        "keywords": [
          "factory level scan tools",
          "advanced diagnostics"
        ]
      }
    ]
  },
  {
    "id": "auto_det_07",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "Did the shop accommodate emergency towing or breakdown support?",
    "options": [
      {
        "label": "Helped Coordinate Prompt Towing to the Shop 🚨",
        "sentiment": "positive",
        "keywords": [
          "emergency towing assistance",
          "fast breakdown response"
        ]
      },
      {
        "label": "Inspected the Towed Car the Same Afternoon 👍",
        "sentiment": "positive",
        "keywords": [
          "same day emergency diagnosis",
          "reliable garage"
        ]
      },
      {
        "label": "Relieved All the Stress of a Breakdown 😌",
        "sentiment": "positive",
        "keywords": [
          "stress free emergency repair",
          "caring mechanics"
        ]
      }
    ]
  },
  {
    "id": "auto_det_08",
    "category": "detailing_specialty",
    "categoryLabel": "Detailing, Tires & Specialty Services",
    "question": "What is your final verdict on this automotive service facility?",
    "options": [
      {
        "label": "The Benchmark for Automotive Excellence & Integrity 🏆",
        "sentiment": "positive",
        "keywords": [
          "benchmark automotive shop",
          "best auto repair service"
        ]
      },
      {
        "label": "Top-Tier Craftsmanship, Honest Prices & Fast Service 🌟",
        "sentiment": "positive",
        "keywords": [
          "top tier car repair",
          "honest prices fast service"
        ]
      },
      {
        "label": "5 Stars Across Every Department! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star auto service",
          "highest recommendation"
        ]
      }
    ]
  }
]
};
