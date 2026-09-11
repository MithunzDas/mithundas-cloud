export interface QuestionOption {
  label: string;
  sentiment: "positive" | "neutral";
  keywords: string[];
}

export interface PoolQuestion {
  id: string;
  category: string;
  categoryLabel?: string;
  question: string;
  options: QuestionOption[];
}

export interface IndustryConfig {
  id: string;
  name: string;
  icon: string;
  defaultPlaceHolder: string;
  sampleReview: string;
  questions: PoolQuestion[];
}

export const INDUSTRY_QUESTION_POOLS: Record<string, IndustryConfig> = {
  DENTIST: {
    id: "DENTIST",
    name: "Dental Clinic / Dentist",
    icon: "🦷",
    defaultPlaceHolder: "Dr. Smith Dental Care",
    sampleReview: "Dr. Smith and his team are amazing! The clinic is spotless, zero wait time, and the cleaning was completely pain-free. Highly recommend for anyone nervous about dental work! ✨",
    questions: [
      // 1. Doctor Care & Bedside Manner
      {
        id: "d_care_01",
        category: "doctor_care",
        categoryLabel: "Doctor Gentleness & Care",
        question: "How was the doctor's gentleness and bedside manner?",
        options: [
          { label: "Super Gentle & Completely Painless 😊", sentiment: "positive", keywords: ["gentle dentist", "painless treatment", "caring doctor"] },
          { label: "Explained Every Step Thoroughly 👨‍⚕️", sentiment: "positive", keywords: ["explained clearly", "informative", "thorough diagnosis"] },
          { label: "Calmed My Dental Anxiety 🌿", sentiment: "positive", keywords: ["reassuring", "calming atmosphere", "put me at ease"] },
          { label: "Quick, Precise & Confident ⚡", sentiment: "positive", keywords: ["efficient", "skilled dentist", "confident hands"] }
        ]
      },
      {
        id: "d_care_02",
        category: "doctor_care",
        categoryLabel: "Doctor Gentleness & Care",
        question: "Did the dentist listen carefully to your dental concerns?",
        options: [
          { label: "Listened Patiently & Never Rushed 👂", sentiment: "positive", keywords: ["patient listener", "took time to hear concerns"] },
          { label: "Answered All My Questions Clearly 💬", sentiment: "positive", keywords: ["clear answers", "honest advice"] },
          { label: "Gave Honest Options Without Pressure 🛡️", sentiment: "positive", keywords: ["no pushy treatment plans", "ethical practice"] }
        ]
      },
      {
        id: "d_care_03",
        category: "doctor_care",
        categoryLabel: "Doctor Gentleness & Care",
        question: "How comfortable did you feel during local anesthesia or injections?",
        options: [
          { label: "Barely Felt a Thing! 🪶", sentiment: "positive", keywords: ["gentle injection", "could barely feel it"] },
          { label: "Numbed Quickly & Effectively ❄️", sentiment: "positive", keywords: ["well numbed", "comfortable procedure"] },
          { label: "Doctor Checked in on Me Constantly 👍", sentiment: "positive", keywords: ["checked comfort", "attentive care"] }
        ]
      },
      {
        id: "d_care_04",
        category: "doctor_care",
        categoryLabel: "Doctor Gentleness & Care",
        question: "How was the doctor's approach with kids or nervous patients?",
        options: [
          { label: "Fantastic with Kids / Family 🧒", sentiment: "positive", keywords: ["great pediatric dentist", "kids loved it"] },
          { label: "Made Me Forget My Fear 🌟", sentiment: "positive", keywords: ["cured dental phobia", "so patient"] },
          { label: "Very Friendly & Encouraging 😊", sentiment: "positive", keywords: ["friendly staff", "reassuring"] }
        ]
      },
      {
        id: "d_care_05",
        category: "doctor_care",
        categoryLabel: "Doctor Gentleness & Care",
        question: "How would you rate the doctor's clinical expertise?",
        options: [
          { label: "True Master of Their Craft 💎", sentiment: "positive", keywords: ["expert dentist", "highly skilled specialist"] },
          { label: "Accurate Diagnosis & Fast Relief 🎯", sentiment: "positive", keywords: ["diagnosed problem quickly", "pinpointed issue"] },
          { label: "Modern, Up-to-Date Techniques 🔬", sentiment: "positive", keywords: ["advanced dental techniques", "high skill"] }
        ]
      },

      // 2. Clinic Hygiene & Equipment
      {
        id: "d_hyg_01",
        category: "clinic_hygiene",
        categoryLabel: "Clinic Hygiene & Modern Setup",
        question: "How was the clinic's cleanliness and sterile standards?",
        options: [
          { label: "Spotless & Hospital-Grade Clean ✨", sentiment: "positive", keywords: ["immaculate hygiene", "spotless operatory", "sanitized tools"] },
          { label: "Clean, Organized & Sanitized 🧼", sentiment: "positive", keywords: ["very clean clinic", "neatly organized"] },
          { label: "Fresh Smell & Calming Atmosphere 🌸", sentiment: "positive", keywords: ["fresh scent", "peaceful dental office"] }
        ]
      },
      {
        id: "d_hyg_02",
        category: "clinic_hygiene",
        categoryLabel: "Clinic Hygiene & Modern Setup",
        question: "How did you find the technology and dental equipment?",
        options: [
          { label: "Ultra High-Tech (Digital X-Rays & 3D Scans) 🖥️", sentiment: "positive", keywords: ["digital 3d scans", "cutting edge tech", "instant x-rays"] },
          { label: "Super Modern & Comfortable Dental Chairs 🛋️", sentiment: "positive", keywords: ["ergonomic chairs", "comfortable setup"] },
          { label: "Ceiling TV / Music During Procedure 📺", sentiment: "positive", keywords: ["ceiling tv distraction", "relaxing music"] }
        ]
      },
      {
        id: "d_hyg_03",
        category: "clinic_hygiene",
        categoryLabel: "Clinic Hygiene & Modern Setup",
        question: "Did you notice fresh, individually wrapped instruments?",
        options: [
          { label: "Unwrapped Right in Front of Me 🛡️", sentiment: "positive", keywords: ["sealed sterile instruments", "100% sterile"] },
          { label: "Strict Safety & Mask Protocols Followed 🧤", sentiment: "positive", keywords: ["proper ppe", "clean gloves and masks"] },
          { label: "Felt Completely Safe & Protected 💯", sentiment: "positive", keywords: ["hygienic environment", "top sanitation standards"] }
        ]
      },
      {
        id: "d_hyg_04",
        category: "clinic_hygiene",
        categoryLabel: "Clinic Hygiene & Modern Setup",
        question: "How was the waiting room environment?",
        options: [
          { label: "Boutique Lounge Feel, Very Relaxing 🌿", sentiment: "positive", keywords: ["peaceful waiting area", "comfortable couches"] },
          { label: "Water, Tea & Wi-Fi Available ☕", sentiment: "positive", keywords: ["refreshments", "welcoming waiting room"] },
          { label: "Clean, Spacious & Bright ☀️", sentiment: "positive", keywords: ["bright lighting", "tidy reception"] }
        ]
      },

      // 3. Appointment Timing & Wait Time
      {
        id: "d_time_01",
        category: "wait_time",
        categoryLabel: "Wait Time & Punctuality",
        question: "How was your appointment timing and waiting room duration?",
        options: [
          { label: "Seen Right on Time (Zero Wait!) ⏱️", sentiment: "positive", keywords: ["no wait time", "seated immediately", "punctual"] },
          { label: "Under 5-10 Minutes Wait 👍", sentiment: "positive", keywords: ["prompt appointment", "minimal wait"] },
          { label: "Smooth & Quick Check-in Process 📋", sentiment: "positive", keywords: ["paperless checkin", "fast reception"] }
        ]
      },
      {
        id: "d_time_02",
        category: "wait_time",
        categoryLabel: "Wait Time & Punctuality",
        question: "How efficient was the procedure time in the chair?",
        options: [
          { label: "Finished Fast Without Feeling Rushed ⚡", sentiment: "positive", keywords: ["speedy appointment", "efficient dental work"] },
          { label: "Paced Perfectly for My Comfort 🛋️", sentiment: "positive", keywords: ["comfortable pace", "took necessary breaks"] },
          { label: "Respected My Busy Work Schedule 💼", sentiment: "positive", keywords: ["quick lunch break visit", "timely care"] }
        ]
      },
      {
        id: "d_time_03",
        category: "wait_time",
        categoryLabel: "Wait Time & Punctuality",
        question: "How easy was scheduling your appointment?",
        options: [
          { label: "Booked Online in Under 2 Minutes 📲", sentiment: "positive", keywords: ["easy online booking", "convenient scheduling"] },
          { label: "Accommodated My Emergency Same Day 🚨", sentiment: "positive", keywords: ["same-day emergency slot", "fast relief"] },
          { label: "Helpful Appointment Reminder Texts 📱", sentiment: "positive", keywords: ["timely sms reminders", "great communication"] }
        ]
      },

      // 4. Front Desk & Support Staff
      {
        id: "d_staff_01",
        category: "staff",
        categoryLabel: "Front Desk & Hygienists",
        question: "How was the front desk and dental hygienist team?",
        options: [
          { label: "Warm, Smiling & Welcoming 🤗", sentiment: "positive", keywords: ["lovely front desk", "smiling receptionist", "warm welcome"] },
          { label: "Hygienist Had Incredibly Gentle Hands 🧼", sentiment: "positive", keywords: ["gentle hygienist", "thorough teeth cleaning"] },
          { label: "Helpful with Insurance & Direct Billing 💳", sentiment: "positive", keywords: ["seamless insurance claim", "billing explained"] },
          { label: "Professional & Highly Courteous 👔", sentiment: "positive", keywords: ["polite staff", "respectful customer service"] }
        ]
      },
      {
        id: "d_staff_02",
        category: "staff",
        categoryLabel: "Front Desk & Hygienists",
        question: "Did the dental assistant make you feel comfortable?",
        options: [
          { label: "Attentive & Kept Me Relaxed 🛋️", sentiment: "positive", keywords: ["caring dental assistant", "reassuring presence"] },
          { label: "Anticipated Doctor's Every Need 🤝", sentiment: "positive", keywords: ["coordinated team", "smooth workflow"] },
          { label: "Provided Dark Glasses & Lip Balm 🕶️", sentiment: "positive", keywords: ["thoughtful extra touches", "lip balm provided"] }
        ]
      },
      {
        id: "d_staff_03",
        category: "staff",
        categoryLabel: "Front Desk & Hygienists",
        question: "How clear was the post-treatment care explanation?",
        options: [
          { label: "Clear Printed / Spoken Aftercare Instructions 📄", sentiment: "positive", keywords: ["clear aftercare", "easy recovery guidelines"] },
          { label: "Follow-up Check-in Call or Message Next Day 📞", sentiment: "positive", keywords: ["thoughtful follow up call", "checked on my recovery"] },
          { label: "Gave Helpful Brushing & Flossing Tips 🪥", sentiment: "positive", keywords: ["great oral hygiene advice", "flossing guidance"] }
        ]
      },

      // 5. Treatment Results & Satisfaction
      {
        id: "d_res_01",
        category: "treatment_result",
        categoryLabel: "Treatment Results & Smile",
        question: "How are your teeth and mouth feeling after your visit?",
        options: [
          { label: "Teeth Feel Incredibly Smooth & Clean 😁", sentiment: "positive", keywords: ["teeth feel polished", "great scaling job"] },
          { label: "Toothache Completely Gone / Total Relief 🛡️", sentiment: "positive", keywords: ["pain relieved", "tooth feels brand new"] },
          { label: "Smile Looks Brighter & Fantastic ✨", sentiment: "positive", keywords: ["white smile", "aesthetic results", "confidence booster"] },
          { label: "Bite & Filling Feel 100% Natural 🎯", sentiment: "positive", keywords: ["natural filling", "perfect bite adjustment"] }
        ]
      },
      {
        id: "d_res_02",
        category: "treatment_result",
        categoryLabel: "Treatment Results & Smile",
        question: "If you had whitening, cosmetic, or aligner work, how are the results?",
        options: [
          { label: "Noticeably Whiter in Just One Visit 💎", sentiment: "positive", keywords: ["brighter shade", "instant whitening results"] },
          { label: "Veneers / Crown Look Identical to Real Teeth 👑", sentiment: "positive", keywords: ["seamless crown match", "natural looking veneers"] },
          { label: "Invisible Aligners Tracking Perfectly 📏", sentiment: "positive", keywords: ["clear aligner progress", "straight teeth"] }
        ]
      },
      {
        id: "d_res_03",
        category: "treatment_result",
        categoryLabel: "Treatment Results & Smile",
        question: "If you had a root canal or extraction, how was the recovery?",
        options: [
          { label: "Zero Pain Afterwards! 🙌", sentiment: "positive", keywords: ["painless extraction", "smooth recovery"] },
          { label: "Healed Much Faster Than Expected ⚡", sentiment: "positive", keywords: ["quick healing", "no complications"] },
          { label: "Prescribed Medications Worked Great 💊", sentiment: "positive", keywords: ["effective pain management", "comfortable night"] }
        ]
      },

      // 6. Pricing, Value & Transparency
      {
        id: "d_val_01",
        category: "pricing_value",
        categoryLabel: "Pricing & Transparent Value",
        question: "How transparent was the pricing and treatment estimate?",
        options: [
          { label: "Upfront Pricing with Zero Hidden Fees 💯", sentiment: "positive", keywords: ["honest dental pricing", "no surprise bill", "transparent cost"] },
          { label: "Explained Costs Before Doing Any Work 📋", sentiment: "positive", keywords: ["treatment plan quote upfront", "clear breakdown"] },
          { label: "High Value for the Level of Care 💎", sentiment: "positive", keywords: ["worth every penny", "fair dental rates"] },
          { label: "Flexible Payment / Membership Options 💳", sentiment: "positive", keywords: ["affordable dental plan", "flexible options"] }
        ]
      },
      {
        id: "d_val_02",
        category: "pricing_value",
        categoryLabel: "Pricing & Transparent Value",
        question: "Will you make this your family's regular dental clinic?",
        options: [
          { label: "Found My Forever Family Dentist! 🏆", sentiment: "positive", keywords: ["found my regular dentist", "bringing the whole family"] },
          { label: "Already Booked 6-Month Checkup 📅", sentiment: "positive", keywords: ["booked next cleaning", "loyal patient"] },
          { label: "Recommending to All My Friends & Coworkers ⭐", sentiment: "positive", keywords: ["10/10 recommendation", "best dentist in the city"] }
        ]
      }
    ]
  },

  DOCTOR_CLINIC: {
    id: "DOCTOR_CLINIC",
    name: "Medical Clinic / Doctor / Specialist",
    icon: "🩺",
    defaultPlaceHolder: "Harborview Medical Center",
    sampleReview: "Exceptional care from Dr. Patel! She listened patiently, diagnosed the root cause, and developed a treatment plan that actually brought relief. Very clean facility and compassionate nurses. 🙏",
    questions: [
      // 1. Physician Bedside Manner & Diagnosis
      {
        id: "m_doc_01",
        category: "physician_care",
        categoryLabel: "Doctor Bedside Manner",
        question: "How was the physician's bedside manner and attentiveness?",
        options: [
          { label: "Listened Patiently Without Rushing Me 👂", sentiment: "positive", keywords: ["patient physician", "listened to all symptoms", "never felt rushed"] },
          { label: "Compassionate, Empathetic & Caring 🤝", sentiment: "positive", keywords: ["caring doctor", "reassuring bedside manner"] },
          { label: "Explained My Condition in Plain English 💬", sentiment: "positive", keywords: ["explained diagnosis clearly", "easy to understand medical advice"] },
          { label: "Thorough & Methodical Examination 🩺", sentiment: "positive", keywords: ["thorough checkup", "deep investigation"] }
        ]
      },
      {
        id: "m_doc_02",
        category: "physician_care",
        categoryLabel: "Doctor Bedside Manner",
        question: "Did the doctor address all your questions and concerns?",
        options: [
          { label: "Answered Every Question Thoroughly 📋", sentiment: "positive", keywords: ["addressed all questions", "patient consultation"] },
          { label: "Gave Me Genuine Peace of Mind 🕊️", sentiment: "positive", keywords: ["relieved my worries", "reassured my health"] },
          { label: "Collaborated with Me on Treatment Options 🎯", sentiment: "positive", keywords: ["shared decision making", "thoughtful treatment plan"] }
        ]
      },
      {
        id: "m_doc_03",
        category: "physician_care",
        categoryLabel: "Doctor Bedside Manner",
        question: "How confident are you in the doctor's medical expertise?",
        options: [
          { label: "Extremely Knowledgeable Specialist 🔬", sentiment: "positive", keywords: ["top-tier specialist", "expert physician"] },
          { label: "Pinpointed Problem Other Doctors Missed 🎯", sentiment: "positive", keywords: ["accurate diagnosis", "finally found the root cause"] },
          { label: "Holistic & Preventative Approach 🌿", sentiment: "positive", keywords: ["lifestyle advice", "preventative medicine"] }
        ]
      },
      {
        id: "m_doc_04",
        category: "physician_care",
        categoryLabel: "Doctor Bedside Manner",
        question: "How was the physical exam or minor procedure?",
        options: [
          { label: "Gentle Touch, Made Me Feel at Ease 🪶", sentiment: "positive", keywords: ["gentle examination", "very comfortable"] },
          { label: "Maintained Privacy & Dignity Throughout 🛡️", sentiment: "positive", keywords: ["respectful examination", "patient privacy honored"] },
          { label: "Procedure Completed Smoothly & Quickly ⚡", sentiment: "positive", keywords: ["painless minor procedure", "skilled hands"] }
        ]
      },

      // 2. Clinic Cleanliness & Environment
      {
        id: "m_env_01",
        category: "clinic_facility",
        categoryLabel: "Facility Cleanliness & Safety",
        question: "How was the clinic's hygiene and overall environment?",
        options: [
          { label: "Immaculately Clean & Sanitized 🧼", sentiment: "positive", keywords: ["spotless medical clinic", "sanitary standards"] },
          { label: "Calm, Quiet & Non-Stressful 🌿", sentiment: "positive", keywords: ["peaceful waiting room", "relaxing environment"] },
          { label: "Modern Diagnostic Equipment On-Site 🏥", sentiment: "positive", keywords: ["modern medical technology", "clean exam rooms"] }
        ]
      },
      {
        id: "m_env_02",
        category: "clinic_facility",
        categoryLabel: "Facility Cleanliness & Safety",
        question: "How comfortable were the exam rooms?",
        options: [
          { label: "Clean Paper, Sanitized Instruments ✨", sentiment: "positive", keywords: ["fresh sanitized exam table", "sterile instruments"] },
          { label: "Good Air Ventilation & Temperature ❄️", sentiment: "positive", keywords: ["well ventilated", "comfortable climate"] },
          { label: "Spacious & Private 🚪", sentiment: "positive", keywords: ["soundproof private room", "spacious"] }
        ]
      },

      // 3. Wait Time & Scheduling
      {
        id: "m_wait_01",
        category: "wait_time",
        categoryLabel: "Appointment Punctuality",
        question: "How was your appointment wait time?",
        options: [
          { label: "Called in Right on Schedule! ⏱️", sentiment: "positive", keywords: ["seen on time", "zero waiting room delay"] },
          { label: "Minimal Wait (Under 10-15 Min) 👍", sentiment: "positive", keywords: ["reasonable wait time", "prompt appointment"] },
          { label: "Staff Kept Me Informed of Status 📢", sentiment: "positive", keywords: ["communicated timeline", "respectful of time"] }
        ]
      },
      {
        id: "m_wait_02",
        category: "wait_time",
        categoryLabel: "Appointment Punctuality",
        question: "How was the appointment booking experience?",
        options: [
          { label: "Fast Online Scheduling / App 📲", sentiment: "positive", keywords: ["smooth online booking", "convenient app"] },
          { label: "Accommodated Urgent Same-Day Visit 🚨", sentiment: "positive", keywords: ["same day urgent slot", "fast medical care"] },
          { label: "Receptionist Found a Slot That Fit My Day 🗓️", sentiment: "positive", keywords: ["flexible appointment slots", "helpful booking"] }
        ]
      },

      // 4. Nursing & Front Desk Staff
      {
        id: "m_staff_01",
        category: "staff",
        categoryLabel: "Nurses & Administrative Staff",
        question: "How were the nurses and front desk staff?",
        options: [
          { label: "Caring, Polite & Empathetic 🤗", sentiment: "positive", keywords: ["wonderful nurses", "polite receptionists", "empathetic care"] },
          { label: "Gentle Blood Draw / Vitals Check 🩹", sentiment: "positive", keywords: ["painless blood draw", "skilled nurse", "gentle phlebotomist"] },
          { label: "Quick Check-in & Paperwork Assistance 📋", sentiment: "positive", keywords: ["fast check-in", "efficient front office"] },
          { label: "Helpful with Insurance & Referrals 💳", sentiment: "positive", keywords: ["handled insurance pre-auth", "smooth referral"] }
        ]
      },
      {
        id: "m_staff_02",
        category: "staff",
        categoryLabel: "Nurses & Administrative Staff",
        question: "Did the pharmacy or prescription process go smoothly?",
        options: [
          { label: "Prescription Sent Directly to My Pharmacy 💊", sentiment: "positive", keywords: ["e-prescription sent instantly", "ready at pharmacy"] },
          { label: "Clear Dosage & Timing Instructions 📝", sentiment: "positive", keywords: ["clear medication instructions", "side effects explained"] },
          { label: "Provided Discount / Generic Alternatives 💰", sentiment: "positive", keywords: ["affordable medication options", "helpful savings"] }
        ]
      },

      // 5. Treatment Outcome & Recovery
      {
        id: "m_out_01",
        category: "outcome",
        categoryLabel: "Health Outcome & Recovery",
        question: "How are you feeling after following the doctor's plan?",
        options: [
          { label: "Feeling Tremendously Better! 🌟", sentiment: "positive", keywords: ["significant improvement", "symptoms resolved", "feeling healthy"] },
          { label: "Pain / Discomfort Substantially Reduced 🛡️", sentiment: "positive", keywords: ["pain relief", "effective treatment"] },
          { label: "Clear Roadmap for Long-Term Recovery 🗺️", sentiment: "positive", keywords: ["actionable recovery steps", "clear prognosis"] }
        ]
      },
      {
        id: "m_out_02",
        category: "outcome",
        categoryLabel: "Health Outcome & Recovery",
        question: "Would you trust this doctor and clinic for your family?",
        options: [
          { label: "100% Yes, Found Our Family Primary Doctor 🏆", sentiment: "positive", keywords: ["trusted primary care physician", "whole family goes here"] },
          { label: "Highly Recommend to Anyone Seeking Quality Care ⭐", sentiment: "positive", keywords: ["highest recommendation", "compassionate clinic"] },
          { label: "Follow-up Visit Already Scheduled 📅", sentiment: "positive", keywords: ["returning for follow up", "confident in care"] }
        ]
      }
    ]
  },

  RESTAURANT: {
    id: "RESTAURANT",
    name: "Restaurant, Fine Dining & Bistro",
    icon: "🍽️",
    defaultPlaceHolder: "The Rustic Olive Bistro",
    sampleReview: "Incredible dinner! The food came out piping hot and full of flavor. Our server was attentive without being pushy, and the cozy ambiance made for a wonderful evening. Definitely coming back! 🍷🍝",
    questions: [
      // 1. Food Quality & Taste
      {
        id: "r_food_01",
        category: "food_quality",
        categoryLabel: "Food Flavor & Quality",
        question: "How was the flavor, freshness, and quality of your meal?",
        options: [
          { label: "Bursting with Flavor & Cooked to Perfection 🍲", sentiment: "positive", keywords: ["mouthwatering flavor", "cooked perfectly", "culinary masterpiece"] },
          { label: "Fresh, High-Quality Ingredients 🥗", sentiment: "positive", keywords: ["farm fresh ingredients", "crisp produce", "tender meat"] },
          { label: "One of the Best Meals I've Had in Months! ⭐", sentiment: "positive", keywords: ["standout dish", "unforgettable dinner"] },
          { label: "Authentic & Perfectly Seasoned 🧂", sentiment: "positive", keywords: ["authentic recipe", "seasoned to perfection"] }
        ]
      },
      {
        id: "r_food_02",
        category: "food_quality",
        categoryLabel: "Food Flavor & Quality",
        question: "How was the food temperature when it reached your table?",
        options: [
          { label: "Piping Hot Right from the Kitchen ♨️", sentiment: "positive", keywords: ["served piping hot", "fresh off the stove"] },
          { label: "Crispy & Crunchy Exactly as It Should Be 🍟", sentiment: "positive", keywords: ["crispy texture", "not soggy"] },
          { label: "Perfect Temperature for Every Course 🍽️", sentiment: "positive", keywords: ["well timed courses", "ideal serving temp"] }
        ]
      },
      {
        id: "r_food_03",
        category: "food_quality",
        categoryLabel: "Food Flavor & Quality",
        question: "How were the appetizers and drinks?",
        options: [
          { label: "Cocktails Were Balanced & Delicious 🍸", sentiment: "positive", keywords: ["crafted cocktails", "great mixologist", "refreshing drinks"] },
          { label: "Appetizers Stole the Show! 🥟", sentiment: "positive", keywords: ["incredible starters", "appetizers were amazing"] },
          { label: "Great Wine Pairing Recommendations 🍷", sentiment: "positive", keywords: ["excellent wine list", "great sommelier"] }
        ]
      },
      {
        id: "r_food_04",
        category: "food_quality",
        categoryLabel: "Food Flavor & Quality",
        question: "Did you save room for dessert?",
        options: [
          { label: "Dessert was Heavenly! 🍰", sentiment: "positive", keywords: ["divine dessert", "rich chocolate", "sweet finish"] },
          { label: "Decadent & Not Overly Sweet 🍨", sentiment: "positive", keywords: ["perfect dessert balance", "house-made sweets"] },
          { label: "Pairing with Coffee was Spot-on ☕", sentiment: "positive", keywords: ["great espresso to finish", "sweet treat"] }
        ]
      },

      // 2. Portion Size & Plating
      {
        id: "r_plat_01",
        category: "presentation",
        categoryLabel: "Plating & Portion Size",
        question: "How was the plating presentation and portion size?",
        options: [
          { label: "Generous Portions, Left Completely Satisfied 🍽️", sentiment: "positive", keywords: ["hearty portion sizes", "great quantity", "left full"] },
          { label: "Stunning, Instagram-Worthy Plating 📸", sentiment: "positive", keywords: ["beautiful presentation", "artistic plating", "photogenic food"] },
          { label: "Great Value for the Portion & Quality 💎", sentiment: "positive", keywords: ["generous value", "plenty to share"] },
          { label: "Had Plenty to Take Home for Later 🥡", sentiment: "positive", keywords: ["took leftovers home", "big portions"] }
        ]
      },

      // 3. Service & Hospitality
      {
        id: "r_serv_01",
        category: "service",
        categoryLabel: "Table Service & Hospitality",
        question: "How was your server's attention and hospitality?",
        options: [
          { label: "Attentive, Friendly & Welcoming 🛎️", sentiment: "positive", keywords: ["friendly waiter", "warm hospitality", "courteous staff"] },
          { label: "Never Had to Ask for a Water Refill 💧", sentiment: "positive", keywords: ["fast drink refills", "never waited for water"] },
          { label: "Gave Spot-On Menu Recommendations 💡", sentiment: "positive", keywords: ["server recommended the best dish", "helpful menu guidance"] },
          { label: "Paced the Meal Perfectly (Not Rushed) ⏳", sentiment: "positive", keywords: ["leisurely dining pace", "relaxed meal", "not rushed out"] }
        ]
      },
      {
        id: "r_serv_02",
        category: "service",
        categoryLabel: "Table Service & Hospitality",
        question: "How was the greeting at the host stand?",
        options: [
          { label: "Seated Promptly with a Warm Smile 😊", sentiment: "positive", keywords: ["warm host greeting", "seated right away"] },
          { label: "Honored My Reservation Table Request 🪑", sentiment: "positive", keywords: ["great table placement", "booth reservation honored"] },
          { label: "Very Accommodating with Our Group / Kids 👨‍👩‍👧", sentiment: "positive", keywords: ["accommodating for large party", "family friendly host"] }
        ]
      },
      {
        id: "r_serv_03",
        category: "service",
        categoryLabel: "Table Service & Hospitality",
        question: "How was the turnaround time from ordering to food arrival?",
        options: [
          { label: "Impressed by How Fast Food Arrived ⚡", sentiment: "positive", keywords: ["fast kitchen", "prompt food delivery", "minimal wait"] },
          { label: "Timed Just Right Between Courses ⏱️", sentiment: "positive", keywords: ["well paced service", "appetizers then mains"] },
          { label: "Fast Check & Payment Handling 💳", sentiment: "positive", keywords: ["quick bill settlement", "split check handled easily"] }
        ]
      },

      // 4. Dining Ambiance & Vibe
      {
        id: "r_amb_01",
        category: "ambiance",
        categoryLabel: "Ambiance & Atmosphere",
        question: "How was the dining room ambiance and vibe?",
        options: [
          { label: "Cozy, Romantic & Intimate 🕯️", sentiment: "positive", keywords: ["romantic date night vibe", "cozy lighting", "intimate atmosphere"] },
          { label: "Lively, Energetic & Fun Crowd 🎶", sentiment: "positive", keywords: ["vibrant crowd", "buzzing energy", "fun dinner atmosphere"] },
          { label: "Lovely Music at Just the Right Volume 🎵", sentiment: "positive", keywords: ["great background music", "could easily converse"] },
          { label: "Beautiful Decor & Clean Restrooms ✨", sentiment: "positive", keywords: ["stylish interior decor", "spotless restrooms"] }
        ]
      },
      {
        id: "r_amb_02",
        category: "ambiance",
        categoryLabel: "Ambiance & Atmosphere",
        question: "If you sat outdoors or at the bar, how was that space?",
        options: [
          { label: "Charming Outdoor Patio / Terrace 🌿", sentiment: "positive", keywords: ["beautiful outdoor seating", "pleasant patio dining"] },
          { label: "Great Bar Seating & Social Vibe 🍸", sentiment: "positive", keywords: ["fun bar vibe", "great bartenders"] },
          { label: "Cozy Booth with Plenty of Space 🛋️", sentiment: "positive", keywords: ["comfortable booth seating", "spacious table"] }
        ]
      },

      // 5. Special Diets & Dietary Options
      {
        id: "r_diet_01",
        category: "dietary",
        categoryLabel: "Dietary Accommodation",
        question: "Did the menu accommodate dietary preferences or allergies?",
        options: [
          { label: "Great Vegetarian / Vegan Options 🌱", sentiment: "positive", keywords: ["delicious vegetarian dishes", "plant based choices"] },
          { label: "Careful with Gluten-Free / Allergies 🛡️", sentiment: "positive", keywords: ["gluten free friendly", "allergy cautious kitchen"] },
          { label: "Kitchen Modified Dish Happily Without Fuss 👍", sentiment: "positive", keywords: ["custom modifications accommodated", "flexible chef"] }
        ]
      },

      // 6. Return Intent & Overall Experience
      {
        id: "r_ret_01",
        category: "return_intent",
        categoryLabel: "Overall Recommendation",
        question: "Will you return to this restaurant or recommend it to friends?",
        options: [
          { label: "Already Craving My Next Visit! 😋", sentiment: "positive", keywords: ["new favorite restaurant", "cannot wait to return"] },
          { label: "10/10 Must-Visit for Any Food Lover 🏆", sentiment: "positive", keywords: ["top restaurant in town", "highest recommendation"] },
          { label: "Bringing Out-of-Town Guests Here ✈️", sentiment: "positive", keywords: ["showcasing to visitors", "go-to dining spot"] },
          { label: "Every Penny Well Spent 💯", sentiment: "positive", keywords: ["worth every dollar", "exceptional culinary value"] }
        ]
      }
    ]
  },

  CAFE: {
    id: "CAFE",
    name: "Cafe, Specialty Coffee & Bakery",
    icon: "☕",
    defaultPlaceHolder: "Artisan Roast & Bakery",
    sampleReview: "Hands down the best flat white in the neighborhood! The pastries are baked fresh every morning and the vibe is calm and welcoming with great Wi-Fi. My new daily ritual! ☕🥐✨",
    questions: [
      // 1. Coffee & Beverages
      {
        id: "cf_bev_01",
        category: "coffee_quality",
        categoryLabel: "Coffee Quality & Craft",
        question: "How was the specialty coffee or espresso beverage?",
        options: [
          { label: "Flawless Espresso & Silky Microfoam ☕", sentiment: "positive", keywords: ["smooth espresso", "silky latte art", "perfect temperature"] },
          { label: "Rich, Bold Cold Brew / Iced Coffee 🧊", sentiment: "positive", keywords: ["rich cold brew", "smooth and not bitter"] },
          { label: "Top-Tier Specialty Beans with Deep Notes 🌰", sentiment: "positive", keywords: ["single origin beans", "freshly roasted coffee"] },
          { label: "Delicious Matcha / Chai / Tea Selection 🍵", sentiment: "positive", keywords: ["ceremonial grade matcha", "aromatic chai latte"] }
        ]
      },
      {
        id: "cf_bev_02",
        category: "coffee_quality",
        categoryLabel: "Coffee Quality & Craft",
        question: "How were the non-dairy or milk alternatives?",
        options: [
          { label: "Great Oat / Almond / Soy Milk Foam 🥛", sentiment: "positive", keywords: ["creamy oat milk", "great plant based options"] },
          { label: "House-Made Syrups (Vanilla / Lavender) 🍯", sentiment: "positive", keywords: ["house made syrups", "not artificial"] },
          { label: "Sugar-Free / Keto Options Available 🌿", sentiment: "positive", keywords: ["sugar free choices", "health conscious options"] }
        ]
      },

      // 2. Pastries, Bakery & Food
      {
        id: "cf_food_01",
        category: "bakery_food",
        categoryLabel: "Pastries & Brunch Items",
        question: "How were the fresh pastries and breakfast items?",
        options: [
          { label: "Flaky, Warm Croissants & Pastries 🥐", sentiment: "positive", keywords: ["buttery flaky croissant", "baked fresh daily", "melt in mouth"] },
          { label: "Delicious Avocado Toast / Breakfast Sandwich 🥑", sentiment: "positive", keywords: ["tasty avocado toast", "fresh breakfast bagel"] },
          { label: "Warm, Gooey Cinnamon Roll / Cookies 🍪", sentiment: "positive", keywords: ["fresh baked cookies", "indulgent pastry"] },
          { label: "Excellent Gluten-Free / Vegan Treats 🌱", sentiment: "positive", keywords: ["gluten free bakery", "vegan pastry option"] }
        ]
      },

      // 3. Barista Service & Speed
      {
        id: "cf_serv_01",
        category: "barista_service",
        categoryLabel: "Barista Service & Speed",
        question: "How was the barista's hospitality and speed?",
        options: [
          { label: "Super Friendly & Cheerful Greeting 😊", sentiment: "positive", keywords: ["smiling barista", "welcoming vibe", "great attitude"] },
          { label: "Drink Ready in No Time ⚡", sentiment: "positive", keywords: ["fast drink turnaround", "no long wait line"] },
          { label: "Knowledgeable About Bean Roasts & Origins ☕", sentiment: "positive", keywords: ["passionate barista", "helpful recommendation"] },
          { label: "Remembered My Regular Order! 🧠", sentiment: "positive", keywords: ["remembered my name", "personalized customer service"] }
        ]
      },

      // 4. Cafe Atmosphere, Wi-Fi & Seating
      {
        id: "cf_vibe_01",
        category: "cafe_atmosphere",
        categoryLabel: "Atmosphere & Workspace",
        question: "How was the cafe atmosphere and seating comfort?",
        options: [
          { label: "Cozy Corners, Beautiful Plants & Decor 🌿", sentiment: "positive", keywords: ["aesthetic cafe", "plants and natural light", "cozy vibes"] },
          { label: "Great for Remote Work / Studying (Wi-Fi & Plugs) 💻", sentiment: "positive", keywords: ["fast free wifi", "plenty of outlets", "laptop friendly"] },
          { label: "Relaxing Lo-Fi Music at Perfect Volume 🎶", sentiment: "positive", keywords: ["chill music playlist", "relaxing ambience"] },
          { label: "Dog / Pet-Friendly Patio 🐶", sentiment: "positive", keywords: ["dog friendly cafe", "pup cups provided"] }
        ]
      },
      {
        id: "cf_vibe_02",
        category: "cafe_atmosphere",
        categoryLabel: "Atmosphere & Workspace",
        question: "How clean were the tables and condiment bar?",
        options: [
          { label: "Tables Wiped Down Immediately ✨", sentiment: "positive", keywords: ["clean tables", "tidy dining area"] },
          { label: "Well-Stocked Sugar, Napkins & Water Bar 💧", sentiment: "positive", keywords: ["free water station", "stocked condiment bar"] },
          { label: "Spotless Restroom Facilities 🧼", sentiment: "positive", keywords: ["clean bathroom", "well maintained"] }
        ]
      },

      // 5. Value & Daily Habit
      {
        id: "cf_ret_01",
        category: "return_intent",
        categoryLabel: "Loyalty & Recommendation",
        question: "Will you make this cafe your regular morning spot?",
        options: [
          { label: "My New Daily Morning Ritual! 🏆", sentiment: "positive", keywords: ["daily morning coffee", "best cafe in neighborhood"] },
          { label: "Bought a Bag of Whole Beans to Take Home 🛍️", sentiment: "positive", keywords: ["bought beans", "brewing at home"] },
          { label: "Telling All My Friends & Coworkers ⭐", sentiment: "positive", keywords: ["highest recommendation", "must-visit coffee shop"] }
        ]
      }
    ]
  },

  LUXURY_HOTEL: {
    id: "LUXURY_HOTEL",
    name: "Luxury Hotel, Resort & Hospitality",
    icon: "🏨",
    defaultPlaceHolder: "Grand Horizon Palace & Suites",
    sampleReview: "Exceptional stay from start to finish! The room was spotless with a breathtaking view, the staff went above and beyond with early check-in, and the breakfast buffet was lavish. Will definitely return! 🏨✨",
    questions: [
      // 1. Room Comfort, Bed & Cleanliness
      {
        id: "h_room_01",
        category: "room_comfort",
        categoryLabel: "Room Luxury & Bed Comfort",
        question: "How was the comfort of your room and the bed?",
        options: [
          { label: "Cloud-Like Mattress & Silky Linens 🛏️", sentiment: "positive", keywords: ["luxurious bed", "plush mattress", "crisp high thread linens"] },
          { label: "Whisper-Quiet & Deep Restful Sleep 💤", sentiment: "positive", keywords: ["soundproof rooms", "peaceful sleep", "pitch black curtains"] },
          { label: "Breathtaking Balcony / Skyline View 🌅", sentiment: "positive", keywords: ["stunning ocean view", "spectacular city skyline view"] },
          { label: "Spacious Suite with Elegant Designer Furnishings 🛋️", sentiment: "positive", keywords: ["spacious suite", "tasteful luxury decor"] }
        ]
      },
      {
        id: "h_room_02",
        category: "room_comfort",
        categoryLabel: "Room Luxury & Bed Comfort",
        question: "How was the bathroom, shower, and bath amenities?",
        options: [
          { label: "Rainfall Shower with High Water Pressure 🚿", sentiment: "positive", keywords: ["rainfall shower", "deep soaking tub", "strong water pressure"] },
          { label: "High-End Luxury Toiletries & Fluffy Robes 🧴", sentiment: "positive", keywords: ["designer toiletries", "plush bathrobes and slippers"] },
          { label: "Marble Finishes & Sparkling Clean ✨", sentiment: "positive", keywords: ["marble bathroom", "spotlessly clean"] }
        ]
      },
      {
        id: "h_room_03",
        category: "room_comfort",
        categoryLabel: "Room Luxury & Bed Comfort",
        question: "How were the in-room tech and climate control?",
        options: [
          { label: "Intuitive Smart Thermostat & Lighting 💡", sentiment: "positive", keywords: ["smart room controls", "perfect temperature"] },
          { label: "Nespresso Coffee Machine & Gourmet Minibar ☕", sentiment: "positive", keywords: ["nespresso machine in room", "complimentary bottled water"] },
          { label: "Large Smart TV with Easy Phone Streaming 📺", sentiment: "positive", keywords: ["streaming enabled tv", "fast hotel wifi"] }
        ]
      },

      // 2. Front Desk & Concierge Service
      {
        id: "h_serv_01",
        category: "concierge_service",
        categoryLabel: "Front Desk & Concierge",
        question: "How was your check-in, check-out, and reception service?",
        options: [
          { label: "VIP Welcome with Refreshing Arrival Drink 🥂", sentiment: "positive", keywords: ["warm welcome", "welcome drink upon arrival", "felt like royalty"] },
          { label: "Seamless, Speedy Check-in (Zero Lines) ⏱️", sentiment: "positive", keywords: ["fast check-in", "paperless reception", "no wait"] },
          { label: "Accommodated Early Check-in / Late Check-out 🗝️", sentiment: "positive", keywords: ["early checkin granted", "flexible late checkout"] },
          { label: "Concierge Secured Amazing Dinner Reservations 🍷", sentiment: "positive", keywords: ["expert concierge", "exclusive local bookings"] }
        ]
      },
      {
        id: "h_serv_02",
        category: "concierge_service",
        categoryLabel: "Front Desk & Concierge",
        question: "How was the luggage handling and bell staff?",
        options: [
          { label: "Luggage Delivered to Room Immediately 🧳", sentiment: "positive", keywords: ["prompt bellhop service", "bags delivered fast"] },
          { label: "Courteous Valet & Doormen 🚗", sentiment: "positive", keywords: ["polite valet", "doormen always greeting with a smile"] },
          { label: "Secure Luggage Storage After Checkout 🔒", sentiment: "positive", keywords: ["held bags safely", "convenient luggage hold"] }
        ]
      },

      // 3. Breakfast, Dining & Room Service
      {
        id: "h_dine_01",
        category: "hotel_dining",
        categoryLabel: "Breakfast Buffet & In-Room Dining",
        question: "How was the breakfast buffet and hotel dining?",
        options: [
          { label: "Lavish Breakfast Buffet Spread with Live Stations 🍳", sentiment: "positive", keywords: ["sumptuous breakfast spread", "made to order omelets", "fresh pastries"] },
          { label: "Fast & Piping Hot 24/7 Room Service 🛎️", sentiment: "positive", keywords: ["prompt room service", "piping hot food in room"] },
          { label: "Signature Cocktails at Rooftop / Lounge Bar 🍸", sentiment: "positive", keywords: ["rooftop bar views", "expert mixologists"] }
        ]
      },

      // 4. Amenities: Pool, Spa & Gym
      {
        id: "h_amen_01",
        category: "hotel_amenities",
        categoryLabel: "Pool, Spa & Wellness Facilities",
        question: "How did you enjoy the hotel pool, spa, or fitness center?",
        options: [
          { label: "Stunning Infinity Pool with Attentive Service 🏊", sentiment: "positive", keywords: ["pristine swimming pool", "poolside towel service and drinks"] },
          { label: "World-Class Spa & Relaxing Treatments 💆", sentiment: "positive", keywords: ["heavenly spa massage", "sauna and steam room"] },
          { label: "State-of-the-Art Fitness Center 🏋️", sentiment: "positive", keywords: ["modern hotel gym", "clean workout machines"] },
          { label: "Private Cabanas & Serene Garden Grounds 🌴", sentiment: "positive", keywords: ["peaceful landscaped gardens", "private cabanas"] }
        ]
      },

      // 5. Housekeeping & Hygiene Standards
      {
        id: "h_house_01",
        category: "housekeeping",
        categoryLabel: "Housekeeping & Turn-Down",
        question: "How was the housekeeping and daily cleanliness?",
        options: [
          { label: "Impeccable Daily Cleaning & Fresh Towels 🧼", sentiment: "positive", keywords: ["flawless housekeeping", "fresh towels daily", "immaculate room"] },
          { label: "Delightful Evening Turndown with Chocolates 🍫", sentiment: "positive", keywords: ["thoughtful turndown service", "nightly chocolates"] },
          { label: "Prompt Delivery of Extra Pillows / Items 🪶", sentiment: "positive", keywords: ["speedy delivery of extra amenities", "attentive housekeeping"] }
        ]
      },

      // 6. Overall Stay & Loyalty
      {
        id: "h_loy_01",
        category: "return_intent",
        categoryLabel: "Overall Experience & Return",
        question: "Would you book another stay at this property?",
        options: [
          { label: "10/10 Perfect Stay, Will Definitely Return! 🏆", sentiment: "positive", keywords: ["best hotel experience", "will be returning soon"] },
          { label: "Exceeded Every Expectation of Luxury 💎", sentiment: "positive", keywords: ["true 5-star hospitality", "worth every penny"] },
          { label: "Already Recommending to Family & Friends ⭐", sentiment: "positive", keywords: ["highest recommendation", "unforgettable vacation"] }
        ]
      }
    ]
  },

  SALON_SPA: {
    id: "SALON_SPA",
    name: "Hair Salon, Spa & Beauty Clinic",
    icon: "💇‍♀️",
    defaultPlaceHolder: "Glow & Co. Luxury Hair Salon",
    sampleReview: "Hands down the best haircut and styling experience! The stylist listened to exactly what I wanted, and the scalp massage was heavenly. Left feeling completely refreshed and confident! 💇‍♀️✨",
    questions: [
      // 1. Stylist & Technician Skill
      {
        id: "s_skill_01",
        category: "stylist_skill",
        categoryLabel: "Stylist Technique & Precision",
        question: "How was your stylist's or technician's skill?",
        options: [
          { label: "Nailed the Exact Look I Showed in Photos 🎯", sentiment: "positive", keywords: ["brought photo to life", "exact haircut I wanted", "precision cut"] },
          { label: "Master Colorist (Flawless Balayage / Highlights) 🎨", sentiment: "positive", keywords: ["seamless balayage", "gorgeous hair color", "no brassiness"] },
          { label: "Listened Carefully & Gave Expert Suggestions 💡", sentiment: "positive", keywords: ["listened to hair goals", "flattering style advice"] },
          { label: "Gentle Touch, No Pulling or Scalp Irritation 🪶", sentiment: "positive", keywords: ["gentle hands", "careful styling"] }
        ]
      },
      {
        id: "s_skill_02",
        category: "stylist_skill",
        categoryLabel: "Stylist Technique & Precision",
        question: "If you had a nail, lash, or skincare service, how was it?",
        options: [
          { label: "Flawless Gel Manicure / Nail Art 💅", sentiment: "positive", keywords: ["clean cuticles", "durable gel manicure", "gorgeous nail art"] },
          { label: "Lash Extensions Look Natural & Full 👁️", sentiment: "positive", keywords: ["lightweight lash extensions", "expert application"] },
          { label: "Facial Left My Skin Glowing for Days ✨", sentiment: "positive", keywords: ["glowing skin", "hydrating facial", "clear complexion"] }
        ]
      },

      // 2. Extra Pampering & Hair Wash
      {
        id: "s_pamp_01",
        category: "pampering",
        categoryLabel: "Pampering & Scalp Massage",
        question: "How was the hair wash and scalp massage experience?",
        options: [
          { label: "Heavenly Scalp Massage & Warm Towel 💆‍♀️", sentiment: "positive", keywords: ["relaxing scalp massage", "warm towel wrap", "melted my stress away"] },
          { label: "Ergonomic Wash Sinks with Zero Neck Strain 🛋️", sentiment: "positive", keywords: ["comfortable wash basin", "no neck pain"] },
          { label: "Complimentary Cappuccino / Wine / Champagne 🥂", sentiment: "positive", keywords: ["welcome beverage", "pampered hospitality"] }
        ]
      },

      // 3. Products & Hair Health
      {
        id: "s_prod_01",
        category: "product_quality",
        categoryLabel: "Product Quality & Hair Health",
        question: "How does your hair feel after using their products?",
        options: [
          { label: "Hair Feels Silky, Healthy & Weightless 💎", sentiment: "positive", keywords: ["silky soft hair", "healthy shine", "no damage"] },
          { label: "Smells Incredible & Clean 🌸", sentiment: "positive", keywords: ["gorgeous smelling products", "salon grade shampoo"] },
          { label: "Recommended Products Without Being Pushy 🛍️", sentiment: "positive", keywords: ["helpful product tips", "no aggressive upselling"] }
        ]
      },

      // 4. Salon Ambiance & Cleanliness
      {
        id: "s_amb_01",
        category: "ambiance",
        categoryLabel: "Salon Vibe & Hygiene",
        question: "How was the salon ambiance and cleanliness?",
        options: [
          { label: "Chic, Modern & Instagrammable Aesthetic 📸", sentiment: "positive", keywords: ["stylish salon decor", "modern aesthetic", "beautiful lighting"] },
          { label: "Spotlessly Clean Stations & Sanitized Scissors ✂️", sentiment: "positive", keywords: ["sanitized brushes and shears", "clean salon chairs"] },
          { label: "Calm, Relaxing Playlist & Great Energy 🎶", sentiment: "positive", keywords: ["relaxing vibe", "friendly team energy"] }
        ]
      },

      // 5. Results & Loyalty
      {
        id: "s_ret_01",
        category: "return_intent",
        categoryLabel: "Satisfaction & Return Intent",
        question: "How do you feel walking out of the salon today?",
        options: [
          { label: "Huge Confidence Boost, Obsessed with the Look! 😍", sentiment: "positive", keywords: ["confidence booster", "in love with my new hair"] },
          { label: "Already Got Several Compliments Today! 💖", sentiment: "positive", keywords: ["receiving compliments", "looks stunning"] },
          { label: "Already Re-booked with My Stylist 📅", sentiment: "positive", keywords: ["found my forever stylist", "booked next appointment"] }
        ]
      }
    ]
  },

  GYM: {
    id: "GYM",
    name: "Gym, Fitness Center & CrossFit",
    icon: "💪",
    defaultPlaceHolder: "IronPeak Fitness & Performance",
    sampleReview: "Top tier gym! High-spec equipment that's never broken, clean locker rooms, and an incredible motivating vibe. The trainers genuinely care about your form and progress. 5 stars! 🔥",
    questions: [
      // 1. Equipment & Lifting Floor
      {
        id: "g_eq_01",
        category: "equipment",
        categoryLabel: "Equipment Variety & Quality",
        question: "How is the quality and variety of the workout equipment?",
        options: [
          { label: "Heavy-Duty, Commercial-Grade Machines 🏋️‍♂️", sentiment: "positive", keywords: ["hammer strength", "top brand machines", "heavy dumbbells"] },
          { label: "Multiple Squat Racks & Bench Stations ⚡", sentiment: "positive", keywords: ["never wait for a rack", "multiple barbell stations"] },
          { label: "Dedicated Functional / Sled / Turf Zone 🏃", sentiment: "positive", keywords: ["spacious turf", "kettlebells and plyo boxes", "hyrox zone"] },
          { label: "All Cardio Machines Clean & Working Perfectly 🚴", sentiment: "positive", keywords: ["cardio machines in great shape", "interactive screens"] }
        ]
      },
      // 2. Cleanliness & Locker Rooms
      {
        id: "g_hyg_01",
        category: "cleanliness",
        categoryLabel: "Facility Hygiene & Lockers",
        question: "How clean are the workout floors, showers, and locker rooms?",
        options: [
          { label: "Locker Rooms & Showers are Sparkling 🚿", sentiment: "positive", keywords: ["spotless showers", "clean lockers", "fresh towels"] },
          { label: "Disinfectant Wipes Everywhere & Used by Members 🧴", sentiment: "positive", keywords: ["hygienic gym", "wipes always stocked", "clean benches"] },
          { label: "Great AC & Airflow (Never Smells Sweaty!) ❄️", sentiment: "positive", keywords: ["cool air conditioning", "great ventilation", "smells fresh"] }
        ]
      },
      // 3. Trainers & Coaching
      {
        id: "g_coach_01",
        category: "coaching",
        categoryLabel: "Trainers & Group Classes",
        question: "How was the coaching, group classes, or staff assistance?",
        options: [
          { label: "Trainers Correct Form & Prevent Injuries 🎯", sentiment: "positive", keywords: ["knowledgeable coaches", "attentive form corrections"] },
          { label: "High-Energy, Addictive Group Fitness Classes 🔥", sentiment: "positive", keywords: ["motivating class instructor", "fun workout class"] },
          { label: "Friendly Front Desk Staff Welcoming You by Name 👋", sentiment: "positive", keywords: ["welcoming gym staff", "great customer service"] }
        ]
      },
      // 4. Vibe & Community
      {
        id: "g_vibe_01",
        category: "community_vibe",
        categoryLabel: "Atmosphere & Community",
        question: "How is the gym energy and community feel?",
        options: [
          { label: "Electrifying, Motivating Playlist & Energy ⚡", sentiment: "positive", keywords: ["motivating atmosphere", "great workout music"] },
          { label: "Judgment-Free & Supportive for All Levels 🤝", sentiment: "positive", keywords: ["supportive community", "non-intimidating for beginners"] },
          { label: "Members Re-Rack Weights & Respect Space 🛡️", sentiment: "positive", keywords: ["respectful gym culture", "re-racked weights"] }
        ]
      },
      // 5. Results & Membership Value
      {
        id: "g_val_01",
        category: "return_intent",
        categoryLabel: "Results & Recommendation",
        question: "Have you seen progress and would you recommend this facility?",
        options: [
          { label: "Hitting PRs & Best Shape of My Life 📈", sentiment: "positive", keywords: ["seen major fitness progress", "achieved fitness goals"] },
          { label: "Best Gym Investment in the Area 🏆", sentiment: "positive", keywords: ["worth every dollar of membership", "best fitness center"] },
          { label: "Convinced Multiple Friends to Join ⭐", sentiment: "positive", keywords: ["bringing friends to workout", "highest recommendation"] }
        ]
      }
    ]
  },

  AUTO_REPAIR: {
    id: "AUTO_REPAIR",
    name: "Auto Repair, Tires & Detailing",
    icon: "🚗",
    defaultPlaceHolder: "Apex Precision Auto Works",
    sampleReview: "Honest and reliable mechanics are hard to find, but Apex is the real deal! Fair price estimate, fast turnaround, and they explained exactly what was fixed without upselling. 5 stars! 🚗🔧",
    questions: [
      // 1. Honesty & Transparency
      {
        id: "a_hon_01",
        category: "honesty",
        categoryLabel: "Mechanic Honesty & Estimates",
        question: "How was the honesty and transparency of the repair quote?",
        options: [
          { label: "100% Honest, Zero Shady Upselling 🛡️", sentiment: "positive", keywords: ["trustworthy mechanic", "no pushy upselling", "honest recommendations"] },
          { label: "Showed Me the Old Worn Parts / Video Inspection 🔍", sentiment: "positive", keywords: ["transparent inspection", "showed old parts"] },
          { label: "Honored Exact Estimate Without Surprise Surcharges 💰", sentiment: "positive", keywords: ["exact quote honored", "no hidden fees", "fair pricing"] }
        ]
      },
      // 2. Repair Quality & Driving Performance
      {
        id: "a_qual_01",
        category: "quality",
        categoryLabel: "Repair Quality & Performance",
        question: "How is your vehicle driving after the service?",
        options: [
          { label: "Runs Like Brand New, Strange Noise is Gone! 🚙", sentiment: "positive", keywords: ["runs like new", "noise completely fixed", "smooth driving"] },
          { label: "Brakes / Suspension Feel Crisp & Responsive 🛑", sentiment: "positive", keywords: ["crisp brakes", "tight handling", "aligned perfectly"] },
          { label: "AC Blowing Ice Cold Again ❄️", sentiment: "positive", keywords: ["ice cold ac", "comfort restored"] },
          { label: "Check Engine Light Off & Inspection Passed 🟢", sentiment: "positive", keywords: ["passed inspection", "warning lights gone"] }
        ]
      },
      // 3. Turnaround Speed & Communication
      {
        id: "a_time_01",
        category: "speed",
        categoryLabel: "Turnaround Speed & Updates",
        question: "How was the turnaround time and status updates?",
        options: [
          { label: "Completed Same Day as Promised ⏱️", sentiment: "positive", keywords: ["ready when promised", "fast turnaround", "same day repair"] },
          { label: "Kept Me Updated via Text & Photos 📱", sentiment: "positive", keywords: ["regular text updates", "photo progress"] },
          { label: "Diagnosed the Issue in Under 30 Minutes ⚡", sentiment: "positive", keywords: ["quick diagnostic scan", "fast problem pinpointing"] }
        ]
      },
      // 4. Cleanliness & Customer Courtesy
      {
        id: "a_clean_01",
        category: "cleanliness",
        categoryLabel: "Vehicle Care & Cleanliness",
        question: "Was your vehicle returned clean and well-treated?",
        options: [
          { label: "Clean Steering Wheel, Seat Paper Used ✨", sentiment: "positive", keywords: ["no grease on interior", "protective seat covers used"] },
          { label: "Complimentary Exterior Car Wash Included 🚿", sentiment: "positive", keywords: ["complimentary car wash", "clean windshield"] },
          { label: "Comfortable Waiting Room with Wi-Fi & Coffee ☕", sentiment: "positive", keywords: ["clean waiting area", "good coffee while waiting"] }
        ]
      },
      // 5. Loyalty & Referral
      {
        id: "a_ret_01",
        category: "return_intent",
        categoryLabel: "Trust & Recommendation",
        question: "Will you bring your vehicles here for future repairs?",
        options: [
          { label: "Found My Go-To Mechanic for Life 🏆", sentiment: "positive", keywords: ["found my trusted mechanic", "reliable auto shop"] },
          { label: "Recommending to Family & Friends Without Hesitation ⭐", sentiment: "positive", keywords: ["highest recommendation for car repair", "reliable garage"] },
          { label: "Fair Labor Rates for Exceptional Quality 💎", sentiment: "positive", keywords: ["great value for car repair", "reasonable labor cost"] }
        ]
      }
    ]
  },

  GENERAL_SERVICES: {
    id: "GENERAL_SERVICES",
    name: "Home Services, Trade & Professional",
    icon: "⭐",
    defaultPlaceHolder: "Metro Pro Services",
    sampleReview: "Prompt, professional, and reliable! Arrived on time, completed the work with high craftsmanship, and left everything clean. Would not hesitate to recommend to friends and family! 👍",
    questions: [
      {
        id: "gen_time_01",
        category: "punctuality",
        categoryLabel: "Punctuality & Communication",
        question: "How was the punctuality and arrival time?",
        options: [
          { label: "Arrived Exactly On Time Within Window ⏱️", sentiment: "positive", keywords: ["punctual arrival", "on schedule", "reliable timing"] },
          { label: "Sent 15-Minute Courtesy Arrival Text 📱", sentiment: "positive", keywords: ["advance notice text", "great communication"] },
          { label: "Polite, Respectful of My Property 🤝", sentiment: "positive", keywords: ["wore shoe covers", "courteous technician"] }
        ]
      },
      {
        id: "gen_work_01",
        category: "workmanship",
        categoryLabel: "Craftsmanship & Quality",
        question: "How was the craftsmanship and job execution?",
        options: [
          { label: "Flawless Craftsmanship & High Attention to Detail 🛠️", sentiment: "positive", keywords: ["meticulous craftsmanship", "thorough job", "high standards"] },
          { label: "Problem Solved Quickly on First Visit ⚡", sentiment: "positive", keywords: ["fixed on first visit", "had all parts in van"] },
          { label: "Cleaned Up Completely (Zero Mess Left Behind) 🧹", sentiment: "positive", keywords: ["spotless cleanup", "left workspace cleaner than found"] }
        ]
      },
      {
        id: "gen_val_01",
        category: "pricing",
        categoryLabel: "Fair Pricing & Integrity",
        question: "How was the pricing and overall value?",
        options: [
          { label: "Honest Upfront Quote with Zero Surprises 💰", sentiment: "positive", keywords: ["honest price", "upfront quote honored"] },
          { label: "Backed with Strong Warranty & Guarantee 🛡️", sentiment: "positive", keywords: ["guaranteed workmanship", "peace of mind"] },
          { label: "Will Definitely Call Again for Future Projects 🏆", sentiment: "positive", keywords: ["will hire again", "saved to contacts"] }
        ]
      }
    ]
  }
};

// Aliases for compatibility with scraped strings or URL tags
export const CATEGORY_ALIASES: Record<string, string> = {
  // Restaurant & Cafe aliases
  "RESTAURANT_CAFE": "RESTAURANT",
  "FOOD": "RESTAURANT",
  "BISTRO": "RESTAURANT",
  "FINE_DINING": "RESTAURANT",
  "COFFEE": "CAFE",
  "COFFEE_SHOP": "CAFE",
  "BAKERY": "CAFE",
  
  // Medical & Clinic aliases
  "CLINIC_HEALTHCARE": "DOCTOR_CLINIC",
  "DOCTOR": "DOCTOR_CLINIC",
  "NORMAL_DOCTOR": "DOCTOR_CLINIC",
  "PHYSICIAN": "DOCTOR_CLINIC",
  "CLINIC": "DOCTOR_CLINIC",
  "HEALTHCARE": "DOCTOR_CLINIC",
  "HOSPITAL": "DOCTOR_CLINIC",

  // Dentist aliases
  "DENTAL": "DENTIST",
  "DENTAL_CLINIC": "DENTIST",
  "ORTHODONTIST": "DENTIST",

  // Hotel aliases
  "HOTEL_HOSPITALITY": "LUXURY_HOTEL",
  "HOTEL": "LUXURY_HOTEL",
  "RESORT": "LUXURY_HOTEL",
  "LUXURY_HOTELS": "LUXURY_HOTEL",

  // Salon & Spa aliases
  "SALON": "SALON_SPA",
  "SPA": "SALON_SPA",
  "BEAUTY": "SALON_SPA",
  "HAIR": "SALON_SPA",
  "BARBER": "SALON_SPA",

  // Gym aliases
  "FITNESS": "GYM",
  "GYM_FITNESS": "GYM",
  "CROSSFIT": "GYM",
  "YOGA": "GYM",

  // Auto aliases
  "AUTO": "AUTO_REPAIR",
  "MECHANIC": "AUTO_REPAIR",
  "CAR_REPAIR": "AUTO_REPAIR",
  "GARAGE": "AUTO_REPAIR"
};

/**
 * Resolves any category string (e.g. from cold email or Google scrape)
 * to a canonical category configuration.
 */
export function resolveCategoryKey(rawCategory?: string | null): string {
  if (!rawCategory) return "GENERAL_SERVICES";
  const upper = rawCategory.toUpperCase().trim().replace(/[\s-]+/g, "_");
  if (INDUSTRY_QUESTION_POOLS[upper]) return upper;
  if (CATEGORY_ALIASES[upper]) return CATEGORY_ALIASES[upper];
  
  // Substring search
  if (upper.includes("DENT")) return "DENTIST";
  if (upper.includes("COFFEE") || upper.includes("CAFE") || upper.includes("BAKER")) return "CAFE";
  if (upper.includes("RESTAU") || upper.includes("BISTRO") || upper.includes("DIN")) return "RESTAURANT";
  if (upper.includes("HOTEL") || upper.includes("RESORT")) return "LUXURY_HOTEL";
  if (upper.includes("DOCTOR") || upper.includes("CLINIC") || upper.includes("HEALTH") || upper.includes("MED")) return "DOCTOR_CLINIC";
  if (upper.includes("SALON") || upper.includes("SPA") || upper.includes("BEAUTY") || upper.includes("HAIR")) return "SALON_SPA";
  if (upper.includes("GYM") || upper.includes("FIT")) return "GYM";
  if (upper.includes("AUTO") || upper.includes("MECHANIC") || upper.includes("TIRE") || upper.includes("CAR")) return "AUTO_REPAIR";

  return "GENERAL_SERVICES";
}

/**
 * Returns 4 balanced, randomized questions for a given industry.
 * Crucial feature: It picks questions from DIFFERENT sub-categories
 * (e.g. 1 from Care, 1 from Hygiene, 1 from Wait Time, 1 from Results)
 * so every customer gets a comprehensive, diverse review draft.
 */
export function getRandomQuestionsForCategory(categoryKey: string, count: number = 4): PoolQuestion[] {
  const canonicalKey = resolveCategoryKey(categoryKey);
  const industry = INDUSTRY_QUESTION_POOLS[canonicalKey] || INDUSTRY_QUESTION_POOLS.GENERAL_SERVICES;
  const questions = industry.questions;

  // Group questions by subcategory
  const byCategory: Record<string, PoolQuestion[]> = {};
  for (const q of questions) {
    const cat = q.category || "general";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  }

  const categoryKeys = Object.keys(byCategory);
  // Shuffle categories
  for (let i = categoryKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [categoryKeys[i], categoryKeys[j]] = [categoryKeys[j], categoryKeys[i]];
  }

  const selected: PoolQuestion[] = [];

  // Pick 1 random question from each distinct category first
  for (const catKey of categoryKeys) {
    if (selected.length >= count) break;
    const catQuestions = byCategory[catKey];
    if (catQuestions && catQuestions.length > 0) {
      const randomIdx = Math.floor(Math.random() * catQuestions.length);
      selected.push(catQuestions[randomIdx]);
    }
  }

  // If we still need more, fill from remaining
  if (selected.length < count) {
    const remaining = questions.filter(q => !selected.some(s => s.id === q.id));
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    while (selected.length < count && remaining.length > 0) {
      selected.push(remaining.pop()!);
    }
  }

  return selected;
}
