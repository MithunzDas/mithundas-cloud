export interface QuestionOption {
  label: string;
  sentiment: "positive" | "neutral";
  keywords: string[];
}

export interface PoolQuestion {
  id: string;
  category: string;
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
      {
        id: "d1",
        category: "doctor_care",
        question: "How was the doctor's care and gentleness?",
        options: [
          { label: "Super Gentle & Painless 😊", sentiment: "positive", keywords: ["gentle", "painless", "caring"] },
          { label: "Very Thorough & Explained Well 👨‍⚕️", sentiment: "positive", keywords: ["thorough", "explained clearly", "informative"] },
          { label: "Calmed My Dental Anxiety 🌿", sentiment: "positive", keywords: ["reassuring", "calming", "friendly"] },
          { label: "Quick & Efficient ⚡", sentiment: "positive", keywords: ["fast", "efficient"] }
        ]
      },
      {
        id: "d2",
        category: "clinic_hygiene",
        question: "How was the clinic's hygiene and modern setup?",
        options: [
          { label: "Spotless & High-Tech ✨", sentiment: "positive", keywords: ["immaculate", "state of the art", "high-tech"] },
          { label: "Very Clean & Organized 🧼", sentiment: "positive", keywords: ["clean", "well-kept", "sanitized"] },
          { label: "Relaxing & Comfortable 🛋️", sentiment: "positive", keywords: ["peaceful", "comfortable vibe"] }
        ]
      },
      {
        id: "d3",
        category: "wait_time",
        question: "How was your appointment timing?",
        options: [
          { label: "Seen Right on Time ⏱️", sentiment: "positive", keywords: ["on time", "no waiting"] },
          { label: "Under 5-10 Minutes Wait 👍", sentiment: "positive", keywords: ["prompt", "minimal wait"] },
          { label: "Smooth & Quick Check-in 📋", sentiment: "positive", keywords: ["seamless reception", "fast check-in"] }
        ]
      },
      {
        id: "d4",
        category: "staff",
        question: "How was the front-desk and support staff?",
        options: [
          { label: "Warm, Welcoming & Friendly 🤗", sentiment: "positive", keywords: ["polite staff", "warm reception"] },
          { label: "Helpful with Billing & Insurance 💳", sentiment: "positive", keywords: ["clear billing", "helpful with paperwork"] },
          { label: "Professional & Courteous 👔", sentiment: "positive", keywords: ["respectful", "professional staff"] }
        ]
      },
      {
        id: "d5",
        category: "treatment_result",
        question: "How are you feeling after your visit?",
        options: [
          { label: "Teeth Feel Fresh & Clean 😁", sentiment: "positive", keywords: ["great cleaning", "teeth feel great"] },
          { label: "Completely Pain-Free Relief 🛡️", sentiment: "positive", keywords: ["pain gone", "relief", "comfortable treatment"] },
          { label: "Thrilled with My Smile Makeover ✨", sentiment: "positive", keywords: ["confident smile", "excellent result"] },
          { label: "Ready for My Next Checkup 📅", sentiment: "positive", keywords: ["will definitely return", "found my family dentist"] }
        ]
      },
      {
        id: "d6",
        category: "pricing_value",
        question: "How would you rate the transparency and value?",
        options: [
          { label: "Clear Pricing, No Hidden Fees 💯", sentiment: "positive", keywords: ["honest pricing", "transparent"] },
          { label: "Great Value for Quality Care 💎", sentiment: "positive", keywords: ["worth every penny", "fair cost"] }
        ]
      }
    ]
  },

  SALON_SPA: {
    id: "SALON_SPA",
    name: "Hair Salon, Spa & Beauty",
    icon: "💇‍♀️",
    defaultPlaceHolder: "Glow & Co. Salon",
    sampleReview: "Hands down the best haircut and styling experience! The stylist listened to exactly what I wanted, and the scalp massage was heavenly. Left feeling completely refreshed! 💇‍♀️✨",
    questions: [
      {
        id: "s1",
        category: "stylist_skill",
        question: "How was your stylist / aesthetician?",
        options: [
          { label: "Nailed the Exact Look I Wanted 🎯", sentiment: "positive", keywords: ["listened carefully", "perfect haircut", "exact style"] },
          { label: "Master of Color & Technique 🎨", sentiment: "positive", keywords: ["expert colorist", "skilled technician"] },
          { label: "Super Creative & Gave Great Advice 💡", sentiment: "positive", keywords: ["great suggestions", "flattering style"] },
          { label: "Attentive & Meticulous ✂️", sentiment: "positive", keywords: ["detail-oriented", "gentle touch"] }
        ]
      },
      {
        id: "s2",
        category: "ambiance",
        question: "How was the salon ambiance and vibe?",
        options: [
          { label: "Luxurious & Relaxing Oasis 🕯️", sentiment: "positive", keywords: ["pampered", "peaceful music", "luxurious vibe"] },
          { label: "Vibrant, Chic & Aesthetic 📸", sentiment: "positive", keywords: ["trendy interior", "modern aesthetics"] },
          { label: "Spotlessly Clean & Fresh 🧼", sentiment: "positive", keywords: ["clean chairs", "sanitized tools"] }
        ]
      },
      {
        id: "s3",
        category: "service_extras",
        question: "Did you enjoy the extra touches?",
        options: [
          { label: "Divine Scalp Massage & Wash 💆‍♀️", sentiment: "positive", keywords: ["amazing head massage", "relaxing wash"] },
          { label: "Complimentary Coffee / Refreshment ☕", sentiment: "positive", keywords: ["nice beverage", "hospitable"] },
          { label: "High-End Premium Products 🧴", sentiment: "positive", keywords: ["salon-grade products", "hair smells amazing"] }
        ]
      },
      {
        id: "s4",
        category: "outcome",
        question: "How do you feel walking out today?",
        options: [
          { label: "Obsessed with the Results! 😍", sentiment: "positive", keywords: ["in love with my hair", "confidence boost"] },
          { label: "Received Compliments Already 💖", sentiment: "positive", keywords: ["getting compliments", "looks stunning"] },
          { label: "Already Booked Next Appointment 📅", sentiment: "positive", keywords: ["loyal client", "will be back"] }
        ]
      }
    ]
  },

  GYM: {
    id: "GYM",
    name: "Gym, Fitness & Crossfit",
    icon: "💪",
    defaultPlaceHolder: "IronPeak Fitness",
    sampleReview: "Top tier gym! High-spec equipment that's never broken, clean locker rooms, and an incredible motivating vibe. The trainers genuinely care about your form and progress. 5 stars! 🔥",
    questions: [
      {
        id: "g1",
        category: "equipment",
        question: "How is the equipment and training floor?",
        options: [
          { label: "Top-Tier, Heavy-Duty Equipment 🏋️‍♂️", sentiment: "positive", keywords: ["hammer strength", "plenty of weights", "modern machines"] },
          { label: "Never Have to Wait for Machines ⚡", sentiment: "positive", keywords: ["well spaced", "multiple squat racks", "no bottlenecks"] },
          { label: "Great Functional / Turf Area 🏃", sentiment: "positive", keywords: ["calisthenics", "sled turf", "kettlebells"] }
        ]
      },
      {
        id: "g2",
        category: "cleanliness",
        question: "How clean are the facilities and locker rooms?",
        options: [
          { label: "Locker Rooms & Showers are Spotless 🚿", sentiment: "positive", keywords: ["pristine showers", "clean lockers"] },
          { label: "Wipes & Sanitizers Everywhere 🧴", sentiment: "positive", keywords: ["well maintained", "hygienic workout environment"] },
          { label: "Good Air Flow & AC ❄️", sentiment: "positive", keywords: ["great ventilation", "not stuffy"] }
        ]
      },
      {
        id: "g3",
        category: "atmosphere",
        question: "How is the community and gym vibe?",
        options: [
          { label: "Electrifying & Motivating Energy 🔥", sentiment: "positive", keywords: ["inspiring crowd", "great music playlist", "high energy"] },
          { label: "Welcoming & Judgment-Free 🤝", sentiment: "positive", keywords: ["inclusive", "beginner friendly", "respectful members"] },
          { label: "Knowledgeable, Supportive Trainers 🎯", sentiment: "positive", keywords: ["helpful coaches", "correct form guidance"] }
        ]
      },
      {
        id: "g4",
        category: "results",
        question: "Would you recommend this gym to friends?",
        options: [
          { label: "Best Gym in the Area, Hands Down 🏆", sentiment: "positive", keywords: ["best fitness center in town", "elite facility"] },
          { label: "Seen Huge Progress Here 📈", sentiment: "positive", keywords: ["hitting personal records", "achieving fitness goals"] }
        ]
      }
    ]
  },

  RESTAURANT_CAFE: {
    id: "RESTAURANT_CAFE",
    name: "Restaurant, Cafe & Bistro",
    icon: "🍽️",
    defaultPlaceHolder: "The Rustic Olive Bistro",
    sampleReview: "Incredible dinner! The food came out piping hot and full of flavor. Our server was attentive without being pushy, and the cozy ambiance made for a wonderful evening. Definitely coming back! 🍷🍝",
    questions: [
      {
        id: "r1",
        category: "food_quality",
        question: "How was the food flavor and presentation?",
        options: [
          { label: "Bursting with Flavor & Fresh 🍲", sentiment: "positive", keywords: ["fresh ingredients", "delicious flavors", "cooked to perfection"] },
          { label: "Generous Portions & Great Value 🍽️", sentiment: "positive", keywords: ["hearty portions", "fair price"] },
          { label: "Best Dish I've Had in a Long Time ⭐", sentiment: "positive", keywords: ["standout meal", "culinary highlight"] },
          { label: "Beautiful Presentation 📸", sentiment: "positive", keywords: ["instagrammable", "plated artistically"] }
        ]
      },
      {
        id: "r2",
        category: "service",
        question: "How was the table service and hospitality?",
        options: [
          { label: "Fast, Attentive & Warm Service 🛎️", sentiment: "positive", keywords: ["great waitstaff", "fast refills", "polite server"] },
          { label: "Food Came Out Prompt & Hot ⏱️", sentiment: "positive", keywords: ["quick kitchen turnaround", "piping hot"] },
          { label: "Great Recommendations from Server 🍷", sentiment: "positive", keywords: ["spot-on menu recommendation"] }
        ]
      },
      {
        id: "r3",
        category: "ambiance",
        question: "How was the dining ambiance?",
        options: [
          { label: "Cozy, Intimate & Charming 🕯️", sentiment: "positive", keywords: ["romantic vibes", "cozy booth", "great lighting"] },
          { label: "Lively, Fun & Great Music 🎶", sentiment: "positive", keywords: ["vibrant crowd", "fun atmosphere"] },
          { label: "Family & Pet Friendly 🐶", sentiment: "positive", keywords: ["welcoming for kids", "spacious seating"] }
        ]
      },
      {
        id: "r4",
        category: "conclusion",
        question: "Will you be returning or recommending us?",
        options: [
          { label: "Already Craving My Next Visit! 😋", sentiment: "positive", keywords: ["new favorite spot", "will be returning soon"] },
          { label: "Must-Visit for Foodies 🌟", sentiment: "positive", keywords: ["10/10 recommendation", "bring your friends"] }
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
      {
        id: "a1",
        category: "honesty",
        question: "How was the honesty and transparency?",
        options: [
          { label: "100% Honest, No Unnecessary Upselling 🛡️", sentiment: "positive", keywords: ["trustworthy mechanic", "no pushy sales", "upfront quote"] },
          { label: "Clear Explanation of Repairs 📋", sentiment: "positive", keywords: ["showed the old parts", "explained clearly"] },
          { label: "Accurate Estimate & Fair Pricing 💰", sentiment: "positive", keywords: ["exact quote honored", "very fair rates"] }
        ]
      },
      {
        id: "a2",
        category: "speed",
        question: "How was the turnaround time?",
        options: [
          { label: "Ready Same Day / On Schedule ⏱️", sentiment: "positive", keywords: ["completed fast", "ready when promised"] },
          { label: "Quick Diagnosis & Inspection 🔍", sentiment: "positive", keywords: ["pinpointed the problem fast"] }
        ]
      },
      {
        id: "a3",
        category: "quality",
        question: "How is your vehicle driving now?",
        options: [
          { label: "Runs Like New / Problem Solved 🚙", sentiment: "positive", keywords: ["problem fixed", "drives smooth", "noise is gone"] },
          { label: "Car Returned Clean & Tidy ✨", sentiment: "positive", keywords: ["seat covers used", "clean steering wheel"] }
        ]
      }
    ]
  },

  CLINIC_HEALTHCARE: {
    id: "CLINIC_HEALTHCARE",
    name: "Medical Clinic, Physio & Wellness",
    icon: "🩺",
    defaultPlaceHolder: "Harborview Health & Physio",
    sampleReview: "Exceptional care from start to finish. The doctor listened patiently, diagnosed the root cause, and developed a treatment plan that actually brought relief. Extremely grateful! 🙏",
    questions: [
      {
        id: "c1",
        category: "practitioner",
        question: "How was the doctor or practitioner?",
        options: [
          { label: "Listened Patiently & Never Rushed 👂", sentiment: "positive", keywords: ["attentive listener", "compassionate doctor", "took time"] },
          { label: "Extremely Knowledgeable & Thorough 🩺", sentiment: "positive", keywords: ["expert physician", "accurate diagnosis"] },
          { label: "Gentle Hands & Great Bedside Manner 🤝", sentiment: "positive", keywords: ["gentle examination", "reassuring bedside manner"] }
        ]
      },
      {
        id: "c2",
        category: "facility",
        question: "How was the clinic environment?",
        options: [
          { label: "Clean, Modern & Calm 🏥", sentiment: "positive", keywords: ["peaceful clinic", "sanitary standards"] },
          { label: "Quick Check-in & Little Wait ⏱️", sentiment: "positive", keywords: ["on-schedule appointments", "courteous receptionist"] }
        ]
      },
      {
        id: "c3",
        category: "outcome",
        question: "How is your health or recovery progressing?",
        options: [
          { label: "Feeling Much Better & Relieved 🌟", sentiment: "positive", keywords: ["significant improvement", "pain reduced"] },
          { label: "Clear Treatment & Recovery Plan 📝", sentiment: "positive", keywords: ["actionable recovery steps", "peace of mind"] }
        ]
      }
    ]
  },

  HOTEL_HOSPITALITY: {
    id: "HOTEL_HOSPITALITY",
    name: "Hotel, Resort & Hospitality",
    icon: "🏨",
    defaultPlaceHolder: "Grand Horizon Hotel & Suites",
    sampleReview: "Exceptional stay from start to finish! The room was spotless with a stunning view, the staff went above and beyond with check-in, and the breakfast buffet was delicious. Will definitely return! 🏨✨",
    questions: [
      {
        id: "h1",
        category: "room_comfort",
        question: "How was your room cleanliness and comfort?",
        options: [
          { label: "Spotless, Modern & Luxurious 🛏️", sentiment: "positive", keywords: ["luxurious bed", "immaculate room", "spacious"] },
          { label: "Super Comfy Bed & Quiet 💤", sentiment: "positive", keywords: ["peaceful sleep", "very quiet", "restful night"] },
          { label: "Breathtaking Views 🌅", sentiment: "positive", keywords: ["stunning skyline view", "great balcony view"] }
        ]
      },
      {
        id: "h2",
        category: "service",
        question: "How was the staff hospitality and front desk?",
        options: [
          { label: "Warm, Welcoming & Attentive 🛎️", sentiment: "positive", keywords: ["front desk was fantastic", "concierge helped us", "warm hospitality"] },
          { label: "Seamless Check-in / Check-out ⏱️", sentiment: "positive", keywords: ["fast check-in", "zero hassle"] },
          { label: "Went Above & Beyond 🌟", sentiment: "positive", keywords: ["thoughtful staff", "felt like royalty"] }
        ]
      },
      {
        id: "h3",
        category: "amenities",
        question: "How were the dining & hotel amenities?",
        options: [
          { label: "Delicious Breakfast & Dining ☕🍳", sentiment: "positive", keywords: ["lavish breakfast spread", "superb room service", "fine dining"] },
          { label: "Gorgeous Pool & Facilities 🏊", sentiment: "positive", keywords: ["pristine pool", "great gym facilities"] },
          { label: "Prime, Convenient Location 📍", sentiment: "positive", keywords: ["close to everything", "perfect central spot"] }
        ]
      },
      {
        id: "h4",
        category: "overall",
        question: "Would you stay here again or recommend to others?",
        options: [
          { label: "10/10 Experience, Will Return! 🏆", sentiment: "positive", keywords: ["best hotel stay", "already booking next trip"] },
          { label: "Highly Recommended for Everyone ⭐", sentiment: "positive", keywords: ["worth every penny", "top-tier hospitality"] }
        ]
      }
    ]
  },

  GENERAL_SERVICES: {
    id: "GENERAL_SERVICES",
    name: "Local Service / Trade / Professional",
    icon: "⭐",
    defaultPlaceHolder: "Metro Pro Services",
    sampleReview: "Prompt, professional, and reliable! Arrived on time, completed the work with high craftsmanship, and left everything clean. Would not hesitate to recommend to friends and family! 👍",
    questions: [
      {
        id: "gen1",
        category: "punctuality",
        question: "How was the punctuality and communication?",
        options: [
          { label: "Arrived Exactly On Time ⏱️", sentiment: "positive", keywords: ["punctual", "on schedule"] },
          { label: "Clear, Responsive Communication 📱", sentiment: "positive", keywords: ["quick replies", "kept me updated"] },
          { label: "Friendly & Respectful 🤝", sentiment: "positive", keywords: ["courteous", "respectful of property"] }
        ]
      },
      {
        id: "gen2",
        category: "workmanship",
        question: "How was the quality of work performed?",
        options: [
          { label: "Flawless Craftsmanship & Attention to Detail 🛠️", sentiment: "positive", keywords: ["high quality", "thorough job"] },
          { label: "Quick, Clean & Efficient ⚡", sentiment: "positive", keywords: ["no mess left behind", "tidy workspace"] },
          { label: "Exceeded My Expectations 💯", sentiment: "positive", keywords: ["went above and beyond"] }
        ]
      },
      {
        id: "gen3",
        category: "pricing",
        question: "How was the value and fairness of price?",
        options: [
          { label: "Fair, Transparent Quote Honored 💰", sentiment: "positive", keywords: ["honest pricing", "no surprises"] },
          { label: "High Value for the Price 💎", sentiment: "positive", keywords: ["worth the money", "reasonable rates"] }
        ]
      }
    ]
  }
};

/**
 * Returns 4 to 5 randomly picked questions for a given industry
 * to guarantee no two review sessions share the exact same sequence.
 */
export function getRandomQuestionsForCategory(categoryKey: string, count: number = 4): PoolQuestion[] {
  const industry = INDUSTRY_QUESTION_POOLS[categoryKey] || INDUSTRY_QUESTION_POOLS.GENERAL_SERVICES;
  const questions = [...industry.questions];
  
  // Fisher-Yates shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, Math.min(count, questions.length));
}
