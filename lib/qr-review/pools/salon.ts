import { IndustryConfig } from "./types";

export const SALON_POOL: IndustryConfig = {
  id: "SALON_SPA",
  name: "Hair Salon, Spa & Beauty Clinic",
  icon: "💇",
  defaultPlaceHolder: "Luxe Hair Salon & Day Spa",
  sampleReview: "Obsessed with my hair! The balayage blend is completely seamless, the blowout lasted 4 days, and the scalp massage was pure bliss. Clean, stylish salon with lovely complimentary coffee. Found my forever stylist! ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "sal_hair_01",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How thrilled are you with your haircut or styling result?",
    "options": [
      {
        "label": "Best Haircut I've Ever Received! Exactly What I Wanted ✂️",
        "sentiment": "positive",
        "keywords": [
          "best haircut ever",
          "precision hair styling",
          "expert stylist"
        ]
      },
      {
        "label": "Flawless Layers & Effortless Natural Movement 💇",
        "sentiment": "positive",
        "keywords": [
          "perfect layers",
          "great hair movement"
        ]
      },
      {
        "label": "Framed My Face Perfectly and Boosted Confidence 🌟",
        "sentiment": "positive",
        "keywords": [
          "flattering haircut",
          "confident new look"
        ]
      },
      {
        "label": "Easy to Style and Maintain at Home 🏡",
        "sentiment": "positive",
        "keywords": [
          "low maintenance cut",
          "easy at home styling"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_02",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How was the hair coloring, highlights, or balayage outcome?",
    "options": [
      {
        "label": "Seamless, Sun-Kissed Balayage Blend 🎨",
        "sentiment": "positive",
        "keywords": [
          "seamless balayage",
          "expert colorist",
          "dimensional highlights"
        ]
      },
      {
        "label": "Rich, Vibrant & Glossy Color Match 💎",
        "sentiment": "positive",
        "keywords": [
          "vibrant hair color",
          "glossy hair finish"
        ]
      },
      {
        "label": "Zero Brassiness, Toned to Absolute Perfection ❄️",
        "sentiment": "positive",
        "keywords": [
          "perfect blonde toning",
          "no brassiness"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_03",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How was your blowout or event styling?",
    "options": [
      {
        "label": "Bouncy, Voluminous Blowout That Lasted Days! 💨",
        "sentiment": "positive",
        "keywords": [
          "long lasting blowout",
          "voluminous hair"
        ]
      },
      {
        "label": "Silky Smooth, Frizz-Free Finish 🪶",
        "sentiment": "positive",
        "keywords": [
          "smooth blowout",
          "frizz free hair"
        ]
      },
      {
        "label": "Stunning Updo for a Special Event 👰",
        "sentiment": "positive",
        "keywords": [
          "event hair styling",
          "gorgeous updo"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_04",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How did your hair feel after deep conditioning or keratin treatments?",
    "options": [
      {
        "label": "Silkier, Healthier & Ultra Nourished 🌿",
        "sentiment": "positive",
        "keywords": [
          "restored hair health",
          "deep conditioning treatment"
        ]
      },
      {
        "label": "Split Ends Gone & Texture Completely Restored 🪞",
        "sentiment": "positive",
        "keywords": [
          "keratin smoothing",
          "silky hair texture"
        ]
      },
      {
        "label": "Noticeable Gloss and Shine Under the Light ✨",
        "sentiment": "positive",
        "keywords": [
          "hair gloss treatment",
          "shiny healthy hair"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_05",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How was the precision of your beard trim or barber fade (if applicable)?",
    "options": [
      {
        "label": "Crisp, Razor-Sharp Edges & Flawless Skin Fade 🪒",
        "sentiment": "positive",
        "keywords": [
          "crisp skin fade",
          "master barber",
          "sharp beard line"
        ]
      },
      {
        "label": "Hot Towel Shave with Soothing Aftershave 🧴",
        "sentiment": "positive",
        "keywords": [
          "hot towel shave",
          "relaxing barber experience"
        ]
      },
      {
        "label": "Top-Tier Barber Precision & Craftsmanship 💈",
        "sentiment": "positive",
        "keywords": [
          "master barber cut",
          "meticulous beard trim"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_06",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "Did the stylist listen carefully to your requested hair length?",
    "options": [
      {
        "label": "Respected My Desired Length Exactly — No Surprises! 📏",
        "sentiment": "positive",
        "keywords": [
          "respected hair length",
          "listened to preferences"
        ]
      },
      {
        "label": "Showed Me in the Mirror Before Every Cut 🪞",
        "sentiment": "positive",
        "keywords": [
          "transparent styling",
          "checked with client"
        ]
      },
      {
        "label": "Only Cut What Was Truly Necessary for Health 💇",
        "sentiment": "positive",
        "keywords": [
          "healthy trim",
          "trusted stylist"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_07",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How was the scalp massage during the shampoo wash?",
    "options": [
      {
        "label": "Heavenly Scalp Massage Melted Away All Stress 💆",
        "sentiment": "positive",
        "keywords": [
          "heavenly scalp massage",
          "relaxing hair wash"
        ]
      },
      {
        "label": "Comfortable Reclining Wash Basin, No Neck Strain 🛏️",
        "sentiment": "positive",
        "keywords": [
          "comfortable shampoo sink",
          "ergonomic chair"
        ]
      },
      {
        "label": "Invigorating Essential Oil Shampoo Treatment 🌿",
        "sentiment": "positive",
        "keywords": [
          "aromatherapy shampoo",
          "invigorating scalp treatment"
        ]
      }
    ]
  },
  {
    "id": "sal_hair_08",
    "category": "styling_hair",
    "categoryLabel": "Hair Styling, Cuts & Color",
    "question": "How many compliments have you received on your new look?",
    "options": [
      {
        "label": "Compliments from Friends & Strangers Non-Stop! 🎉",
        "sentiment": "positive",
        "keywords": [
          "received tons of compliments",
          "head-turning hairstyle"
        ]
      },
      {
        "label": "Felt Like a Model Walking Out of the Salon 🌟",
        "sentiment": "positive",
        "keywords": [
          "model look",
          "unbelievable confidence boost"
        ]
      },
      {
        "label": "Found My Forever Hair Stylist! 🏆",
        "sentiment": "positive",
        "keywords": [
          "best hair stylist",
          "salon for life"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_01",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "How was the massage therapy or body treatment?",
    "options": [
      {
        "label": "Deep Tissue Magic — Every Muscle Knot Melted Away 💆",
        "sentiment": "positive",
        "keywords": [
          "expert deep tissue massage",
          "relieved muscle tension",
          "licensed therapist"
        ]
      },
      {
        "label": "Gentle Swedish Massage with Calming Aromatherapy 🌿",
        "sentiment": "positive",
        "keywords": [
          "relaxing swedish massage",
          "aromatherapy oils"
        ]
      },
      {
        "label": "Felt 10 Pounds Lighter & Purely Rejuvenated ✨",
        "sentiment": "positive",
        "keywords": [
          "rejuvenating body treatment",
          "ultimate relaxation"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_02",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "How was your custom facial and skincare treatment?",
    "options": [
      {
        "label": "Skin is Plump, Hydrated & Glowing Like Glass 💎",
        "sentiment": "positive",
        "keywords": [
          "hydrating facial",
          "glowing glass skin",
          "expert esthetician"
        ]
      },
      {
        "label": "Gentle Extractions with Zero Redness or Irritation 🪞",
        "sentiment": "positive",
        "keywords": [
          "painless extractions",
          "calm radiant skin"
        ]
      },
      {
        "label": "Customized Products Tailored to My Sensitive Skin 🧴",
        "sentiment": "positive",
        "keywords": [
          "sensitive skin facial",
          "custom skincare"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_03",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "How peaceful and serene was the treatment room environment?",
    "options": [
      {
        "label": "Soft Ambient Music, Dim Lighting & Heated Bed 🕯️",
        "sentiment": "positive",
        "keywords": [
          "heated spa table",
          "calming ambient music"
        ]
      },
      {
        "label": "Heavenly Aromatherapy Scent (Lavender/Eucalyptus) 🌿",
        "sentiment": "positive",
        "keywords": [
          "aromatherapy scent",
          "pure tranquility"
        ]
      },
      {
        "label": "Complete Silence and Privacy 🤫",
        "sentiment": "positive",
        "keywords": [
          "private treatment room",
          "peaceful sanctuary"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_04",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "How was your manicure, pedicure or nail service?",
    "options": [
      {
        "label": "Flawless Gel / Dip Nails with Meticulous Cuticle Work 💅",
        "sentiment": "positive",
        "keywords": [
          "flawless gel manicure",
          "clean cuticle work",
          "long lasting polish"
        ]
      },
      {
        "label": "Relaxing Foot Soak & Exfoliating Scrub 🦶",
        "sentiment": "positive",
        "keywords": [
          "deluxe pedicure",
          "exfoliating foot scrub"
        ]
      },
      {
        "label": "Long-Lasting, Chip-Free Polish Finish 💎",
        "sentiment": "positive",
        "keywords": [
          "chip free nails",
          "high shine topcoat"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_05",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "How was your lash, brow, or waxing service?",
    "options": [
      {
        "label": "Precise Brow Shaping & Tinting That Framed My Face 👁️",
        "sentiment": "positive",
        "keywords": [
          "perfect brow shaping",
          "brow lamination and tint"
        ]
      },
      {
        "label": "Gentle Waxing with Minimal Discomfort 🪶",
        "sentiment": "positive",
        "keywords": [
          "gentle waxing",
          "smooth hair removal"
        ]
      },
      {
        "label": "Lash Lift & Extensions Look Fluffy & Natural 🦋",
        "sentiment": "positive",
        "keywords": [
          "natural lash extensions",
          "gorgeous lash lift"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_06",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "Did the spa therapist check on your pressure and comfort throughout?",
    "options": [
      {
        "label": "Checked Pressure Perfectly and Adjusted Instantly 👍",
        "sentiment": "positive",
        "keywords": [
          "ideal massage pressure",
          "attentive therapist"
        ]
      },
      {
        "label": "Respected My Silence and Let Me Sleep 💤",
        "sentiment": "positive",
        "keywords": [
          "quiet relaxation",
          "respectful therapist"
        ]
      },
      {
        "label": "Tailored Focus to Stiff Neck & Shoulders 🎯",
        "sentiment": "positive",
        "keywords": [
          "targeted shoulder relief",
          "relieved stiff neck"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_07",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "How did you feel walking out of the spa after your session?",
    "options": [
      {
        "label": "Floating on a Cloud of Serenity ☁️",
        "sentiment": "positive",
        "keywords": [
          "total bliss",
          "floating on air",
          "deep peace"
        ]
      },
      {
        "label": "All Physical Pain and Mental Stress Vanished 🧘",
        "sentiment": "positive",
        "keywords": [
          "stress relief",
          "relieved chronic tension"
        ]
      },
      {
        "label": "Best Self-Care Investment I Made All Year 🌟",
        "sentiment": "positive",
        "keywords": [
          "self-care sanctuary",
          "worth every penny"
        ]
      }
    ]
  },
  {
    "id": "sal_spa_08",
    "category": "spa_massage",
    "categoryLabel": "Spa Therapies & Facials",
    "question": "Would you book recurring regular monthly spa treatments here?",
    "options": [
      {
        "label": "Already Signed Up for Monthly Spa Membership! 📅",
        "sentiment": "positive",
        "keywords": [
          "regular spa client",
          "monthly self-care routine"
        ]
      },
      {
        "label": "Bringing My Best Friend for a Spa Day Next Month 👭",
        "sentiment": "positive",
        "keywords": [
          "friend spa day",
          "recommended to everyone"
        ]
      },
      {
        "label": "A True Oasis of Wellness in the City 🏆",
        "sentiment": "positive",
        "keywords": [
          "top wellness spa",
          "5-star luxury spa"
        ]
      }
    ]
  },
  {
    "id": "sal_con_01",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "Did your stylist conduct a thorough consultation before starting?",
    "options": [
      {
        "label": "Detailed Consultation with Photos and Expert Guidance 📱",
        "sentiment": "positive",
        "keywords": [
          "in-depth hair consultation",
          "reviewed inspiration photos"
        ]
      },
      {
        "label": "Assessed Hair Texture, Face Shape & Lifestyle 🪞",
        "sentiment": "positive",
        "keywords": [
          "tailored to face shape",
          "assessed hair texture"
        ]
      },
      {
        "label": "Honest Professional Advice on What Suits Me Best 💡",
        "sentiment": "positive",
        "keywords": [
          "honest beauty advice",
          "expert recommendation"
        ]
      }
    ]
  },
  {
    "id": "sal_con_02",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "Did the stylist explain each step of the process as they worked?",
    "options": [
      {
        "label": "Clear Explanations That Put Me at Complete Ease 🗣️",
        "sentiment": "positive",
        "keywords": [
          "informative stylist",
          "transparent process"
        ]
      },
      {
        "label": "Shared Great Styling Tips for Blow-Drying at Home 💨",
        "sentiment": "positive",
        "keywords": [
          "at home blow dry tips",
          "educational stylist"
        ]
      },
      {
        "label": "Checked In on Water Temperature & Comfort Constantly 🌡️",
        "sentiment": "positive",
        "keywords": [
          "attentive comfort checks",
          "considerate team"
        ]
      }
    ]
  },
  {
    "id": "sal_con_03",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "How was the recommendation for at-home haircare or skincare products?",
    "options": [
      {
        "label": "Helpful Product Recommendations Without Any Pushiness 🧴",
        "sentiment": "positive",
        "keywords": [
          "no pushy sales",
          "helpful product advice"
        ]
      },
      {
        "label": "Prescribed Products Transformed My Hair at Home ✨",
        "sentiment": "positive",
        "keywords": [
          "effective salon products",
          "healthy maintenance"
        ]
      },
      {
        "label": "Tailored to My Exact Scalp and Hair Type 🌿",
        "sentiment": "positive",
        "keywords": [
          "personalized product picks",
          "professional haircare"
        ]
      }
    ]
  },
  {
    "id": "sal_con_04",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "How would you rate the artistic creativity and skill of your provider?",
    "options": [
      {
        "label": "True Visionary Artist with Scissors & Color 🎨",
        "sentiment": "positive",
        "keywords": [
          "true hair artist",
          "visionary stylist"
        ]
      },
      {
        "label": "Meticulous Attention to Every Single Strand 🔬",
        "sentiment": "positive",
        "keywords": [
          "meticulous detail",
          "master precision cut"
        ]
      },
      {
        "label": "Up-to-Date with the Hottest Runway & Social Trends 🔥",
        "sentiment": "positive",
        "keywords": [
          "trendsetting stylist",
          "modern techniques"
        ]
      }
    ]
  },
  {
    "id": "sal_con_05",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "How comfortable and conversational was your appointment?",
    "options": [
      {
        "label": "Delightful Conversation, Felt Like Catching Up with a Friend 😊",
        "sentiment": "positive",
        "keywords": [
          "friendly conversation",
          "warm personable stylist"
        ]
      },
      {
        "label": "Respected Quiet Time When I Wanted to Relax 🤫",
        "sentiment": "positive",
        "keywords": [
          "silent appointment option",
          "peaceful salon visit"
        ]
      },
      {
        "label": "Made the Entire 2-Hour Appointment Fly By! ⚡",
        "sentiment": "positive",
        "keywords": [
          "enjoyable appointment",
          "time flew by"
        ]
      }
    ]
  },
  {
    "id": "sal_con_06",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "Did the stylist explain realistic expectations for complex color transformations?",
    "options": [
      {
        "label": "Honest Roadmap for Hair Health & Color Lifting 🛡️",
        "sentiment": "positive",
        "keywords": [
          "prioritized hair health",
          "honest color transformation"
        ]
      },
      {
        "label": "Protected My Hair Integrity with Bond Builders 💎",
        "sentiment": "positive",
        "keywords": [
          "olaplex bond protection",
          "zero damage color"
        ]
      },
      {
        "label": "Achieved the Exact Goal Safely and Beautifully 🌟",
        "sentiment": "positive",
        "keywords": [
          "healthy blonde lift",
          "stunning color transformation"
        ]
      }
    ]
  },
  {
    "id": "sal_con_07",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "How was the consistency of your stylist's work over multiple visits?",
    "options": [
      {
        "label": "Flawless & Consistent Result Every Single Visit 🏆",
        "sentiment": "positive",
        "keywords": [
          "consistent haircut quality",
          "reliable hair stylist"
        ]
      },
      {
        "label": "Remembers My Formula and Style Preferences 📖",
        "sentiment": "positive",
        "keywords": [
          "kept client formula notes",
          "attentive service"
        ]
      },
      {
        "label": "Never Have to Worry in Their Chair 👍",
        "sentiment": "positive",
        "keywords": [
          "complete trust in stylist",
          "peace of mind"
        ]
      }
    ]
  },
  {
    "id": "sal_con_08",
    "category": "stylist_consultation",
    "categoryLabel": "Consultation & Professional Advice",
    "question": "Would you trust this salon for high-stakes events (weddings, photoshoots)?",
    "options": [
      {
        "label": "100% Yes! The Only Salon I Would Ever Trust 👰",
        "sentiment": "positive",
        "keywords": [
          "trusted bridal hair and makeup",
          "event beauty specialist"
        ]
      },
      {
        "label": "Made My Wedding / Party Look Unbelievable! 💍",
        "sentiment": "positive",
        "keywords": [
          "flawless wedding hair",
          "stunning makeup"
        ]
      },
      {
        "label": "Top-Tier Professionalism All the Way ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "top beauty salon",
          "5-star styling team"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_01",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "How sanitized and clean were the salon stations and styling chairs?",
    "options": [
      {
        "label": "Spotless Stations Disinfected Between Every Client ✨",
        "sentiment": "positive",
        "keywords": [
          "spotless salon station",
          "disinfected styling chair"
        ]
      },
      {
        "label": "Fresh, Clean Laundered Capes & Fluffy Towels 🧺",
        "sentiment": "positive",
        "keywords": [
          "fresh salon cape",
          "clean sanitized towels"
        ]
      },
      {
        "label": "Gleaming Mirrors and Hair Swept Promptly 🪞",
        "sentiment": "positive",
        "keywords": [
          "clean salon floor",
          "gleaming mirrors"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_02",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "Did you observe sterile, sanitized tools (shears, brushes, clippers)?",
    "options": [
      {
        "label": "Brushes and Shears Pulled from Barbicide / UV Sterilizers 🛡️",
        "sentiment": "positive",
        "keywords": [
          "sterilized shears and combs",
          "barbicide sanitized tools"
        ]
      },
      {
        "label": "Individually Sealed Manicure & Pedicure Tools 💅",
        "sentiment": "positive",
        "keywords": [
          "autoclaved nail tools",
          "hygienic manicure"
        ]
      },
      {
        "label": "100% Strict Hygiene Protocols Followed 🧼",
        "sentiment": "positive",
        "keywords": [
          "top salon hygiene",
          "safe clean environment"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_03",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "How was the aroma and air ventilation in the salon?",
    "options": [
      {
        "label": "Fresh, Calming Aromatherapy with Zero Harsh Fumes 🌸",
        "sentiment": "positive",
        "keywords": [
          "fresh spa scent",
          "no harsh chemical smell"
        ]
      },
      {
        "label": "Excellent Ventilation System for Color and Keratin 🍃",
        "sentiment": "positive",
        "keywords": [
          "well ventilated salon",
          "clean air system"
        ]
      },
      {
        "label": "Pleasant & Relaxing Scent from the Moment You Walk In 🌿",
        "sentiment": "positive",
        "keywords": [
          "relaxing salon atmosphere",
          "lovely fragrance"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_04",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "How were the complimentary beverages and hospitality touches?",
    "options": [
      {
        "label": "Cappuccino, Herbal Teas & Chilled Wine Offered ☕",
        "sentiment": "positive",
        "keywords": [
          "complimentary cappuccino",
          "wine during haircut"
        ]
      },
      {
        "label": "Delightful Sweet Treats & Sparkling Water 🥂",
        "sentiment": "positive",
        "keywords": [
          "sparkling water amenities",
          "pampering touches"
        ]
      },
      {
        "label": "Felt Like a Luxurious Day of Pampering 👑",
        "sentiment": "positive",
        "keywords": [
          "luxurious pampering",
          "vip treatment"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_05",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "How was the punctuality of your appointment start time?",
    "options": [
      {
        "label": "Taken to the Chair Right on Time! Zero Delay ⚡",
        "sentiment": "positive",
        "keywords": [
          "seated promptly",
          "punctual salon",
          "no waiting"
        ]
      },
      {
        "label": "Waiting Lounge Was Comfortable with Fashion Magazines 🛋️",
        "sentiment": "positive",
        "keywords": [
          "comfortable waiting area",
          "cozy lounge"
        ]
      },
      {
        "label": "Appointment Flowed Efficiently from Start to Finish ⏱️",
        "sentiment": "positive",
        "keywords": [
          "efficient appointment",
          "respected my time"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_06",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "How was the lighting and interior aesthetic of the salon?",
    "options": [
      {
        "label": "Chic, Modern Aesthetic with True-Color Lighting 💡",
        "sentiment": "positive",
        "keywords": [
          "flattering true-color lighting",
          "chic modern salon decor"
        ]
      },
      {
        "label": "Instagrammable Photo Wall for the Finished Hair Reveal 📸",
        "sentiment": "positive",
        "keywords": [
          "photo wall reveal",
          "beautiful aesthetic"
        ]
      },
      {
        "label": "Bright, Airy & Uplifting Space ☀️",
        "sentiment": "positive",
        "keywords": [
          "bright natural light",
          "uplifting salon environment"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_07",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "Was the pricing transparent and upfront before your service began?",
    "options": [
      {
        "label": "Full Price Breakdown Given in Consultation 📋",
        "sentiment": "positive",
        "keywords": [
          "transparent salon pricing",
          "no surprise bill"
        ]
      },
      {
        "label": "Fair, Competitive Rates for Master-Level Artistry 💵",
        "sentiment": "positive",
        "keywords": [
          "fair rates for artistry",
          "worth every dollar"
        ]
      },
      {
        "label": "Great Package Deals for Combined Hair & Spa Services 💎",
        "sentiment": "positive",
        "keywords": [
          "bundle package savings",
          "great beauty value"
        ]
      }
    ]
  },
  {
    "id": "sal_cln_08",
    "category": "cleanliness_products",
    "categoryLabel": "Cleanliness, Sanitized Tools & Ambiance",
    "question": "Overall, how would you rate your salon / spa visit?",
    "options": [
      {
        "label": "The Gold Standard for Hair and Beauty Care 🏆",
        "sentiment": "positive",
        "keywords": [
          "gold standard salon",
          "best salon in town"
        ]
      },
      {
        "label": "Left Feeling Beautiful, Relaxed and Confident ✨",
        "sentiment": "positive",
        "keywords": [
          "radiant and confident",
          "pampered experience"
        ]
      },
      {
        "label": "5 Stars Across the Board! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star salon experience",
          "highly recommend"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_01",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "How easy was scheduling your appointment online or by phone?",
    "options": [
      {
        "label": "Effortless 24/7 Online Booking System 📲",
        "sentiment": "positive",
        "keywords": [
          "easy online salon booking",
          "convenient appointment scheduling"
        ]
      },
      {
        "label": "Friendly Receptionist Found a Slot on Short Notice 📞",
        "sentiment": "positive",
        "keywords": [
          "helpful receptionist",
          "last minute appointment slot"
        ]
      },
      {
        "label": "Great Cancellation / Reschedule Flexibility 📅",
        "sentiment": "positive",
        "keywords": [
          "flexible booking policy",
          "accommodating salon"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_02",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "Did you receive timely appointment text and email reminders?",
    "options": [
      {
        "label": "Convenient SMS Reminder with 1-Tap Confirmation 🔔",
        "sentiment": "positive",
        "keywords": [
          "sms appointment reminder",
          "automated confirmation"
        ]
      },
      {
        "label": "Calendar Invite with Easy Directions & Parking Info 📍",
        "sentiment": "positive",
        "keywords": [
          "clear salon directions",
          "parking instructions"
        ]
      },
      {
        "label": "Warm Follow-Up Call Before Visit 📞",
        "sentiment": "positive",
        "keywords": [
          "thoughtful confirmation call",
          "great communication"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_03",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "How was the front desk reception greeting upon your arrival?",
    "options": [
      {
        "label": "Welcomed by Name with a Coat Check & Smile 🧥",
        "sentiment": "positive",
        "keywords": [
          "warm reception greeting",
          "complimentary coat check"
        ]
      },
      {
        "label": "Offered a Refreshing Beverage Right Away 🥂",
        "sentiment": "positive",
        "keywords": [
          "welcome beverage",
          "polite reception staff"
        ]
      },
      {
        "label": "Smooth, Professional Check-In Experience 📋",
        "sentiment": "positive",
        "keywords": [
          "efficient front desk",
          "courteous team"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_04",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "How was the checkout and rebooking process?",
    "options": [
      {
        "label": "Rebooked Next 8-Week Appointment in 30 Seconds 📅",
        "sentiment": "positive",
        "keywords": [
          "quick rebooking",
          "secured next appointment"
        ]
      },
      {
        "label": "Smooth Contactless Payment with Digital Receipt 📲",
        "sentiment": "positive",
        "keywords": [
          "contactless checkout",
          "digital receipt emailed"
        ]
      },
      {
        "label": "Sample Products Given at Checkout 🎁",
        "sentiment": "positive",
        "keywords": [
          "complimentary beauty samples",
          "generous salon touch"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_05",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "Did the salon team follow up after your appointment to check on your hair / skin?",
    "options": [
      {
        "label": "Received a Sweet Text Checking How I Liked the Style 💬",
        "sentiment": "positive",
        "keywords": [
          "caring post-appointment text",
          "attentive follow-up"
        ]
      },
      {
        "label": "Provided Helpful Home Styling Tips Afterwards 📱",
        "sentiment": "positive",
        "keywords": [
          "post visit care advice",
          "helpful stylist"
        ]
      },
      {
        "label": "Demonstrated True Dedication to Client Satisfaction ❤️",
        "sentiment": "positive",
        "keywords": [
          "dedicated to customer happiness",
          "client focused salon"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_06",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "How was the salon's loyalty or rewards program?",
    "options": [
      {
        "label": "Earned Great Points Towards Future Treatments 💳",
        "sentiment": "positive",
        "keywords": [
          "rewarding loyalty program",
          "earned discount points"
        ]
      },
      {
        "label": "Birthday Discount / Treatment Upgrade Surprise 🎂",
        "sentiment": "positive",
        "keywords": [
          "birthday reward",
          "appreciated loyalty perk"
        ]
      },
      {
        "label": "Generous Referral Perks for Bringing Friends 👭",
        "sentiment": "positive",
        "keywords": [
          "friend referral bonus",
          "great customer perks"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_07",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "How was the overall team energy and workplace vibe?",
    "options": [
      {
        "label": "Positive, Supportive Team Members Who Help Each Other 🤝",
        "sentiment": "positive",
        "keywords": [
          "collaborative salon team",
          "great salon culture"
        ]
      },
      {
        "label": "Fun, Upbeat & Infectious Good Vibes ☀️",
        "sentiment": "positive",
        "keywords": [
          "upbeat energy",
          "happy salon atmosphere"
        ]
      },
      {
        "label": "Professionalism and Polish Across Every Member 🏅",
        "sentiment": "positive",
        "keywords": [
          "polished team",
          "high professional standard"
        ]
      }
    ]
  },
  {
    "id": "sal_srv_08",
    "category": "service_booking",
    "categoryLabel": "Booking & Customer Service",
    "question": "Will you recommend this salon / spa to friends and coworkers?",
    "options": [
      {
        "label": "Already Told Everyone at Work About It! 👍",
        "sentiment": "positive",
        "keywords": [
          "raved to coworkers",
          "highest beauty recommendation"
        ]
      },
      {
        "label": "My Friends Are Already Booking Appointments Here 🌟",
        "sentiment": "positive",
        "keywords": [
          "friends booked appointments",
          "trusted beauty hub"
        ]
      },
      {
        "label": "5 Stars for an Unbeatable Experience! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star salon",
          "ultimate beauty destination"
        ]
      }
    ]
  }
]
};
