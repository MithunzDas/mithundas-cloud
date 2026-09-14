import { IndustryConfig } from "./types";

export const GYM_POOL: IndustryConfig = {
  id: "GYM",
  name: "Gym, Fitness Center & CrossFit",
  icon: "💪",
  defaultPlaceHolder: "Iron & Strength Athletic Club",
  sampleReview: "Incredible gym! Top-tier squat racks and free weights, spotless locker rooms with cedar sauna, and motivating workout music. Trainers are knowledgeable and the community is super supportive. Best gym in town! ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "gym_eq_01",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How is the variety and availability of workout equipment?",
    "options": [
      {
        "label": "Top-of-the-Line Machines & Abundant Squat Racks 🏋️",
        "sentiment": "positive",
        "keywords": [
          "state of the art gym equipment",
          "plenty of squat racks",
          "great free weights"
        ]
      },
      {
        "label": "Rarely Ever Have to Wait for a Machine or Dumbbells ⏱️",
        "sentiment": "positive",
        "keywords": [
          "no waiting for machines",
          "spacious weight room"
        ]
      },
      {
        "label": "Wide Selection of Dumbbells Up to Heavy Weights 🔩",
        "sentiment": "positive",
        "keywords": [
          "heavy dumbbells",
          "comprehensive weight section"
        ]
      },
      {
        "label": "Great Dedicated Functional Fitness & Turf Area 🏃",
        "sentiment": "positive",
        "keywords": [
          "functional turf track",
          "sled and kettlebell area"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_02",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How well-maintained is the cardio and resistance machinery?",
    "options": [
      {
        "label": "Everything is Maintained, Smooth & Rarely Out of Order ⚙️",
        "sentiment": "positive",
        "keywords": [
          "well maintained gym machines",
          "smooth cables and pulleys"
        ]
      },
      {
        "label": "High-Tech Cardio with Built-in Screens & Fans 📺",
        "sentiment": "positive",
        "keywords": [
          "modern treadmills with screens",
          "stairmasters with fans"
        ]
      },
      {
        "label": "Quick Repairs Whenever Maintenance is Needed 🔧",
        "sentiment": "positive",
        "keywords": [
          "prompt equipment repair",
          "meticulous gym upkeep"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_03",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How clean is the gym floor and sanitizing wipe stations?",
    "options": [
      {
        "label": "Spotless Floor with Abundant Disinfectant Wipes Everywhere 🧴",
        "sentiment": "positive",
        "keywords": [
          "clean gym floor",
          "plenty of disinfectant wipes"
        ]
      },
      {
        "label": "Members Consistently Wipe Down Equipment After Use 🧽",
        "sentiment": "positive",
        "keywords": [
          "hygienic members",
          "courteous gym culture"
        ]
      },
      {
        "label": "Dedicated Cleaning Crew Constantly Sanitizing Machines 🧼",
        "sentiment": "positive",
        "keywords": [
          "constant gym sanitizing",
          "sparkling clean gym"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_04",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How is the ventilation, air conditioning and freshness of the gym?",
    "options": [
      {
        "label": "Crisp, Powerful AC and Great Air Circulation ❄️",
        "sentiment": "positive",
        "keywords": [
          "powerful gym ac",
          "great air circulation"
        ]
      },
      {
        "label": "Fresh Smell, Zero Stale Gym Odor 🍃",
        "sentiment": "positive",
        "keywords": [
          "fresh smelling gym",
          "never stuffy"
        ]
      },
      {
        "label": "High Ceilings with Industrial Fans 💨",
        "sentiment": "positive",
        "keywords": [
          "high ceilings",
          "airy workout environment"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_05",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How is the stretching and recovery area?",
    "options": [
      {
        "label": "Dedicated Foam Rolling & Mat Stretching Zone 🧘",
        "sentiment": "positive",
        "keywords": [
          "spacious stretching area",
          "foam rollers and bands"
        ]
      },
      {
        "label": "Massage Guns and Percussive Therapy Available 🔫",
        "sentiment": "positive",
        "keywords": [
          "massage gun recovery",
          "recovery lounge"
        ]
      },
      {
        "label": "Quiet Space for Mobility and Warmups 🌿",
        "sentiment": "positive",
        "keywords": [
          "mobility warmup area",
          "dedicated mat space"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_06",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How is the heavy lifting and deadlift platform setup?",
    "options": [
      {
        "label": "Solid Wood Deadlift Platforms with Bumper Plates 🧱",
        "sentiment": "positive",
        "keywords": [
          "deadlift platforms",
          "olympic bumper plates"
        ]
      },
      {
        "label": "Chalk Allowed & Supportive Lifting Culture 🏋️",
        "sentiment": "positive",
        "keywords": [
          "chalk allowed",
          "powerlifting friendly gym"
        ]
      },
      {
        "label": "High-Quality Calibrated Barbells with Great Knurling 🔩",
        "sentiment": "positive",
        "keywords": [
          "calibrated bars",
          "sharp knurling"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_07",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "How is the layout and space between equipment?",
    "options": [
      {
        "label": "Spacious Floor Plan, Never Feels Cramped or Cluttered 🚶",
        "sentiment": "positive",
        "keywords": [
          "open gym floor plan",
          "plenty of walking room"
        ]
      },
      {
        "label": "Logically Grouped by Muscle Groups and Movements 🧠",
        "sentiment": "positive",
        "keywords": [
          "well organized equipment",
          "logical gym layout"
        ]
      },
      {
        "label": "Plenty of Mirror Space to Check Form 🪞",
        "sentiment": "positive",
        "keywords": [
          "great form mirrors",
          "bright lighting"
        ]
      }
    ]
  },
  {
    "id": "gym_eq_08",
    "category": "equipment_facilities",
    "categoryLabel": "Equipment, Weights & Facilities",
    "question": "Overall, how does this facility compare to other gyms in the area?",
    "options": [
      {
        "label": "By Far the Most Well-Equipped Gym in Town 🏆",
        "sentiment": "positive",
        "keywords": [
          "best gym in town",
          "top fitness facility"
        ]
      },
      {
        "label": "True Lifter's and Athlete's Paradise 💎",
        "sentiment": "positive",
        "keywords": [
          "serious training gym",
          "athlete paradise"
        ]
      },
      {
        "label": "Unbeatable Value for the Equipment Quality 🌟",
        "sentiment": "positive",
        "keywords": [
          "great gym value",
          "worth every penny"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_01",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "How knowledgeable and encouraging are the personal trainers?",
    "options": [
      {
        "label": "Certified Masters of Biomechanics & Form Correction 📋",
        "sentiment": "positive",
        "keywords": [
          "expert personal trainer",
          "precise form correction",
          "certified coach"
        ]
      },
      {
        "label": "Motivating, Passionate & Pushed Me Beyond Limits 🚀",
        "sentiment": "positive",
        "keywords": [
          "motivating coach",
          "inspiring fitness trainer"
        ]
      },
      {
        "label": "Personalized Program Tailored to My Injuries & Goals 🎯",
        "sentiment": "positive",
        "keywords": [
          "injury safe workouts",
          "custom fitness programming"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_02",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "How approachable is the floor staff if you need assistance?",
    "options": [
      {
        "label": "Friendly Staff Always Ready to Spot or Advise 👍",
        "sentiment": "positive",
        "keywords": [
          "helpful gym staff",
          "courteous spotters"
        ]
      },
      {
        "label": "Warm Greeting by Name Every Time I Enter 😊",
        "sentiment": "positive",
        "keywords": [
          "welcoming front desk",
          "knows my name"
        ]
      },
      {
        "label": "Eager to Show Beginners How to Use Machines 🤝",
        "sentiment": "positive",
        "keywords": [
          "beginner friendly gym",
          "patient staff"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_03",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "How fast have you noticed physical results with your trainer?",
    "options": [
      {
        "label": "Gained Visible Muscle and Dropped Body Fat in 6 Weeks 📈",
        "sentiment": "positive",
        "keywords": [
          "fast fitness results",
          "body recomposition"
        ]
      },
      {
        "label": "Stronger Than Ever with Zero Joint Pain 🛡️",
        "sentiment": "positive",
        "keywords": [
          "joint safe strength",
          "pain free workouts"
        ]
      },
      {
        "label": "Energy and Daily Stamina Skyrocketed ⚡",
        "sentiment": "positive",
        "keywords": [
          "high stamina",
          "improved energy levels"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_04",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "Did the coaching include nutrition and recovery guidance?",
    "options": [
      {
        "label": "Great Macronutrient & Meal Prep Advice 🥗",
        "sentiment": "positive",
        "keywords": [
          "macro coaching",
          "practical nutrition advice"
        ]
      },
      {
        "label": "Helped Me Hit My Daily Protein Goals Easily 🥩",
        "sentiment": "positive",
        "keywords": [
          "protein intake guidance",
          "muscle recovery"
        ]
      },
      {
        "label": "Emphasized Sleep and Hydration Milestones 💧",
        "sentiment": "positive",
        "keywords": [
          "holistic coaching",
          "recovery optimization"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_05",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "How was the onboarding session or fitness assessment for new members?",
    "options": [
      {
        "label": "Thorough InBody Scan and Mobility Assessment 📊",
        "sentiment": "positive",
        "keywords": [
          "inbody body composition scan",
          "mobility screening"
        ]
      },
      {
        "label": "Set Clear, Measurable 90-Day Milestones 🎯",
        "sentiment": "positive",
        "keywords": [
          "clear fitness roadmap",
          "achievable milestones"
        ]
      },
      {
        "label": "Made Me Feel Confident Starting Out 🌟",
        "sentiment": "positive",
        "keywords": [
          "empowered fitness start",
          "welcoming orientation"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_06",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "How engaging and attentive is the trainer during private sessions?",
    "options": [
      {
        "label": "100% Focused on Me with Zero Phone Distractions 📱",
        "sentiment": "positive",
        "keywords": [
          "focused personal trainer",
          "dedicated attention"
        ]
      },
      {
        "label": "Logged Every Set, Rep and Weight Meticulously 📝",
        "sentiment": "positive",
        "keywords": [
          "tracked progression",
          "progressive overload tracking"
        ]
      },
      {
        "label": "Constantly Encouraged and Kept Energy High 🔥",
        "sentiment": "positive",
        "keywords": [
          "positive reinforcement",
          "high energy session"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_07",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "Did the trainer help you overcome a plateau or past injury?",
    "options": [
      {
        "label": "Fixed My Chronic Shoulder / Lower Back Discomfort 🩹",
        "sentiment": "positive",
        "keywords": [
          "rehabilitated shoulder",
          "strengthened lower back"
        ]
      },
      {
        "label": "Broke Through My Bench / Squat Strength Plateau 💥",
        "sentiment": "positive",
        "keywords": [
          "smashed strength plateau",
          "new personal record"
        ]
      },
      {
        "label": "Restored My Confidence in Heavy Compound Lifts 🏋️",
        "sentiment": "positive",
        "keywords": [
          "safe compound lifting",
          "confident form"
        ]
      }
    ]
  },
  {
    "id": "gym_trn_08",
    "category": "coaching_training",
    "categoryLabel": "Coaching, Trainers & Form",
    "question": "Would you recommend the personal training program to friends?",
    "options": [
      {
        "label": "Best Fitness Investment of My Life! 🏆",
        "sentiment": "positive",
        "keywords": [
          "best personal trainer",
          "transformative coaching"
        ]
      },
      {
        "label": "Transformed Not Just My Body, but My Mindset 🧠",
        "sentiment": "positive",
        "keywords": [
          "mindset transformation",
          "life changing fitness"
        ]
      },
      {
        "label": "10/10 Coaching Quality ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "10/10 fitness coach",
          "highly recommended trainer"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_01",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "How is the workout vibe and energy inside the gym?",
    "options": [
      {
        "label": "High-Energy, Electric & Motivating Atmosphere 🔥",
        "sentiment": "positive",
        "keywords": [
          "high energy gym",
          "motivating workout vibe",
          "pumped up atmosphere"
        ]
      },
      {
        "label": "Great Workout Music Playlist at Just the Right Volume 🎵",
        "sentiment": "positive",
        "keywords": [
          "motivating playlist",
          "great gym music"
        ]
      },
      {
        "label": "Welcoming to Beginners, Athletes & Everyone in Between 🤝",
        "sentiment": "positive",
        "keywords": [
          "non intimidating gym",
          "friendly fitness community"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_02",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "How respectful and supportive is the member community?",
    "options": [
      {
        "label": "Super Friendly Lifters Who Re-Rack Their Weights 🏋️",
        "sentiment": "positive",
        "keywords": [
          "respectful members",
          "re-racked weights",
          "courteous culture"
        ]
      },
      {
        "label": "Positive Vibes, Zero Toxic Ego or Intimidation 🌿",
        "sentiment": "positive",
        "keywords": [
          "no toxic ego",
          "supportive gym members"
        ]
      },
      {
        "label": "Members Cheer Each Other on During Big Lifts 👏",
        "sentiment": "positive",
        "keywords": [
          "cheered on PRs",
          "tight knit gym family"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_03",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "How is the lighting and gym decor?",
    "options": [
      {
        "label": "Modern Industrial Lighting with Dark Aesthetic 💡",
        "sentiment": "positive",
        "keywords": [
          "cool gym aesthetic",
          "modern industrial decor"
        ]
      },
      {
        "label": "Flattering Mirrors & Great Lighting for Progress Photos 📸",
        "sentiment": "positive",
        "keywords": [
          "great lighting for gym selfies",
          "progress photos"
        ]
      },
      {
        "label": "Inspiring Motivational Murals on the Walls 🎨",
        "sentiment": "positive",
        "keywords": [
          "motivational gym murals",
          "inspiring space"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_04",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "How is the crowd level during peak morning or evening hours?",
    "options": [
      {
        "label": "Busy But Flow is Great, Always Able to Work In 👍",
        "sentiment": "positive",
        "keywords": [
          "smooth gym flow",
          "easy to share machines"
        ]
      },
      {
        "label": "Cap on Members Keeps It From Getting Overcrowded 🛡️",
        "sentiment": "positive",
        "keywords": [
          "never overcrowded",
          "capped membership"
        ]
      },
      {
        "label": "Plenty of Alternate Equipment to Keep Workouts Moving ⚡",
        "sentiment": "positive",
        "keywords": [
          "abundant equipment",
          "efficient workouts"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_05",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "How does going to this gym make you feel?",
    "options": [
      {
        "label": "Actually Look Forward to Every Single Workout! 🚀",
        "sentiment": "positive",
        "keywords": [
          "look forward to workouts",
          "consistent fitness habit"
        ]
      },
      {
        "label": "Crushes Daily Stress and Clears My Head 🧠",
        "sentiment": "positive",
        "keywords": [
          "stress relief gym",
          "mental health boost"
        ]
      },
      {
        "label": "Feel Strong, Empowered and Confident 💪",
        "sentiment": "positive",
        "keywords": [
          "empowered fitness",
          "confident body"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_06",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "Does the gym host fun community events or fitness challenges?",
    "options": [
      {
        "label": "Fun Seasonal Member Challenges with Prizes 🏆",
        "sentiment": "positive",
        "keywords": [
          "fitness challenge",
          "fun community competitions"
        ]
      },
      {
        "label": "Charity Lifts & Member Appreciation BBQs 🍔",
        "sentiment": "positive",
        "keywords": [
          "member appreciation events",
          "community gym"
        ]
      },
      {
        "label": "Strong Sense of Belonging and Camaderie 🤝",
        "sentiment": "positive",
        "keywords": [
          "camaraderie and friendship",
          "gym family"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_07",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "How is the smoothie bar or shake counter (if available)?",
    "options": [
      {
        "label": "Delicious Protein Shakes Made with Real Fruit 🍓",
        "sentiment": "positive",
        "keywords": [
          "tasty post workout shake",
          "protein smoothie bar"
        ]
      },
      {
        "label": "Pre-Workouts and Electrolytes Readily Available ⚡",
        "sentiment": "positive",
        "keywords": [
          "pre workout drinks",
          "hydrating electrolytes"
        ]
      },
      {
        "label": "Healthy Snacks & Meal Preps to Grab on the Go 🥪",
        "sentiment": "positive",
        "keywords": [
          "healthy grab and go",
          "gym nutrition bar"
        ]
      }
    ]
  },
  {
    "id": "gym_atm_08",
    "category": "atmosphere_community",
    "categoryLabel": "Vibe, Music & Gym Culture",
    "question": "Overall, what rating would you give the gym community?",
    "options": [
      {
        "label": "Best Gym Community I've Ever Been Part Of 🌟",
        "sentiment": "positive",
        "keywords": [
          "best gym community",
          "supportive gym family"
        ]
      },
      {
        "label": "The Healthiest Habit in My Daily Life ❤️",
        "sentiment": "positive",
        "keywords": [
          "positive lifestyle habit",
          "life changing gym"
        ]
      },
      {
        "label": "5 Stars Across the Board! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star fitness center",
          "unbeatable gym"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_01",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How energetic and engaging are the group fitness classes?",
    "options": [
      {
        "label": "HIIT / Circuit Classes Torch Calories & Keep It Fun 🔥",
        "sentiment": "positive",
        "keywords": [
          "intense hiit class",
          "fun circuit training",
          "calorie torching"
        ]
      },
      {
        "label": "Instructors Keep Energy High with Killer Playlists 🎵",
        "sentiment": "positive",
        "keywords": [
          "motivating class instructor",
          "great music"
        ]
      },
      {
        "label": "Modifications Provided for Every Fitness Level 🛡️",
        "sentiment": "positive",
        "keywords": [
          "beginner friendly classes",
          "scalable workouts"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_02",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How was the yoga, Pilates, or mobility sessions?",
    "options": [
      {
        "label": "Deep Restorative Yoga That Restored Flexibility 🧘",
        "sentiment": "positive",
        "keywords": [
          "restorative yoga class",
          "improved flexibility"
        ]
      },
      {
        "label": "Core-Burning Pilates with Flawless Cueing 🩰",
        "sentiment": "positive",
        "keywords": [
          "core pilates workout",
          "expert cueing"
        ]
      },
      {
        "label": "Peaceful Mind-Body Escape from Busy Life 🌿",
        "sentiment": "positive",
        "keywords": [
          "mind body wellness",
          "calming class"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_03",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How is the spin / indoor cycling studio?",
    "options": [
      {
        "label": "Rhythm-Based Cycling with Club Lighting & Bass 🚴",
        "sentiment": "positive",
        "keywords": [
          "rhythm spin class",
          "high energy cycling studio"
        ]
      },
      {
        "label": "State-of-the-Art Magnetic Bikes with Power Meters ⚡",
        "sentiment": "positive",
        "keywords": [
          "smooth spin bikes",
          "power meter tracking"
        ]
      },
      {
        "label": "Sweat-Drenched Workout with Incredible Energy 💦",
        "sentiment": "positive",
        "keywords": [
          "intense cardio workout",
          "sweat session"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_04",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How was the boxing / kickboxing or martial arts conditioning?",
    "options": [
      {
        "label": "Heavy Bag Combos and Authentic Technique Work 🥊",
        "sentiment": "positive",
        "keywords": [
          "boxing conditioning",
          "heavy bag workout"
        ]
      },
      {
        "label": "Empowering, Intense and Fun Cardio Burn 💥",
        "sentiment": "positive",
        "keywords": [
          "empowering kickboxing",
          "full body burn"
        ]
      },
      {
        "label": "Knowledgeable Coaches Who Emphasize Safety 🛡️",
        "sentiment": "positive",
        "keywords": [
          "safe boxing coaching",
          "proper technique"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_05",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How easy is booking your spot in group classes?",
    "options": [
      {
        "label": "1-Tap Class Booking via Mobile App 📱",
        "sentiment": "positive",
        "keywords": [
          "easy class booking app",
          "convenient reservation"
        ]
      },
      {
        "label": "Ample Class Slots Throughout the Week 🗓️",
        "sentiment": "positive",
        "keywords": [
          "varied class schedule",
          "morning and evening classes"
        ]
      },
      {
        "label": "Fair Waitlist System with Fast Notifications 🔔",
        "sentiment": "positive",
        "keywords": [
          "responsive waitlist",
          "well managed schedule"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_06",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How well do the class instructors track individual form?",
    "options": [
      {
        "label": "Coach Walked the Room to Correct Posture and Post 🧐",
        "sentiment": "positive",
        "keywords": [
          "hands on form correction",
          "safe class instruction"
        ]
      },
      {
        "label": "Made Sure Everyone Lifted Safely and Effectively 🛡️",
        "sentiment": "positive",
        "keywords": [
          "safe lifting technique",
          "injury prevention"
        ]
      },
      {
        "label": "Personal Attention Even in a Group Setting 👍",
        "sentiment": "positive",
        "keywords": [
          "individual attention",
          "great class coach"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_07",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "How diverse is the weekly class schedule?",
    "options": [
      {
        "label": "Exciting Mix of Strength, Cardio, and Recovery 🔄",
        "sentiment": "positive",
        "keywords": [
          "balanced class schedule",
          "diverse fitness classes"
        ]
      },
      {
        "label": "Early 6 AM Classes and Convenient After-Work Slots 🌅",
        "sentiment": "positive",
        "keywords": [
          "early bird morning classes",
          "evening fitness slots"
        ]
      },
      {
        "label": "Weekend Sweat Sessions Keep Routine Strong ☀️",
        "sentiment": "positive",
        "keywords": [
          "weekend workout classes",
          "consistent fitness"
        ]
      }
    ]
  },
  {
    "id": "gym_cls_08",
    "category": "classes_programs",
    "categoryLabel": "Group Fitness, HIIT & Yoga Classes",
    "question": "Would you recommend the group classes to someone wanting to get fit?",
    "options": [
      {
        "label": "The Most Fun Way to Get in the Best Shape of Your Life! 🏆",
        "sentiment": "positive",
        "keywords": [
          "best group fitness",
          "fun workout classes"
        ]
      },
      {
        "label": "Keeps Me Accountable and Coming Back Every Week 📅",
        "sentiment": "positive",
        "keywords": [
          "accountability group",
          "consistent results"
        ]
      },
      {
        "label": "5 Stars for Class Energy and Instructors! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star group classes",
          "top instructors"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_01",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How clean and maintained are the locker rooms?",
    "options": [
      {
        "label": "Spotless, Fresh Smelling & Meticulously Maintained 🧼",
        "sentiment": "positive",
        "keywords": [
          "clean gym locker rooms",
          "spotless changing area"
        ]
      },
      {
        "label": "Clean Digital Keypad Lockers That Don't Require Padlocks 🔒",
        "sentiment": "positive",
        "keywords": [
          "secure digital lockers",
          "convenient keyless locks"
        ]
      },
      {
        "label": "Plenty of Open Benches and Dressing Space 🛋️",
        "sentiment": "positive",
        "keywords": [
          "spacious locker room",
          "comfortable changing space"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_02",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How is the shower and grooming area?",
    "options": [
      {
        "label": "Hot Showers with Great Water Pressure 🚿",
        "sentiment": "positive",
        "keywords": [
          "hot showers great pressure",
          "clean private shower stalls"
        ]
      },
      {
        "label": "Complimentary Body Wash, Shampoo & Blow Dryers 🧴",
        "sentiment": "positive",
        "keywords": [
          "complimentary toiletries",
          "hair dryers provided"
        ]
      },
      {
        "label": "Private Changing Cubicles and Fresh Towel Service 🧺",
        "sentiment": "positive",
        "keywords": [
          "towel service",
          "private shower stalls"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_03",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How is the dry cedar sauna or eucalyptus steam room?",
    "options": [
      {
        "label": "Rejuvenating Cedar Sauna at the Perfect Temperature 🔥",
        "sentiment": "positive",
        "keywords": [
          "relaxing cedar sauna",
          "post workout sauna sweat"
        ]
      },
      {
        "label": "Eucalyptus Steam Room Melts Muscle Soreness 🧖",
        "sentiment": "positive",
        "keywords": [
          "eucalyptus steam room",
          "muscle recovery"
        ]
      },
      {
        "label": "Clean, Wood Kept Fresh and Sanitized Regularly 🌿",
        "sentiment": "positive",
        "keywords": [
          "sanitized sauna",
          "clean wellness facilities"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_04",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How convenient is the 24/7 keycard or mobile app entry?",
    "options": [
      {
        "label": "Seamless 24/7 Access, Work Out Whenever I Want 🌙",
        "sentiment": "positive",
        "keywords": [
          "24/7 gym access",
          "flexible workout hours"
        ]
      },
      {
        "label": "Secure Bluetooth / Keycard Entry System 📲",
        "sentiment": "positive",
        "keywords": [
          "seamless app entry",
          "secure after hours access"
        ]
      },
      {
        "label": "Well-Lit and Monitored Parking for Late Visits 🚗",
        "sentiment": "positive",
        "keywords": [
          "safe late night gym",
          "well lit parking lot"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_05",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How is the chilled water bottle refill station?",
    "options": [
      {
        "label": "Fast, Filtered & Ice-Cold Water Fountain 💧",
        "sentiment": "positive",
        "keywords": [
          "filtered cold water station",
          "fast water refill"
        ]
      },
      {
        "label": "Touchless Sensor for Maximum Hygiene 🚰",
        "sentiment": "positive",
        "keywords": [
          "touchless water dispenser",
          "clean hydration"
        ]
      },
      {
        "label": "Keeps Me Hydrated Throughout the Workout 🧊",
        "sentiment": "positive",
        "keywords": [
          "great gym hydration",
          "convenient water stations"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_06",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How is the membership pricing transparency and cancellation policy?",
    "options": [
      {
        "label": "Fair, Transparent Monthly Pricing with Zero Hidden Fees 💵",
        "sentiment": "positive",
        "keywords": [
          "transparent gym membership",
          "no hidden fees",
          "affordable gym"
        ]
      },
      {
        "label": "Flexible Month-to-Month with No Slanted Contracts 📋",
        "sentiment": "positive",
        "keywords": [
          "no locked contract",
          "easy cancellation policy"
        ]
      },
      {
        "label": "Unbeatable Value for the World-Class Amenities 💎",
        "sentiment": "positive",
        "keywords": [
          "exceptional value gym",
          "premium amenities fair price"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_07",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "How clean and pleasant are the restroom facilities?",
    "options": [
      {
        "label": "Immaculately Clean & Checked Hourly 🧽",
        "sentiment": "positive",
        "keywords": [
          "hourly restroom checks",
          "clean gym bathrooms"
        ]
      },
      {
        "label": "Fully Stocked with Paper Towels and Soap 🧼",
        "sentiment": "positive",
        "keywords": [
          "fully stocked amenities",
          "well supplied"
        ]
      },
      {
        "label": "One of the Cleanest Gyms I've Ever Visited 🏆",
        "sentiment": "positive",
        "keywords": [
          "cleanest gym in town",
          "hygiene focused"
        ]
      }
    ]
  },
  {
    "id": "gym_amn_08",
    "category": "amenities_lockers",
    "categoryLabel": "Locker Rooms, Sauna & Showers",
    "question": "What is your overall verdict on joining this gym?",
    "options": [
      {
        "label": "Best Decision for My Physical and Mental Health! 🌟",
        "sentiment": "positive",
        "keywords": [
          "best fitness decision",
          "life changing gym"
        ]
      },
      {
        "label": "Proud to Be a Member Here Every Single Day 🏅",
        "sentiment": "positive",
        "keywords": [
          "proud gym member",
          "top rated facility"
        ]
      },
      {
        "label": "5 Stars Across Facilities, Staff & Atmosphere! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star gym experience",
          "highest recommendation"
        ]
      }
    ]
  }
]
};
