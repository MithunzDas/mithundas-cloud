import { IndustryConfig } from "./types";

export const DOCTOR_POOL: IndustryConfig = {
  id: "DOCTOR_CLINIC",
  name: "Medical Clinic / Doctor / Specialist",
  icon: "🩺",
  defaultPlaceHolder: "Dr. Roberts Medical Center",
  sampleReview: "Dr. Roberts is a phenomenal physician! He listened to my symptoms without rushing, diagnosed the root cause, and the treatment worked wonders. Clean clinic and lovely staff. ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "doc_care_01",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "Did the doctor take time to listen to your health concerns?",
    "options": [
      {
        "label": "Listened Patiently & Never Rushed 👂",
        "sentiment": "positive",
        "keywords": [
          "patient doctor",
          "great listener",
          "compassionate physician"
        ]
      },
      {
        "label": "Addressed Every Symptom Thoroughly 🩺",
        "sentiment": "positive",
        "keywords": [
          "thorough consultation",
          "detailed checkup"
        ]
      },
      {
        "label": "Made Me Feel Truly Heard & Valued ❤️",
        "sentiment": "positive",
        "keywords": [
          "caring doctor",
          "empathetic care"
        ]
      },
      {
        "label": "Reassuring & Calmed My Worries 🌿",
        "sentiment": "positive",
        "keywords": [
          "reassuring bedside manner",
          "peace of mind"
        ]
      }
    ]
  },
  {
    "id": "doc_care_02",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "How would you rate the doctor's bedside manner?",
    "options": [
      {
        "label": "Warm, Kind & Highly Professional 😊",
        "sentiment": "positive",
        "keywords": [
          "warm doctor",
          "professional bedside manner"
        ]
      },
      {
        "label": "Empathetic & Treated Me with Dignity 🤝",
        "sentiment": "positive",
        "keywords": [
          "respectful care",
          "dignified medical care"
        ]
      },
      {
        "label": "Very Approachable & Easy to Talk To 💬",
        "sentiment": "positive",
        "keywords": [
          "approachable doctor",
          "easy communication"
        ]
      }
    ]
  },
  {
    "id": "doc_care_03",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "Did the physician explain your medical condition clearly?",
    "options": [
      {
        "label": "Explained in Simple, Plain English 💡",
        "sentiment": "positive",
        "keywords": [
          "explained clearly",
          "no medical jargon"
        ]
      },
      {
        "label": "Used Helpful Diagrams & Examples 📊",
        "sentiment": "positive",
        "keywords": [
          "clear visual explanation",
          "educational doctor"
        ]
      },
      {
        "label": "Answered Every Question with Patience ❓",
        "sentiment": "positive",
        "keywords": [
          "answered all questions",
          "patient physician"
        ]
      }
    ]
  },
  {
    "id": "doc_care_04",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "How comfortable did you feel during physical examinations?",
    "options": [
      {
        "label": "Very Gentle, Respectful & Modest 🛡️",
        "sentiment": "positive",
        "keywords": [
          "gentle examination",
          "respectful physical check"
        ]
      },
      {
        "label": "Explained What They Were Doing First 🗣️",
        "sentiment": "positive",
        "keywords": [
          "explained exam steps",
          "comfort first"
        ]
      },
      {
        "label": "Professional Chaperone & Clean Setup 🏥",
        "sentiment": "positive",
        "keywords": [
          "professional clinical standard",
          "comfortable exam"
        ]
      }
    ]
  },
  {
    "id": "doc_care_05",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "How would you describe the doctor's clinical knowledge and expertise?",
    "options": [
      {
        "label": "World-Class Specialist Knowledge 🎓",
        "sentiment": "positive",
        "keywords": [
          "top medical specialist",
          "expert physician"
        ]
      },
      {
        "label": "Accurate Diagnosis & Rapid Relief 🎯",
        "sentiment": "positive",
        "keywords": [
          "accurate medical diagnosis",
          "effective remedy"
        ]
      },
      {
        "label": "Modern, Up-to-Date Medical Science 🔬",
        "sentiment": "positive",
        "keywords": [
          "evidence based medicine",
          "current clinical guidelines"
        ]
      }
    ]
  },
  {
    "id": "doc_care_06",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "Did the doctor discuss preventive health and lifestyle factors?",
    "options": [
      {
        "label": "Practical Wellness & Nutrition Advice 🥗",
        "sentiment": "positive",
        "keywords": [
          "preventive medicine",
          "healthy lifestyle tips"
        ]
      },
      {
        "label": "Holistic Health Approach 🌿",
        "sentiment": "positive",
        "keywords": [
          "holistic doctor",
          "long term wellness"
        ]
      },
      {
        "label": "Helped Me Form Realistic Health Goals 🎯",
        "sentiment": "positive",
        "keywords": [
          "attainable health goals",
          "supportive doctor"
        ]
      }
    ]
  },
  {
    "id": "doc_care_07",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "How was the physician's attentiveness to your medical history?",
    "options": [
      {
        "label": "Reviewed Past Medical Records Thoroughly 📁",
        "sentiment": "positive",
        "keywords": [
          "thorough medical history review",
          "detail oriented doctor"
        ]
      },
      {
        "label": "Connected the Dots Between Symptoms 🔍",
        "sentiment": "positive",
        "keywords": [
          "comprehensive diagnosis",
          "astute physician"
        ]
      },
      {
        "label": "Checked All Medication Interactions 💊",
        "sentiment": "positive",
        "keywords": [
          "medication safety check",
          "careful prescribing"
        ]
      }
    ]
  },
  {
    "id": "doc_care_08",
    "category": "physician_care",
    "categoryLabel": "Doctor Empathy & Listening",
    "question": "Would you trust this doctor with your family's healthcare?",
    "options": [
      {
        "label": "Already Recommended to My Entire Family 👨‍👩‍👧‍👦",
        "sentiment": "positive",
        "keywords": [
          "trusted family physician",
          "best doctor in town"
        ]
      },
      {
        "label": "Found My Primary Healthcare Provider! 🌟",
        "sentiment": "positive",
        "keywords": [
          "great primary care doctor",
          "lifelong physician"
        ]
      },
      {
        "label": "Highest Possible Recommendation 🏆",
        "sentiment": "positive",
        "keywords": [
          "highly recommend this clinic",
          "5-star medical care"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_01",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "How satisfied were you with the treatment plan provided?",
    "options": [
      {
        "label": "Clear Step-by-Step Recovery Roadmap 🗺️",
        "sentiment": "positive",
        "keywords": [
          "clear treatment roadmap",
          "actionable care plan"
        ]
      },
      {
        "label": "Prescribed Medications Worked Wonders 💊",
        "sentiment": "positive",
        "keywords": [
          "effective prescription",
          "rapid relief"
        ]
      },
      {
        "label": "Conservative & Ethical (No Unneeded Tests) 🛡️",
        "sentiment": "positive",
        "keywords": [
          "ethical doctor",
          "no unnecessary procedures"
        ]
      },
      {
        "label": "Symptoms Improved Within Days 📈",
        "sentiment": "positive",
        "keywords": [
          "fast recovery",
          "symptom improvement"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_02",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "Did the doctor order appropriate diagnostic tests?",
    "options": [
      {
        "label": "Only Necessary, Targeted Lab Tests 🧪",
        "sentiment": "positive",
        "keywords": [
          "targeted bloodwork",
          "precise diagnostic tests"
        ]
      },
      {
        "label": "Fast In-Clinic ECG / Vitals Screening ⚡",
        "sentiment": "positive",
        "keywords": [
          "prompt diagnostic tests",
          "immediate screening"
        ]
      },
      {
        "label": "Thorough Diagnostic Investigation 🔍",
        "sentiment": "positive",
        "keywords": [
          "complete medical evaluation",
          "pinpointed root cause"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_03",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "How clearly were medication dosages and instructions explained?",
    "options": [
      {
        "label": "Written Schedule with Clear Dosage Times 📋",
        "sentiment": "positive",
        "keywords": [
          "clear medication schedule",
          "written prescription guide"
        ]
      },
      {
        "label": "Warned About Potential Side Effects 🛡️",
        "sentiment": "positive",
        "keywords": [
          "safe prescribing",
          "side effects explained"
        ]
      },
      {
        "label": "Sent Directly to My Preferred Pharmacy 📲",
        "sentiment": "positive",
        "keywords": [
          "e-prescribing",
          "convenient pharmacy pickup"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_04",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "Did the doctor explain the root cause behind your symptoms?",
    "options": [
      {
        "label": "Pinpointed the Underlying Cause Immediately 🎯",
        "sentiment": "positive",
        "keywords": [
          "found root cause",
          "insightful diagnosis"
        ]
      },
      {
        "label": "Helped Me Understand My Body Better 🧠",
        "sentiment": "positive",
        "keywords": [
          "patient education",
          "understood condition"
        ]
      },
      {
        "label": "Reassured Me with Clear Medical Evidence 🔬",
        "sentiment": "positive",
        "keywords": [
          "evidence based diagnosis",
          "reassuring explanation"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_05",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "How proactive was the doctor regarding specialist referrals?",
    "options": [
      {
        "label": "Arranged Fast Specialist Coordination 🤝",
        "sentiment": "positive",
        "keywords": [
          "seamless specialist referral",
          "well connected doctor"
        ]
      },
      {
        "label": "Comprehensive In-Clinic Specialist Care 🏥",
        "sentiment": "positive",
        "keywords": [
          "multispecialty clinic",
          "complete care under one roof"
        ]
      },
      {
        "label": "Followed Up on External Test Results 📑",
        "sentiment": "positive",
        "keywords": [
          "diligent follow up",
          "tracked test results"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_06",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "Were non-medication remedies (diet, sleep, therapy) discussed?",
    "options": [
      {
        "label": "Great Practical Lifestyle Changes Suggested 🌿",
        "sentiment": "positive",
        "keywords": [
          "lifestyle medicine",
          "natural wellness advice"
        ]
      },
      {
        "label": "Balanced Prescription with Physical Therapy 🏋️",
        "sentiment": "positive",
        "keywords": [
          "rehabilitation guidance",
          "balanced treatment"
        ]
      },
      {
        "label": "Provided Informative Patient Handouts 📄",
        "sentiment": "positive",
        "keywords": [
          "helpful reading material",
          "well informed patient"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_07",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "How confident did you feel leaving the clinic?",
    "options": [
      {
        "label": "100% Confident in My Healing Journey 🌟",
        "sentiment": "positive",
        "keywords": [
          "confident in treatment",
          "peace of mind"
        ]
      },
      {
        "label": "Knew Exactly What to Expect in Recovery 📈",
        "sentiment": "positive",
        "keywords": [
          "clear recovery expectations",
          "well guided"
        ]
      },
      {
        "label": "Relieved to Have a Caring Medical Partner 🤝",
        "sentiment": "positive",
        "keywords": [
          "caring doctor",
          "reassuring visit"
        ]
      }
    ]
  },
  {
    "id": "doc_diag_08",
    "category": "diagnostic_accuracy",
    "categoryLabel": "Diagnosis & Treatment Plans",
    "question": "How fast did you notice an improvement in your symptoms?",
    "options": [
      {
        "label": "Noticeable Relief Within 24-48 Hours ⏱️",
        "sentiment": "positive",
        "keywords": [
          "fast acting relief",
          "quick recovery"
        ]
      },
      {
        "label": "Steady, Predictable Healing Progression 🌿",
        "sentiment": "positive",
        "keywords": [
          "steady improvement",
          "effective remedy"
        ]
      },
      {
        "label": "Pain and Discomfort Subsided Rapidly 💊",
        "sentiment": "positive",
        "keywords": [
          "effective pain relief",
          "healed quickly"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_01",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the cleanliness of the consultation and exam rooms?",
    "options": [
      {
        "label": "Immaculate & Hospital-Grade Clean ✨",
        "sentiment": "positive",
        "keywords": [
          "spotless medical clinic",
          "sanitized exam room"
        ]
      },
      {
        "label": "Fresh Paper on Examination Bed 🛏️",
        "sentiment": "positive",
        "keywords": [
          "fresh paper roll",
          "clean examination table"
        ]
      },
      {
        "label": "Sanitized Equipment & Fresh Gloves 🧤",
        "sentiment": "positive",
        "keywords": [
          "sterile instruments",
          "hygienic practice"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_02",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How did you find the modern clinic technology and equipment?",
    "options": [
      {
        "label": "Modern Digital Vitals & Diagnostic Tools 🖥️",
        "sentiment": "positive",
        "keywords": [
          "digital vitals monitors",
          "modern medical equipment"
        ]
      },
      {
        "label": "Instant Digital Prescriptions to Phone 📱",
        "sentiment": "positive",
        "keywords": [
          "digital prescription",
          "paperless clinic"
        ]
      },
      {
        "label": "High-Tech Diagnostics on Premises 🔬",
        "sentiment": "positive",
        "keywords": [
          "on-site diagnostics",
          "advanced clinic tech"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_03",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the waiting room environment and air quality?",
    "options": [
      {
        "label": "Spacious, Peaceful & Well-Ventilated 🍃",
        "sentiment": "positive",
        "keywords": [
          "clean air",
          "spacious waiting area"
        ]
      },
      {
        "label": "Comfortable Seating with Distance 🛋️",
        "sentiment": "positive",
        "keywords": [
          "comfortable seating",
          "safe distance"
        ]
      },
      {
        "label": "Spotless Restrooms and Hand Sanitizers 🧴",
        "sentiment": "positive",
        "keywords": [
          "clean restrooms",
          "hand sanitizer stations"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_04",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How safe did you feel regarding infection control protocols?",
    "options": [
      {
        "label": "Felt 100% Safe & Protected 🛡️",
        "sentiment": "positive",
        "keywords": [
          "top infection control",
          "safe clinical environment"
        ]
      },
      {
        "label": "Staff Strictly Adhered to PPE & Sanitation 🧤",
        "sentiment": "positive",
        "keywords": [
          "proper ppe",
          "clean medical staff"
        ]
      },
      {
        "label": "Regular Surface Disinfection Visible 🧽",
        "sentiment": "positive",
        "keywords": [
          "disinfected surfaces",
          "clean medical office"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_05",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How accessible and comfortable was the clinic entrance and layout?",
    "options": [
      {
        "label": "Wheelchair & Stroller Accessible ♿",
        "sentiment": "positive",
        "keywords": [
          "wheelchair accessible clinic",
          "step free entry"
        ]
      },
      {
        "label": "Wide Corridors & Clear Signage 🚪",
        "sentiment": "positive",
        "keywords": [
          "clear signage",
          "spacious clinic layout"
        ]
      },
      {
        "label": "Convenient Ground Floor / Elevator Access 🛗",
        "sentiment": "positive",
        "keywords": [
          "easy elevator access",
          "convenient clinic location"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_06",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How clean and organized was the sample collection or lab area?",
    "options": [
      {
        "label": "Spotless Phlebotomy Station 🩸",
        "sentiment": "positive",
        "keywords": [
          "clean blood draw area",
          "sterile phlebotomy"
        ]
      },
      {
        "label": "Individually Sealed Needles & Tubes 🧪",
        "sentiment": "positive",
        "keywords": [
          "sealed sterile needles",
          "professional lab setup"
        ]
      },
      {
        "label": "Comfortable Armchair for Blood Draw 🪑",
        "sentiment": "positive",
        "keywords": [
          "comfortable blood draw chair",
          "painless phlebotomy"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_07",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the noise level and ambiance in the consultation room?",
    "options": [
      {
        "label": "Quiet, Confidential & Private 🤫",
        "sentiment": "positive",
        "keywords": [
          "soundproof consultation",
          "patient privacy"
        ]
      },
      {
        "label": "Calming Music & Gentle Lighting 💡",
        "sentiment": "positive",
        "keywords": [
          "relaxing medical office",
          "calming atmosphere"
        ]
      },
      {
        "label": "Felt Like an Upscale Private Practice 🏛️",
        "sentiment": "positive",
        "keywords": [
          "premium medical clinic",
          "upscale facility"
        ]
      }
    ]
  },
  {
    "id": "doc_hyg_08",
    "category": "clinic_hygiene",
    "categoryLabel": "Clinic Hygiene & Modern Setup",
    "question": "How was the clinic's overall maintenance and cleanliness rating?",
    "options": [
      {
        "label": "5 Stars for Cleanliness & Sanitation ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "cleanest medical clinic",
          "spotless facility"
        ]
      },
      {
        "label": "Fresh Fragrance with Zero Stale Smell 🌸",
        "sentiment": "positive",
        "keywords": [
          "fresh smelling clinic",
          "clean environment"
        ]
      },
      {
        "label": "Impeccable Standards Across the Board 🧼",
        "sentiment": "positive",
        "keywords": [
          "high sanitation standards",
          "pristine clinic"
        ]
      }
    ]
  },
  {
    "id": "doc_time_01",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "How was the punctuality of your appointment time?",
    "options": [
      {
        "label": "Seen Promptly Right on Time! ⚡",
        "sentiment": "positive",
        "keywords": [
          "punctual doctor",
          "no wait time",
          "on schedule"
        ]
      },
      {
        "label": "Less Than 5-10 Minutes Wait ⏱️",
        "sentiment": "positive",
        "keywords": [
          "minimal waiting",
          "prompt consultation"
        ]
      },
      {
        "label": "Efficient Queue Management 📋",
        "sentiment": "positive",
        "keywords": [
          "organized clinic queue",
          "fast doctor consultation"
        ]
      }
    ]
  },
  {
    "id": "doc_time_02",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "How easy was booking your medical appointment?",
    "options": [
      {
        "label": "Seamless Online / WhatsApp Booking 📱",
        "sentiment": "positive",
        "keywords": [
          "easy appointment booking",
          "online doctor appointment"
        ]
      },
      {
        "label": "Friendly Receptionist Handled Call Quickly 📞",
        "sentiment": "positive",
        "keywords": [
          "helpful phone booking",
          "quick scheduling"
        ]
      },
      {
        "label": "Accommodated Urgent Same-Day Request 🚨",
        "sentiment": "positive",
        "keywords": [
          "same day appointment",
          "urgent doctor visit"
        ]
      }
    ]
  },
  {
    "id": "doc_time_03",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "Did you receive timely appointment reminders?",
    "options": [
      {
        "label": "Helpful SMS Reminder with Directions 📍",
        "sentiment": "positive",
        "keywords": [
          "sms appointment reminder",
          "clear clinic directions"
        ]
      },
      {
        "label": "Convenient Calendar Sync 📅",
        "sentiment": "positive",
        "keywords": [
          "calendar confirmation",
          "well organized office"
        ]
      },
      {
        "label": "Prompt Confirmation Call 📞",
        "sentiment": "positive",
        "keywords": [
          "polite confirmation call",
          "great communication"
        ]
      }
    ]
  },
  {
    "id": "doc_time_04",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "How was the check-in speed at the reception counter?",
    "options": [
      {
        "label": "Completed Registration in 60 Seconds ⚡",
        "sentiment": "positive",
        "keywords": [
          "speedy check-in",
          "fast medical reception"
        ]
      },
      {
        "label": "Digital Tablet Intake Forms 📱",
        "sentiment": "positive",
        "keywords": [
          "paperless registration",
          "digital medical intake"
        ]
      },
      {
        "label": "Zero Line at the Reception Desk 👍",
        "sentiment": "positive",
        "keywords": [
          "no reception lines",
          "efficient front desk"
        ]
      }
    ]
  },
  {
    "id": "doc_time_05",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "If you had an acute medical issue, how fast was triage and care?",
    "options": [
      {
        "label": "Evaluated Immediately by Nursing Staff 🩺",
        "sentiment": "positive",
        "keywords": [
          "rapid triage",
          "immediate nurse evaluation"
        ]
      },
      {
        "label": "Fast-Tracked to the Doctor 🚨",
        "sentiment": "positive",
        "keywords": [
          "fast tracked care",
          "priority acute attention"
        ]
      },
      {
        "label": "Prompt Medication Administered on the Spot 💊",
        "sentiment": "positive",
        "keywords": [
          "rapid relief on site",
          "caring medical team"
        ]
      }
    ]
  },
  {
    "id": "doc_time_06",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "Did the doctor spend sufficient dedicated consultation time?",
    "options": [
      {
        "label": "Unrushed, Thorough 1-on-1 Time ⏳",
        "sentiment": "positive",
        "keywords": [
          "generous consultation time",
          "unrushed doctor"
        ]
      },
      {
        "label": "Gave 100% Undivided Attention 🎯",
        "sentiment": "positive",
        "keywords": [
          "undivided attention",
          "attentive physician"
        ]
      },
      {
        "label": "Never Felt Pressured to Wrap Up 💬",
        "sentiment": "positive",
        "keywords": [
          "patient discussion",
          "dedicated medical care"
        ]
      }
    ]
  },
  {
    "id": "doc_time_07",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "How convenient were the clinic's operating days and hours?",
    "options": [
      {
        "label": "Convenient Morning & Evening Slots 🌅",
        "sentiment": "positive",
        "keywords": [
          "convenient clinic hours",
          "evening appointments"
        ]
      },
      {
        "label": "Weekend Clinic Availability 🗓️",
        "sentiment": "positive",
        "keywords": [
          "saturday doctor clinic",
          "weekend medical care"
        ]
      },
      {
        "label": "Perfect for Busy Work Schedules 👔",
        "sentiment": "positive",
        "keywords": [
          "flexible appointment slots",
          "easy scheduling"
        ]
      }
    ]
  },
  {
    "id": "doc_time_08",
    "category": "wait_time",
    "categoryLabel": "Wait Time & Scheduling",
    "question": "How fast did you receive test results or follow-up notes?",
    "options": [
      {
        "label": "Digital Lab Reports Uploaded Same Day 📲",
        "sentiment": "positive",
        "keywords": [
          "same day lab results",
          "fast digital reports"
        ]
      },
      {
        "label": "Doctor Called Personally with Results 📞",
        "sentiment": "positive",
        "keywords": [
          "doctor called with results",
          "personal care"
        ]
      },
      {
        "label": "Fast Portal Notification 🔔",
        "sentiment": "positive",
        "keywords": [
          "quick patient portal update",
          "prompt communication"
        ]
      }
    ]
  },
  {
    "id": "doc_stf_01",
    "category": "nursing_staff",
    "categoryLabel": "Nursing Staff & Reception Care",
    "question": "How was the courtesy and compassion of the nursing team?",
    "options": [
      {
        "label": "Gentle, Caring & Comforting Nurses ❤️",
        "sentiment": "positive",
        "keywords": [
          "compassionate nursing team",
          "gentle nurse"
        ]
      },
      {
        "label": "Pain-Free Vitals & Blood Draw 🪶",
        "sentiment": "positive",
        "keywords": [
          "painless blood draw",
          "skilled phlebotomist"
        ]
      },
      {
        "label": "Attentive to Comfort and Well-Being 👍",
        "sentiment": "positive",
        "keywords": [
          "attentive nurse",
          "great bedside manner"
        ]
      }
    ]
  },
  {
    "id": "doc_stf_02",
    "category": "nursing_staff",
    "categoryLabel": "Nursing Staff & Reception Care",
    "question": "How warm was the reception team when you arrived?",
    "options": [
      {
        "label": "Greeted Warmly with Friendly Smiles 😊",
        "sentiment": "positive",
        "keywords": [
          "friendly reception",
          "courteous clinic staff"
        ]
      },
      {
        "label": "Helpful, Polite & Extremely Professional 🤝",
        "sentiment": "positive",
        "keywords": [
          "helpful front desk",
          "professional medical staff"
        ]
      },
      {
        "label": "Made Check-In and Billing Totally Effortless 📋",
        "sentiment": "positive",
        "keywords": [
          "smooth check-in",
          "efficient staff"
        ]
      }
    ]
  },
  {
    "id": "doc_stf_03",
    "category": "nursing_staff",
    "categoryLabel": "Nursing Staff & Reception Care",
    "question": "How well did the clinic staff handle your privacy and confidentiality?",
    "options": [
      {
        "label": "Strict Patient Privacy & Discretion Upheld 🛡️",
        "sentiment": "positive",
        "keywords": [
          "discreet medical clinic",
          "patient confidentiality respected"
        ]
      },
      {
        "label": "Private Intake & Consultation Areas 🚪",
        "sentiment": "positive",
        "keywords": [
          "private consultation",
          "confidential care"
        ]
      },
      {
        "label": "Felt Completely Secure with My Health Data 🔒",
        "sentiment": "positive",
        "keywords": [
          "secure health records",
          "hipaa compliant"
        ]
      }
    ]
  },
  {
    "id": "doc_stf_04",
    "category": "nursing_staff",
    "categoryLabel": "Nursing Staff & Reception Care",
    "question": "How coordinated was the entire clinic team during your visit?",
    "options": [
      {
        "label": "Seamless Teamwork from Door to Exit 🏆",
        "sentiment": "positive",
        "keywords": [
          "smooth teamwork",
          "coordinated medical team"
        ]
      },
      {
        "label": "Zero Disconnect Between Staff & Doctor 🩺",
        "sentiment": "positive",
        "keywords": [
          "well communicated clinic",
          "organized workflow"
        ]
      },
      {
        "label": "5-Star Patient Experience All Around 🌟",
        "sentiment": "positive",
        "keywords": [
          "best clinic experience",
          "outstanding medical service"
        ]
      }
    ]
  },
  {
    "id": "doc_fol_01",
    "category": "follow_up",
    "categoryLabel": "Follow-Up & Continuity of Care",
    "question": "Did the clinic reach out to check on your recovery?",
    "options": [
      {
        "label": "Received a Caring Follow-Up Call / Text 📞",
        "sentiment": "positive",
        "keywords": [
          "caring follow up",
          "recovery check call"
        ]
      },
      {
        "label": "Easy to Reach for Quick Clarifications 💬",
        "sentiment": "positive",
        "keywords": [
          "accessible doctor",
          "responsive clinic"
        ]
      },
      {
        "label": "Clear Recovery Milestones Set 📈",
        "sentiment": "positive",
        "keywords": [
          "clear milestones",
          "attentive physician"
        ]
      }
    ]
  },
  {
    "id": "doc_fol_02",
    "category": "follow_up",
    "categoryLabel": "Follow-Up & Continuity of Care",
    "question": "How easy was scheduling a follow-up consultation or test review?",
    "options": [
      {
        "label": "Booked in Under 30 Seconds at Checkout ⏱️",
        "sentiment": "positive",
        "keywords": [
          "fast follow up booking",
          "convenient scheduling"
        ]
      },
      {
        "label": "Telehealth / Video Call Option Available 💻",
        "sentiment": "positive",
        "keywords": [
          "telehealth option",
          "convenient virtual follow up"
        ]
      },
      {
        "label": "Flexible Timing for Reviewing Reports 📅",
        "sentiment": "positive",
        "keywords": [
          "flexible report review",
          "accommodating clinic"
        ]
      }
    ]
  },
  {
    "id": "doc_fol_03",
    "category": "follow_up",
    "categoryLabel": "Follow-Up & Continuity of Care",
    "question": "Were prescription renewals and pharmacy refills handled smoothly?",
    "options": [
      {
        "label": "Instant E-Refill Sent to Pharmacy 📲",
        "sentiment": "positive",
        "keywords": [
          "fast prescription refill",
          "electronic refill"
        ]
      },
      {
        "label": "Zero Delay with Chronic Medication 💊",
        "sentiment": "positive",
        "keywords": [
          "seamless chronic prescription",
          "reliable clinic"
        ]
      },
      {
        "label": "Staff Handled Pharmacy Inquiries Promptly 📞",
        "sentiment": "positive",
        "keywords": [
          "helpful pharmacy coordination",
          "prompt prescription care"
        ]
      }
    ]
  },
  {
    "id": "doc_fol_04",
    "category": "follow_up",
    "categoryLabel": "Follow-Up & Continuity of Care",
    "question": "Overall, how satisfied are you with this medical clinic?",
    "options": [
      {
        "label": "Found My Go-To Healthcare Provider! 🌟",
        "sentiment": "positive",
        "keywords": [
          "trusted doctor",
          "best clinic in town"
        ]
      },
      {
        "label": "Compassionate, Thorough & Highly Competent 🏆",
        "sentiment": "positive",
        "keywords": [
          "competent physician",
          "compassionate clinic"
        ]
      },
      {
        "label": "10/10 Experience, Recommend to All 👍",
        "sentiment": "positive",
        "keywords": [
          "10/10 medical visit",
          "highly recommended"
        ]
      }
    ]
  }
]
};
