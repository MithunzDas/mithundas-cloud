import { IndustryConfig } from "./types";

export const DENTIST_POOL: IndustryConfig = {
  id: "DENTIST",
  name: "Dental Clinic / Dentist",
  icon: "🦷",
  defaultPlaceHolder: "Dr. Smith Dental Care",
  sampleReview: "Dr. Smith and his team are amazing! The clinic is spotless, zero wait time, and the cleaning was completely pain-free. Highly recommend for anyone nervous about dental work! ✨",
  questions: [
  {
    "id": "d_care_01",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "How was the doctor's gentleness and bedside manner?",
    "options": [
      {
        "label": "Super Gentle & Painless 😊",
        "sentiment": "positive",
        "keywords": [
          "gentle dentist",
          "painless treatment",
          "caring doctor"
        ]
      },
      {
        "label": "Explained Every Step Thoroughly 👨‍⚕️",
        "sentiment": "positive",
        "keywords": [
          "explained clearly",
          "informative",
          "thorough diagnosis"
        ]
      },
      {
        "label": "Calmed My Dental Anxiety 🌿",
        "sentiment": "positive",
        "keywords": [
          "reassuring",
          "calming atmosphere",
          "put me at ease"
        ]
      },
      {
        "label": "Quick, Precise & Confident ⚡",
        "sentiment": "positive",
        "keywords": [
          "efficient",
          "skilled dentist",
          "confident hands"
        ]
      }
    ]
  },
  {
    "id": "d_care_02",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "Did the dentist listen carefully to your dental concerns?",
    "options": [
      {
        "label": "Listened Patiently & Never Rushed 👂",
        "sentiment": "positive",
        "keywords": [
          "patient listener",
          "took time to hear concerns"
        ]
      },
      {
        "label": "Answered All Questions Clearly 💬",
        "sentiment": "positive",
        "keywords": [
          "clear answers",
          "honest advice"
        ]
      },
      {
        "label": "Gave Honest Options Without Pressure 🛡️",
        "sentiment": "positive",
        "keywords": [
          "no pushy treatment plans",
          "ethical practice"
        ]
      }
    ]
  },
  {
    "id": "d_care_03",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "How comfortable did you feel during local anesthesia or injections?",
    "options": [
      {
        "label": "Barely Felt a Thing! 🪶",
        "sentiment": "positive",
        "keywords": [
          "gentle injection",
          "could barely feel it"
        ]
      },
      {
        "label": "Numbed Quickly & Effectively ❄️",
        "sentiment": "positive",
        "keywords": [
          "well numbed",
          "comfortable procedure"
        ]
      },
      {
        "label": "Doctor Checked in on Me Constantly 👍",
        "sentiment": "positive",
        "keywords": [
          "checked comfort",
          "attentive care"
        ]
      }
    ]
  },
  {
    "id": "d_care_04",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "How was the doctor's approach with nervous patients or children?",
    "options": [
      {
        "label": "Fantastic with Kids / Family 🧒",
        "sentiment": "positive",
        "keywords": [
          "great pediatric dentist",
          "kids loved it"
        ]
      },
      {
        "label": "Made Me Forget My Fear 🌟",
        "sentiment": "positive",
        "keywords": [
          "cured dental phobia",
          "so patient"
        ]
      },
      {
        "label": "Very Friendly & Encouraging 😊",
        "sentiment": "positive",
        "keywords": [
          "friendly staff",
          "reassuring"
        ]
      }
    ]
  },
  {
    "id": "d_care_05",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "How would you rate the dentist's clinical skill and precision?",
    "options": [
      {
        "label": "True Master of Their Craft 💎",
        "sentiment": "positive",
        "keywords": [
          "expert dentist",
          "highly skilled specialist"
        ]
      },
      {
        "label": "Accurate Diagnosis & Fast Relief 🎯",
        "sentiment": "positive",
        "keywords": [
          "diagnosed problem quickly",
          "pinpointed issue"
        ]
      },
      {
        "label": "Modern, Up-to-Date Techniques 🔬",
        "sentiment": "positive",
        "keywords": [
          "advanced dental techniques",
          "high skill"
        ]
      }
    ]
  },
  {
    "id": "d_care_06",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "Did the dentist provide clear post-treatment guidance?",
    "options": [
      {
        "label": "Thorough Aftercare Instructions Given 📋",
        "sentiment": "positive",
        "keywords": [
          "clear aftercare",
          "helpful advice"
        ]
      },
      {
        "label": "Followed Up on Recovery Promptly 📞",
        "sentiment": "positive",
        "keywords": [
          "follow up check",
          "caring team"
        ]
      },
      {
        "label": "Easy to Understand Maintenance Tips 🦷",
        "sentiment": "positive",
        "keywords": [
          "oral hygiene advice",
          "preventive care"
        ]
      }
    ]
  },
  {
    "id": "d_care_07",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "How comfortable was the tooth restoration or filling process?",
    "options": [
      {
        "label": "Completely Pain-Free Experience ✨",
        "sentiment": "positive",
        "keywords": [
          "pain free filling",
          "smooth restoration"
        ]
      },
      {
        "label": "Bite Felt Natural Immediately 🦷",
        "sentiment": "positive",
        "keywords": [
          "perfect bite adjustment",
          "seamless filling"
        ]
      },
      {
        "label": "Quick & Stress-Free ⏱️",
        "sentiment": "positive",
        "keywords": [
          "fast dental work",
          "gentle touch"
        ]
      }
    ]
  },
  {
    "id": "d_care_08",
    "category": "doctor_care",
    "categoryLabel": "Doctor Gentleness & Care",
    "question": "Did the dentist discuss long-term preventive dental care?",
    "options": [
      {
        "label": "Proactive Preventive Advice Shared 🛡️",
        "sentiment": "positive",
        "keywords": [
          "preventive dentistry",
          "long term dental health"
        ]
      },
      {
        "label": "Helped Me Save My Natural Teeth 🌿",
        "sentiment": "positive",
        "keywords": [
          "tooth preservation",
          "honest dentist"
        ]
      },
      {
        "label": "Personalized Oral Health Roadmap 🗺️",
        "sentiment": "positive",
        "keywords": [
          "personalized dental plan",
          "comprehensive care"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_01",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the clinic's cleanliness and sterile standards?",
    "options": [
      {
        "label": "Spotless & Hospital-Grade Clean ✨",
        "sentiment": "positive",
        "keywords": [
          "immaculate hygiene",
          "spotless operatory",
          "sanitized tools"
        ]
      },
      {
        "label": "Clean, Organized & Sanitized 🧼",
        "sentiment": "positive",
        "keywords": [
          "very clean clinic",
          "neatly organized"
        ]
      },
      {
        "label": "Fresh Smell & Calming Atmosphere 🌸",
        "sentiment": "positive",
        "keywords": [
          "fresh scent",
          "peaceful dental office"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_02",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How did you find the dental technology and equipment?",
    "options": [
      {
        "label": "Ultra High-Tech (Digital X-Rays & 3D Scans) 🖥️",
        "sentiment": "positive",
        "keywords": [
          "digital 3d scans",
          "cutting edge tech",
          "instant x-rays"
        ]
      },
      {
        "label": "Super Modern & Comfortable Dental Chairs 🛋️",
        "sentiment": "positive",
        "keywords": [
          "ergonomic chairs",
          "comfortable setup"
        ]
      },
      {
        "label": "Ceiling TV / Music During Procedure 📺",
        "sentiment": "positive",
        "keywords": [
          "ceiling tv distraction",
          "relaxing music"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_03",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "Did you notice fresh, individually wrapped instruments?",
    "options": [
      {
        "label": "Unwrapped Right in Front of Me 🛡️",
        "sentiment": "positive",
        "keywords": [
          "sealed sterile instruments",
          "100% sterile"
        ]
      },
      {
        "label": "Strict Safety & Mask Protocols Followed 🧤",
        "sentiment": "positive",
        "keywords": [
          "proper ppe",
          "clean gloves and masks"
        ]
      },
      {
        "label": "Felt Completely Safe & Protected 💯",
        "sentiment": "positive",
        "keywords": [
          "hygienic environment",
          "top sanitation standards"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_04",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the waiting room environment?",
    "options": [
      {
        "label": "Boutique Lounge Feel, Very Relaxing 🌿",
        "sentiment": "positive",
        "keywords": [
          "peaceful waiting area",
          "comfortable couches"
        ]
      },
      {
        "label": "Water, Tea & Wi-Fi Available ☕",
        "sentiment": "positive",
        "keywords": [
          "refreshments",
          "welcoming waiting room"
        ]
      },
      {
        "label": "Clean, Spacious & Bright ☀️",
        "sentiment": "positive",
        "keywords": [
          "bright lighting",
          "tidy reception"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_05",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How did you like the intraoral cameras or digital imaging displays?",
    "options": [
      {
        "label": "Loved Seeing Everything on Screen 🖥️",
        "sentiment": "positive",
        "keywords": [
          "intraoral camera",
          "transparent diagnosis"
        ]
      },
      {
        "label": "Made Understanding My Teeth So Easy 💡",
        "sentiment": "positive",
        "keywords": [
          "visual explanation",
          "clear images"
        ]
      },
      {
        "label": "High-Definition Diagnostic Clarity 🔍",
        "sentiment": "positive",
        "keywords": [
          "hd digital imaging",
          "modern dental office"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_06",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How sanitized did the treatment chairs and surrounding counters feel?",
    "options": [
      {
        "label": "Fresh Barrier Tape & Disinfected Surfaces 🛡️",
        "sentiment": "positive",
        "keywords": [
          "disinfected operatory",
          "sanitary barriers"
        ]
      },
      {
        "label": "Meticulously Cleaned Between Patients 🧽",
        "sentiment": "positive",
        "keywords": [
          "clean operatory",
          "thorough wipe-down"
        ]
      },
      {
        "label": "Felt Like a 5-Star Medical Suite 🏥",
        "sentiment": "positive",
        "keywords": [
          "pristine clinic",
          "high grade hygiene"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_07",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the air freshness and ventilation in the operatory rooms?",
    "options": [
      {
        "label": "Fresh, Clean Air with HEPA Filters 🍃",
        "sentiment": "positive",
        "keywords": [
          "clean air",
          "hepa filtration"
        ]
      },
      {
        "label": "Zero Medicinal Odor, Very Pleasant 🌸",
        "sentiment": "positive",
        "keywords": [
          "pleasant scent",
          "no harsh chemical smell"
        ]
      },
      {
        "label": "Bright, Airy & Temperature Controlled ❄️",
        "sentiment": "positive",
        "keywords": [
          "comfortable room temperature",
          "airy clinic"
        ]
      }
    ]
  },
  {
    "id": "d_hyg_08",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How organized were the clinic facilities and reception desk?",
    "options": [
      {
        "label": "Seamless Paperless Check-In Tablets 📱",
        "sentiment": "positive",
        "keywords": [
          "digital check in",
          "smooth tablet registration"
        ]
      },
      {
        "label": "Orderly, Clean & Professional 📁",
        "sentiment": "positive",
        "keywords": [
          "well organized",
          "efficient reception"
        ]
      },
      {
        "label": "Prompt, Spotless Counter Space ✨",
        "sentiment": "positive",
        "keywords": [
          "spotless reception desk",
          "tidy lobby"
        ]
      }
    ]
  },
  {
    "id": "d_time_01",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "How long was your wait time in the reception area?",
    "options": [
      {
        "label": "Zero Wait Time! Seated Right Away ⚡",
        "sentiment": "positive",
        "keywords": [
          "no wait time",
          "seated immediately",
          "punctual"
        ]
      },
      {
        "label": "Less Than 5 Minutes ⏱️",
        "sentiment": "positive",
        "keywords": [
          "fast service",
          "minimal waiting"
        ]
      },
      {
        "label": "Taken Back Promptly on Schedule 📅",
        "sentiment": "positive",
        "keywords": [
          "respected my time",
          "on schedule"
        ]
      }
    ]
  },
  {
    "id": "d_time_02",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "How easy was booking or rescheduling your appointment?",
    "options": [
      {
        "label": "Super Easy Online / Phone Booking 📱",
        "sentiment": "positive",
        "keywords": [
          "easy appointment booking",
          "hassle-free scheduling"
        ]
      },
      {
        "label": "Accommodated My Busy Work Schedule 💼",
        "sentiment": "positive",
        "keywords": [
          "flexible appointment hours",
          "evening availability"
        ]
      },
      {
        "label": "Got an Urgent Same-Day Slot! 🚨",
        "sentiment": "positive",
        "keywords": [
          "emergency dental appointment",
          "same day care"
        ]
      }
    ]
  },
  {
    "id": "d_time_03",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "Did you receive helpful appointment reminders?",
    "options": [
      {
        "label": "Helpful SMS & Email Reminders 🔔",
        "sentiment": "positive",
        "keywords": [
          "convenient reminders",
          "automated text"
        ]
      },
      {
        "label": "Smooth 1-Tap Calendar Confirmation 📅",
        "sentiment": "positive",
        "keywords": [
          "easy calendar sync",
          "well organized"
        ]
      },
      {
        "label": "Friendly Confirmation Call 📞",
        "sentiment": "positive",
        "keywords": [
          "courteous phone reminder",
          "great communication"
        ]
      }
    ]
  },
  {
    "id": "d_time_04",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "How efficient was the entire appointment from start to finish?",
    "options": [
      {
        "label": "In and Out Exactly as Promised ⏱️",
        "sentiment": "positive",
        "keywords": [
          "time efficient",
          "finished on schedule"
        ]
      },
      {
        "label": "Thorough Care Without Wasting Time 🎯",
        "sentiment": "positive",
        "keywords": [
          "efficient and thorough",
          "prompt care"
        ]
      },
      {
        "label": "Perfect Lunch Break Visit 🥗",
        "sentiment": "positive",
        "keywords": [
          "quick lunch appointment",
          "convenient"
        ]
      }
    ]
  },
  {
    "id": "d_time_05",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "How fast did the front desk process your arrival and check-in?",
    "options": [
      {
        "label": "Check-In Took Under 60 Seconds ⚡",
        "sentiment": "positive",
        "keywords": [
          "instant check in",
          "super fast front desk"
        ]
      },
      {
        "label": "Warm Greeting with Zero Bureaucracy 📋",
        "sentiment": "positive",
        "keywords": [
          "seamless paperwork",
          "warm welcome"
        ]
      },
      {
        "label": "Fast & Digital Intake Forms 📱",
        "sentiment": "positive",
        "keywords": [
          "digital forms",
          "no paperwork hassle"
        ]
      }
    ]
  },
  {
    "id": "d_time_06",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "If you had an unexpected dental emergency, how quickly were you seen?",
    "options": [
      {
        "label": "Saw Me Within the Hour! 🚨",
        "sentiment": "positive",
        "keywords": [
          "emergency dental relief",
          "seen right away"
        ]
      },
      {
        "label": "Immediate Pain Relief Provided 💊",
        "sentiment": "positive",
        "keywords": [
          "fast tooth pain relief",
          "emergency dental care"
        ]
      },
      {
        "label": "Squeezed Me In With Zero Complaints 👍",
        "sentiment": "positive",
        "keywords": [
          "accommodating clinic",
          "lifesaver"
        ]
      }
    ]
  },
  {
    "id": "d_time_07",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "Did the doctor spend sufficient dedicated time with you?",
    "options": [
      {
        "label": "Dedicated 1-on-1 Focus, Never Rushed ⏳",
        "sentiment": "positive",
        "keywords": [
          "generous consultation time",
          "thorough attention"
        ]
      },
      {
        "label": "Checked Every Detail Thoroughly 🔬",
        "sentiment": "positive",
        "keywords": [
          "comprehensive examination",
          "dedicated dentist"
        ]
      },
      {
        "label": "Felt Like the Only Patient in the Office 🌟",
        "sentiment": "positive",
        "keywords": [
          "vip patient care",
          "attentive service"
        ]
      }
    ]
  },
  {
    "id": "d_time_08",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Punctuality",
    "question": "How convenient were the clinic's operating hours for your schedule?",
    "options": [
      {
        "label": "Great Early Morning / Evening Slots 🌅",
        "sentiment": "positive",
        "keywords": [
          "convenient hours",
          "early dental appointments"
        ]
      },
      {
        "label": "Weekend Appointment Availability 🗓️",
        "sentiment": "positive",
        "keywords": [
          "saturday dental clinic",
          "weekend slots"
        ]
      },
      {
        "label": "Easy to Book Around Work Hours 👔",
        "sentiment": "positive",
        "keywords": [
          "flexible clinic hours",
          "convenient scheduling"
        ]
      }
    ]
  },
  {
    "id": "d_res_01",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "How do your teeth look and feel after your cleaning or procedure?",
    "options": [
      {
        "label": "Teeth Feel Silky Smooth & Sparkling Clean ✨",
        "sentiment": "positive",
        "keywords": [
          "thorough dental cleaning",
          "smooth teeth",
          "sparkling smile"
        ]
      },
      {
        "label": "Immediate Pain Relief! So Thankful 🙏",
        "sentiment": "positive",
        "keywords": [
          "relieved toothache",
          "pain relief",
          "gentle extraction"
        ]
      },
      {
        "label": "Natural-Looking Filling / Crown Match 💎",
        "sentiment": "positive",
        "keywords": [
          "seamless crown",
          "aesthetic filling",
          "invisible repair"
        ]
      },
      {
        "label": "Noticeably Whiter & Brighter Smile 🌟",
        "sentiment": "positive",
        "keywords": [
          "teeth whitening",
          "brighter smile",
          "confident smile"
        ]
      }
    ]
  },
  {
    "id": "d_res_02",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "How was the thoroughness of the dental hygienist?",
    "options": [
      {
        "label": "Most Thorough Cleaning I've Ever Had 🏆",
        "sentiment": "positive",
        "keywords": [
          "best dental hygienist",
          "gentle deep cleaning",
          "plaque removal"
        ]
      },
      {
        "label": "Gentle Hands & No Bleeding or Soreness 🪶",
        "sentiment": "positive",
        "keywords": [
          "gentle scaler",
          "comfortable clean"
        ]
      },
      {
        "label": "Polished Away Tough Coffee / Tea Stains ☕",
        "sentiment": "positive",
        "keywords": [
          "stain removal",
          "polished teeth"
        ]
      }
    ]
  },
  {
    "id": "d_res_03",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "How did you feel about the pricing and insurance transparency?",
    "options": [
      {
        "label": "Clear Upfront Costs with Zero Surprises 💵",
        "sentiment": "positive",
        "keywords": [
          "transparent dental pricing",
          "no hidden fees",
          "affordable dentist"
        ]
      },
      {
        "label": "Maximized My Insurance Coverage 🛡️",
        "sentiment": "positive",
        "keywords": [
          "handled insurance claim",
          "in-network benefits"
        ]
      },
      {
        "label": "Great Value for the High Level of Care 💎",
        "sentiment": "positive",
        "keywords": [
          "worth every dollar",
          "fair prices"
        ]
      }
    ]
  },
  {
    "id": "d_res_04",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "Would you recommend this dental clinic to family and friends?",
    "options": [
      {
        "label": "100% Yes! Found My Forever Dentist 🌟",
        "sentiment": "positive",
        "keywords": [
          "best dentist in town",
          "highly recommend",
          "family dentist"
        ]
      },
      {
        "label": "Already Told My Coworkers About Them 👍",
        "sentiment": "positive",
        "keywords": [
          "recommended to friends",
          "trusted dental clinic"
        ]
      },
      {
        "label": "Bringing My Whole Family Here 👨‍👩‍👧‍👦",
        "sentiment": "positive",
        "keywords": [
          "great for the whole family",
          "5-star dental practice"
        ]
      }
    ]
  },
  {
    "id": "d_res_05",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "How satisfied are you with cosmetic work (veneers, whitening, alignment)?",
    "options": [
      {
        "label": "Gave Me the Smile of My Dreams! 😁",
        "sentiment": "positive",
        "keywords": [
          "smile makeover",
          "cosmetic dentistry excellence"
        ]
      },
      {
        "label": "Incredible Natural Look & Feel 💎",
        "sentiment": "positive",
        "keywords": [
          "natural looking veneers",
          "perfect shade match"
        ]
      },
      {
        "label": "Boosted My Daily Confidence 10x 🌟",
        "sentiment": "positive",
        "keywords": [
          "confident smile",
          "flawless dental work"
        ]
      }
    ]
  },
  {
    "id": "d_res_06",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "How was the recovery after your dental treatment or extraction?",
    "options": [
      {
        "label": "Healed Super Fast with Zero Complications 🌿",
        "sentiment": "positive",
        "keywords": [
          "fast healing",
          "smooth recovery"
        ]
      },
      {
        "label": "Virtually No Post-Op Discomfort 💊",
        "sentiment": "positive",
        "keywords": [
          "minimal swelling",
          "painless recovery"
        ]
      },
      {
        "label": "Clear Recovery Kit & Instructions Provided 📦",
        "sentiment": "positive",
        "keywords": [
          "helpful recovery guidance",
          "thoughtful dentist"
        ]
      }
    ]
  },
  {
    "id": "d_res_07",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "How did the dental crown, bridge or implant fitting feel?",
    "options": [
      {
        "label": "Fits Like My Own Natural Tooth 🦷",
        "sentiment": "positive",
        "keywords": [
          "perfect implant fit",
          "ideal dental crown"
        ]
      },
      {
        "label": "Zero Discomfort When Chewing Food 🍽️",
        "sentiment": "positive",
        "keywords": [
          "chews perfectly",
          "strong bite"
        ]
      },
      {
        "label": "Flawless Craftsmanship & Color 💎",
        "sentiment": "positive",
        "keywords": [
          "high quality dental lab",
          "exquisite crown"
        ]
      }
    ]
  },
  {
    "id": "d_res_08",
    "category": "results_value",
    "categoryLabel": "Treatment Results & Value",
    "question": "Overall, how would you summarize your dental visit experience?",
    "options": [
      {
        "label": "Best Dental Experience of My Life 🏆",
        "sentiment": "positive",
        "keywords": [
          "outstanding dental care",
          "top notch practice"
        ]
      },
      {
        "label": "Completely Changed My View of Dentistry ✨",
        "sentiment": "positive",
        "keywords": [
          "no more dental fear",
          "welcoming clinic"
        ]
      },
      {
        "label": "5 Stars Across Every Metric! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star dentist",
          "exceptional service"
        ]
      }
    ]
  },
  {
    "id": "d_stf_01",
    "category": "staff_courtesy",
    "categoryLabel": "Staff Courtesy & Support",
    "question": "How warm was the reception greeting when you arrived?",
    "options": [
      {
        "label": "Greeted Warmly by Name with Big Smiles 😊",
        "sentiment": "positive",
        "keywords": [
          "welcoming receptionist",
          "friendly dental staff"
        ]
      },
      {
        "label": "Felt Like a Valued Guest Right Away 🌟",
        "sentiment": "positive",
        "keywords": [
          "courteous front desk",
          "polite reception"
        ]
      },
      {
        "label": "Extremely Helpful & Courteous 🤝",
        "sentiment": "positive",
        "keywords": [
          "helpful staff",
          "attentive customer service"
        ]
      }
    ]
  },
  {
    "id": "d_stf_02",
    "category": "staff_courtesy",
    "categoryLabel": "Staff Courtesy & Support",
    "question": "How was the dental assistant during your procedure?",
    "options": [
      {
        "label": "Super Attentive & Anticipated Every Need 👍",
        "sentiment": "positive",
        "keywords": [
          "caring dental assistant",
          "smooth teamwork"
        ]
      },
      {
        "label": "Comforting & Held Good Conversation 💬",
        "sentiment": "positive",
        "keywords": [
          "reassuring assistant",
          "friendly demeanor"
        ]
      },
      {
        "label": "Gentle Suction & Kept Me Completely Dry 🧽",
        "sentiment": "positive",
        "keywords": [
          "skilled dental assistant",
          "comfortable treatment"
        ]
      }
    ]
  },
  {
    "id": "d_stf_03",
    "category": "staff_courtesy",
    "categoryLabel": "Staff Courtesy & Support",
    "question": "How helpful was the front desk staff with paperwork or scheduling?",
    "options": [
      {
        "label": "Processed Everything Without Any Hassle 📄",
        "sentiment": "positive",
        "keywords": [
          "efficient paperwork",
          "easy administrative process"
        ]
      },
      {
        "label": "Patiently Answered All My Questions 💬",
        "sentiment": "positive",
        "keywords": [
          "patient front office",
          "clear answers"
        ]
      },
      {
        "label": "Super Organized & Professional 📁",
        "sentiment": "positive",
        "keywords": [
          "organized clinic team",
          "professional desk"
        ]
      }
    ]
  },
  {
    "id": "d_stf_04",
    "category": "staff_courtesy",
    "categoryLabel": "Staff Courtesy & Support",
    "question": "Did the team create a calm and reassuring atmosphere?",
    "options": [
      {
        "label": "Total Zen & Stress-Free Environment 🌿",
        "sentiment": "positive",
        "keywords": [
          "calming dental office",
          "stress free visit"
        ]
      },
      {
        "label": "Friendly Vibes from Everyone on Staff 🌸",
        "sentiment": "positive",
        "keywords": [
          "warm team",
          "delightful clinic atmosphere"
        ]
      },
      {
        "label": "Made Going to the Dentist Enjoyable! 🎉",
        "sentiment": "positive",
        "keywords": [
          "pleasant dental visit",
          "great team culture"
        ]
      }
    ]
  },
  {
    "id": "d_bil_01",
    "category": "billing_clarity",
    "categoryLabel": "Pricing & Insurance Clarity",
    "question": "Was the treatment plan and pricing explained before starting?",
    "options": [
      {
        "label": "Full Itemized Breakdown Given Upfront 📋",
        "sentiment": "positive",
        "keywords": [
          "upfront dental pricing",
          "itemized quote"
        ]
      },
      {
        "label": "No Surprise Fees or Hidden Costs 🛡️",
        "sentiment": "positive",
        "keywords": [
          "no hidden fees",
          "honest dental billing"
        ]
      },
      {
        "label": "Clear Options Given for Every Budget 💵",
        "sentiment": "positive",
        "keywords": [
          "budget friendly options",
          "clear pricing"
        ]
      }
    ]
  },
  {
    "id": "d_bil_02",
    "category": "billing_clarity",
    "categoryLabel": "Pricing & Insurance Clarity",
    "question": "How helpful was the staff in checking your dental insurance coverage?",
    "options": [
      {
        "label": "Verified Coverage Before My Visit 🔍",
        "sentiment": "positive",
        "keywords": [
          "pre-verified insurance",
          "smooth benefits check"
        ]
      },
      {
        "label": "Handled Claims Directly with Insurer 🛡️",
        "sentiment": "positive",
        "keywords": [
          "handled insurance claim",
          "hassle-free claims"
        ]
      },
      {
        "label": "Maximized My In-Network Benefits 💰",
        "sentiment": "positive",
        "keywords": [
          "in-network savings",
          "affordable copay"
        ]
      }
    ]
  },
  {
    "id": "d_bil_03",
    "category": "billing_clarity",
    "categoryLabel": "Pricing & Insurance Clarity",
    "question": "Were flexible payment plans or financing options made available?",
    "options": [
      {
        "label": "Convenient Monthly Payment Options 💳",
        "sentiment": "positive",
        "keywords": [
          "flexible dental financing",
          "monthly payments"
        ]
      },
      {
        "label": "Affordable In-House Membership Plan 🏥",
        "sentiment": "positive",
        "keywords": [
          "in house dental plan",
          "uninsured discount"
        ]
      },
      {
        "label": "Transparent & Fair Out-of-Pocket Costs ⚖️",
        "sentiment": "positive",
        "keywords": [
          "fair out of pocket costs",
          "honest pricing"
        ]
      }
    ]
  },
  {
    "id": "d_bil_04",
    "category": "billing_clarity",
    "categoryLabel": "Pricing & Insurance Clarity",
    "question": "How was the final checkout and receipt process?",
    "options": [
      {
        "label": "Fast, Contactless Checkout in Seconds ⚡",
        "sentiment": "positive",
        "keywords": [
          "quick checkout",
          "digital receipt"
        ]
      },
      {
        "label": "Detailed Receipt Sent to My Email 📧",
        "sentiment": "positive",
        "keywords": [
          "clear invoice",
          "emailed receipt"
        ]
      },
      {
        "label": "Polite & Professional Goodbye 👋",
        "sentiment": "positive",
        "keywords": [
          "courteous checkout",
          "warm departure"
        ]
      }
    ]
  }
]
};
