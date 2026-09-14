import { IndustryConfig } from "./types";

export const ENDOCRINE_POOL: IndustryConfig = {
  id: "ENDOCRINE",
  name: "Endocrinology, Thyroid & Diabetes Clinic",
  icon: "🩺",
  defaultPlaceHolder: "Metro Endocrine & Diabetes Center",
  sampleReview: "Outstanding care! The endocrinologist analyzed my glucose logs, adjusted my medication with precision, and my HbA1c is now at an all-time best. Truly listens to patients and never rushes. Highly recommend! ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "endo_dia_01",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "How thoroughly did the endocrinologist review your HbA1c and glucose trends?",
    "options": [
      {
        "label": "Analyzed Full Blood Sugar Logs & Trends 📈",
        "sentiment": "positive",
        "keywords": [
          "thorough hba1c review",
          "detailed glucose logs analysis",
          "expert endocrinologist"
        ]
      },
      {
        "label": "Adjusted Medication for Steady Blood Sugar 🎯",
        "sentiment": "positive",
        "keywords": [
          "balanced insulin dosing",
          "optimal blood sugar control"
        ]
      },
      {
        "label": "Explained How to Prevent Sudden Spikes 🛡️",
        "sentiment": "positive",
        "keywords": [
          "glucose spike prevention",
          "effective diabetes care"
        ]
      },
      {
        "label": "Celebrated My Improved HbA1c Milestone! 🎉",
        "sentiment": "positive",
        "keywords": [
          "lower hba1c",
          "encouraging doctor"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_02",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "Did the specialist guide you on Continuous Glucose Monitoring (CGM) or testing devices?",
    "options": [
      {
        "label": "Set Up CGM Sensor with Clear Instructions 📲",
        "sentiment": "positive",
        "keywords": [
          "cgm sensor guidance",
          "freestyle libre expert",
          "dexcom guidance"
        ]
      },
      {
        "label": "Made Glucose Tracking Simple & Painless 🪶",
        "sentiment": "positive",
        "keywords": [
          "easy blood sugar monitoring",
          "modern diabetes tech"
        ]
      },
      {
        "label": "Taught Me How to Interpret CGM Graphs 📊",
        "sentiment": "positive",
        "keywords": [
          "cgm data interpretation",
          "time in range guidance"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_03",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "How was the guidance on preventing hypoglycemia (low blood sugar)?",
    "options": [
      {
        "label": "Clear Safety Plan for Low Blood Sugar 🚨",
        "sentiment": "positive",
        "keywords": [
          "hypoglycemia prevention plan",
          "safe diabetes management"
        ]
      },
      {
        "label": "Taught My Family Warning Signs to Watch For 👨‍👩‍👧",
        "sentiment": "positive",
        "keywords": [
          "family diabetes education",
          "hypoglycemia awareness"
        ]
      },
      {
        "label": "Fine-Tuned Dosages to Prevent Sudden Drops ⚖️",
        "sentiment": "positive",
        "keywords": [
          "prevented low sugar drops",
          "precise medication dosing"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_04",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "Did the clinic perform comprehensive diabetic preventive health checks?",
    "options": [
      {
        "label": "Checked Feet, Pulses & Nerve Reflexes 🦶",
        "sentiment": "positive",
        "keywords": [
          "diabetic foot check",
          "neuropathy prevention"
        ]
      },
      {
        "label": "Monitored Kidney & Urine Albumin Markers 🧪",
        "sentiment": "positive",
        "keywords": [
          "kidney health monitoring",
          "diabetic kidney protection"
        ]
      },
      {
        "label": "Coordinated Annual Eye & Retina Screenings 👁️",
        "sentiment": "positive",
        "keywords": [
          "diabetic retinopathy screening",
          "comprehensive care"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_05",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "How personalized was your insulin or oral medication plan?",
    "options": [
      {
        "label": "Tailored Specifically to My Daily Routine ⏰",
        "sentiment": "positive",
        "keywords": [
          "personalized diabetes plan",
          "fits my work schedule"
        ]
      },
      {
        "label": "Reduced My Overall Pill Burden Safely 💊",
        "sentiment": "positive",
        "keywords": [
          "simplified medication regimen",
          "smart prescribing"
        ]
      },
      {
        "label": "Targeted Weight-Friendly Diabetes Medications 🌿",
        "sentiment": "positive",
        "keywords": [
          "glp-1 guidance",
          "weight friendly diabetes care"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_06",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "How did you feel about the doctor's approach to pre-diabetes reversal?",
    "options": [
      {
        "label": "Gave Me a Practical Plan to Reverse Pre-Diabetes 🎯",
        "sentiment": "positive",
        "keywords": [
          "reversed pre-diabetes",
          "actionable metabolic plan"
        ]
      },
      {
        "label": "Empowering Motivation Without Judgment 🌟",
        "sentiment": "positive",
        "keywords": [
          "supportive endocrinologist",
          "non-judgmental care"
        ]
      },
      {
        "label": "Normalized My Blood Sugar Naturally 🥗",
        "sentiment": "positive",
        "keywords": [
          "lifestyle blood sugar control",
          "dietary reversal"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_07",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "Did the team explain the relationship between blood pressure, cholesterol, and diabetes?",
    "options": [
      {
        "label": "Thorough Cardiovascular Protection Plan 🫀",
        "sentiment": "positive",
        "keywords": [
          "heart health protection",
          "diabetic cholesterol management"
        ]
      },
      {
        "label": "Explained Lipid Panel & Triglyceride Markers 🔬",
        "sentiment": "positive",
        "keywords": [
          "lipid optimization",
          "comprehensive metabolic health"
        ]
      },
      {
        "label": "Holistic Protection Against Complications 🛡️",
        "sentiment": "positive",
        "keywords": [
          "prevented complications",
          "complete endocrine care"
        ]
      }
    ]
  },
  {
    "id": "endo_dia_08",
    "category": "diabetes_management",
    "categoryLabel": "Diabetes & Blood Sugar Management",
    "question": "How would you rate your overall confidence in managing your diabetes now?",
    "options": [
      {
        "label": "Feel in Complete Control for the First Time 🏆",
        "sentiment": "positive",
        "keywords": [
          "in control of diabetes",
          "empowered patient"
        ]
      },
      {
        "label": "Blood Sugar Stable & Energy is Higher Than Ever ⚡",
        "sentiment": "positive",
        "keywords": [
          "stable blood glucose",
          "high energy"
        ]
      },
      {
        "label": "Best Diabetes Doctor I've Ever Consulted 🌟",
        "sentiment": "positive",
        "keywords": [
          "top diabetes specialist",
          "life-changing endocrinologist"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_01",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "How thoroughly did the doctor investigate your thyroid panels (TSH, Free T3, Free T4, Antibodies)?",
    "options": [
      {
        "label": "Ordered Complete Comprehensive Thyroid Panel 🔬",
        "sentiment": "positive",
        "keywords": [
          "complete thyroid bloodwork",
          "free t3 and free t4 check"
        ]
      },
      {
        "label": "Looked Beyond Standard Normal Ranges 🎯",
        "sentiment": "positive",
        "keywords": [
          "optimal thyroid range",
          "thorough hormone evaluation"
        ]
      },
      {
        "label": "Explained Autoimmune Thyroid Factors (Hashimoto's/Graves) 🛡️",
        "sentiment": "positive",
        "keywords": [
          "hashimotos thyroiditis care",
          "thyroid antibody explanation"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_02",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "Did the specialist address chronic fatigue, brain fog, or sluggish metabolism?",
    "options": [
      {
        "label": "Validated My Symptoms and Took Them Seriously ❤️",
        "sentiment": "positive",
        "keywords": [
          "validated my fatigue",
          "took thyroid symptoms seriously"
        ]
      },
      {
        "label": "Energy & Mental Focus Returned Within Weeks ⚡",
        "sentiment": "positive",
        "keywords": [
          "cured brain fog",
          "restored energy levels"
        ]
      },
      {
        "label": "Metabolism and Body Temperature Regulated 🌡️",
        "sentiment": "positive",
        "keywords": [
          "regulated metabolism",
          "improved body temperature"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_03",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "How precise was your thyroid medication dosing and titration?",
    "options": [
      {
        "label": "Micro-Adjusted Dose to My Exact Needs 💊",
        "sentiment": "positive",
        "keywords": [
          "precise thyroid dosing",
          "levothyroxine optimization"
        ]
      },
      {
        "label": "Explained How to Take Medication for Optimal Absorption 🌅",
        "sentiment": "positive",
        "keywords": [
          "optimal thyroid absorption",
          "morning medication tips"
        ]
      },
      {
        "label": "Felt Like a New Person After Medication Adjustment ✨",
        "sentiment": "positive",
        "keywords": [
          "effective thyroid treatment",
          "symptom resolution"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_04",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "Did the doctor evaluate thyroid nodules or perform ultrasound imaging?",
    "options": [
      {
        "label": "High-Resolution In-Clinic Ultrasound Check 🖥️",
        "sentiment": "positive",
        "keywords": [
          "thyroid ultrasound",
          "clear nodule imaging"
        ]
      },
      {
        "label": "Reassured Me with Clear Nodule Explanations 🌿",
        "sentiment": "positive",
        "keywords": [
          "reassuring nodule review",
          "benign thyroid care"
        ]
      },
      {
        "label": "Gentle, Professional Thyroid Neck Examination 🖐️",
        "sentiment": "positive",
        "keywords": [
          "gentle thyroid exam",
          "expert palpation"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_05",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "How was the doctor's expertise in hormone balance (PCOS, Adrenal, Pituitary, Testosterone)?",
    "options": [
      {
        "label": "Master of Complex Hormone Interactions 🧬",
        "sentiment": "positive",
        "keywords": [
          "hormone specialist",
          "pcos endocrine care",
          "adrenal balance"
        ]
      },
      {
        "label": "Systematic Roadmap for Hormonal Balance 🗺️",
        "sentiment": "positive",
        "keywords": [
          "hormonal balance restoration",
          "expert endocrinology"
        ]
      },
      {
        "label": "Identified the True Root Cause of Hormonal Imbalance 🎯",
        "sentiment": "positive",
        "keywords": [
          "found hormone imbalance cause",
          "targeted therapy"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_06",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "Did the endocrinologist discuss hair loss, skin dryess, or nail health related to hormones?",
    "options": [
      {
        "label": "Hair Shedding Stopped & Skin Restored 🌸",
        "sentiment": "positive",
        "keywords": [
          "stopped hormonal hair loss",
          "restored healthy skin"
        ]
      },
      {
        "label": "Checked Ferritin, Vitamin D & Mineral Cofactors 🧪",
        "sentiment": "positive",
        "keywords": [
          "checked vitamin d and ferritin",
          "complete nutrient panel"
        ]
      },
      {
        "label": "Comprehensive Nutritional Supplement Guidance 💊",
        "sentiment": "positive",
        "keywords": [
          "targeted thyroid supplements",
          "holistic support"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_07",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "How frequently does the doctor recheck lab values during titration?",
    "options": [
      {
        "label": "Checked Labs at Perfect 6-8 Week Intervals 📅",
        "sentiment": "positive",
        "keywords": [
          "timely follow-up labs",
          "attentive monitoring"
        ]
      },
      {
        "label": "Never Left Me on the Wrong Dose for Long ⏱️",
        "sentiment": "positive",
        "keywords": [
          "responsive dose adjustments",
          "diligent endocrinologist"
        ]
      },
      {
        "label": "Prompt Dose Update Immediately After Blood Draw 📲",
        "sentiment": "positive",
        "keywords": [
          "fast lab review",
          "immediate medication update"
        ]
      }
    ]
  },
  {
    "id": "endo_thy_08",
    "category": "thyroid_hormone",
    "categoryLabel": "Thyroid & Hormone Balance",
    "question": "How has your mood, sleep, and overall vitality improved?",
    "options": [
      {
        "label": "Sleeping Deeply & Waking Up Refreshed 💤",
        "sentiment": "positive",
        "keywords": [
          "deep restorative sleep",
          "high vitality"
        ]
      },
      {
        "label": "Mood Swings and Anxiety Cleared Completely 🌈",
        "sentiment": "positive",
        "keywords": [
          "balanced mood",
          "relieved hormonal anxiety"
        ]
      },
      {
        "label": "Feel Balanced, Healthy and Vibrant Again 🌟",
        "sentiment": "positive",
        "keywords": [
          "vibrant health",
          "balanced hormones"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_01",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "Did the endocrinologist give you sufficient time to detail your symptoms?",
    "options": [
      {
        "label": "Generous 1-on-1 Consultation Without Rushing ⏳",
        "sentiment": "positive",
        "keywords": [
          "unrushed endocrine consultation",
          "patient specialist"
        ]
      },
      {
        "label": "Listened to My Entire Health Journey from Day 1 📖",
        "sentiment": "positive",
        "keywords": [
          "heard full medical story",
          "compassionate doctor"
        ]
      },
      {
        "label": "Treated Me as a Partner in My Healthcare 🤝",
        "sentiment": "positive",
        "keywords": [
          "collaborative medical care",
          "respected patient"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_02",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "Did the doctor look at your symptoms and how you feel, not just lab numbers?",
    "options": [
      {
        "label": "Treated the Patient, Not Just the Lab Slip! ❤️",
        "sentiment": "positive",
        "keywords": [
          "treats symptoms not just labs",
          "attentive endocrinologist"
        ]
      },
      {
        "label": "Understood That Normal Labs Don't Mean Optimal Labs 💡",
        "sentiment": "positive",
        "keywords": [
          "optimal health focus",
          "insightful physician"
        ]
      },
      {
        "label": "Truly Believed and Validated My Daily Symptoms 🌟",
        "sentiment": "positive",
        "keywords": [
          "validated chronic symptoms",
          "understanding doctor"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_03",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "How reassuring was the doctor's communication style?",
    "options": [
      {
        "label": "Warm, Reassuring & Relieved My Anxiety 🌿",
        "sentiment": "positive",
        "keywords": [
          "calmed health anxiety",
          "reassuring specialist"
        ]
      },
      {
        "label": "Explained Complex Endocrine Science Simply 🧠",
        "sentiment": "positive",
        "keywords": [
          "clear endocrine explanation",
          "educational doctor"
        ]
      },
      {
        "label": "Inspires Hope and Confidence in Recovery ☀️",
        "sentiment": "positive",
        "keywords": [
          "inspiring physician",
          "optimistic care"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_04",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "Did the specialist welcome and answer your questions?",
    "options": [
      {
        "label": "Welcomed Every Single Question Patiently 💬",
        "sentiment": "positive",
        "keywords": [
          "welcomed questions",
          "patient educator"
        ]
      },
      {
        "label": "Provided Thoughtful, Scientific Explanations 🔬",
        "sentiment": "positive",
        "keywords": [
          "thorough scientific answers",
          "evidence based care"
        ]
      },
      {
        "label": "Never Dismissive of Online Research or Inquiries 📚",
        "sentiment": "positive",
        "keywords": [
          "open minded doctor",
          "respectful discussion"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_05",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "How was the physician's bedside manner during difficult diagnoses?",
    "options": [
      {
        "label": "Incredibly Gentle, Empathetic & Supportive ❤️",
        "sentiment": "positive",
        "keywords": [
          "compassionate bedside manner",
          "supportive in tough moments"
        ]
      },
      {
        "label": "Gave Clear Hope and an Actionable Treatment Plan 🛡️",
        "sentiment": "positive",
        "keywords": [
          "actionable healing plan",
          "encouraging doctor"
        ]
      },
      {
        "label": "Followed Up Personally to Ensure My Comfort 📞",
        "sentiment": "positive",
        "keywords": [
          "personal follow up",
          "exceptional doctor dedication"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_06",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "Did you feel judged about weight, diet or blood sugar readings?",
    "options": [
      {
        "label": "Zero Judgment, 100% Support & Kindness 🌟",
        "sentiment": "positive",
        "keywords": [
          "non-judgmental care",
          "kind endocrinologist"
        ]
      },
      {
        "label": "Understood the Biological Roots of Weight & Hormones 🧬",
        "sentiment": "positive",
        "keywords": [
          "metabolic root cause understanding",
          "compassionate doctor"
        ]
      },
      {
        "label": "Felt Completely Safe and Honest with the Doctor 🛡️",
        "sentiment": "positive",
        "keywords": [
          "safe clinic environment",
          "honest doctor patient relationship"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_07",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "How would you describe the doctor's dedication to your long-term success?",
    "options": [
      {
        "label": "Truly Invested in My Lifelong Health 🏆",
        "sentiment": "positive",
        "keywords": [
          "invested in patient health",
          "dedicated specialist"
        ]
      },
      {
        "label": "Consistently Follows Up on My Progress 📈",
        "sentiment": "positive",
        "keywords": [
          "tracks patient progress",
          "diligent follow-up"
        ]
      },
      {
        "label": "One in a Million Endocrinologist! 💎",
        "sentiment": "positive",
        "keywords": [
          "best endocrinologist",
          "outstanding physician"
        ]
      }
    ]
  },
  {
    "id": "endo_lis_08",
    "category": "doctor_listening",
    "categoryLabel": "Specialist Empathy & Listening",
    "question": "Would you recommend this endocrinology practice to someone with thyroid or diabetes concerns?",
    "options": [
      {
        "label": "100% Yes! Life-Changing Specialist Care 🌟",
        "sentiment": "positive",
        "keywords": [
          "life changing endocrine care",
          "highly recommend endocrinologist"
        ]
      },
      {
        "label": "Already Sent Several Friends and Family Here 👍",
        "sentiment": "positive",
        "keywords": [
          "recommended to friends",
          "trusted diabetes clinic"
        ]
      },
      {
        "label": "The Gold Standard in Endocrine Medicine 🏆",
        "sentiment": "positive",
        "keywords": [
          "gold standard endocrine clinic",
          "5-star diabetes doctor"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_01",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "How practical and sustainable was the nutritional and diet guidance?",
    "options": [
      {
        "label": "Realistic Meal Guidance, No Extreme Starvation 🥗",
        "sentiment": "positive",
        "keywords": [
          "sustainable diabetic meal plan",
          "practical nutrition advice"
        ]
      },
      {
        "label": "Taught Me How to Pair Carbs with Proteins 🥑",
        "sentiment": "positive",
        "keywords": [
          "macronutrient balance",
          "carb pairing tips"
        ]
      },
      {
        "label": "Customized to My Cultural / Family Eating Habits 🍲",
        "sentiment": "positive",
        "keywords": [
          "culturally tailored diet",
          "personalized nutrition"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_02",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "Did the doctor explain the impact of stress and sleep on cortisol and blood sugar?",
    "options": [
      {
        "label": "Connected Sleep Quality to Insulin Sensitivity 💤",
        "sentiment": "positive",
        "keywords": [
          "cortisol and sleep connection",
          "insulin sensitivity improvement"
        ]
      },
      {
        "label": "Provided Practical Stress Management Techniques 🧘",
        "sentiment": "positive",
        "keywords": [
          "stress reduction for blood sugar",
          "holistic wellness"
        ]
      },
      {
        "label": "Helped Me Fix Late Night Sugar Cravings 🌙",
        "sentiment": "positive",
        "keywords": [
          "stopped late night cravings",
          "stable nighttime glucose"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_03",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "How was the exercise and physical activity guidance tailored to your fitness level?",
    "options": [
      {
        "label": "Gentle Walking and Resistance Tips That Fit My Day 🚶",
        "sentiment": "positive",
        "keywords": [
          "post-meal walking advice",
          "attainable exercise goals"
        ]
      },
      {
        "label": "Explained How Resistance Training Improves Glucose Uptake 🏋️",
        "sentiment": "positive",
        "keywords": [
          "strength training for diabetes",
          "muscle glucose uptake"
        ]
      },
      {
        "label": "Encouraged Sustainable Daily Movement Milestones 🎯",
        "sentiment": "positive",
        "keywords": [
          "daily activity habit",
          "supportive fitness advice"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_04",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "Did the clinic provide guidance on modern weight management and metabolic health?",
    "options": [
      {
        "label": "Evidence-Based Metabolic Weight Loss Strategy ⚖️",
        "sentiment": "positive",
        "keywords": [
          "metabolic weight management",
          "scientific weight loss"
        ]
      },
      {
        "label": "Helped Me Shed Stubborn Weight Safely 📉",
        "sentiment": "positive",
        "keywords": [
          "safe endocrine weight loss",
          "metabolic reset"
        ]
      },
      {
        "label": "Preserved Lean Muscle Mass While Losing Fat 💪",
        "sentiment": "positive",
        "keywords": [
          "muscle preservation",
          "healthy body composition"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_05",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "Did you receive helpful diabetes-friendly recipes or grocery shopping tips?",
    "options": [
      {
        "label": "Great Grocery Shopping Guide with Brand Swaps 🛒",
        "sentiment": "positive",
        "keywords": [
          "healthy grocery guide",
          "low glycemic food swaps"
        ]
      },
      {
        "label": "Delicious Low-Glycemic Recipe Ideas 🍳",
        "sentiment": "positive",
        "keywords": [
          "diabetic friendly recipes",
          "delicious meals"
        ]
      },
      {
        "label": "Clear Guide on Reading Nutrition Labels 🏷️",
        "sentiment": "positive",
        "keywords": [
          "nutrition label reading",
          "smart food choices"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_06",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "How was the guidance regarding dining out at restaurants?",
    "options": [
      {
        "label": "Showed Me How to Enjoy Dining Out Without Sugar Spikes 🍽️",
        "sentiment": "positive",
        "keywords": [
          "dining out with diabetes",
          "restaurant blood sugar control"
        ]
      },
      {
        "label": "Practical Menu Ordering Strategies 📋",
        "sentiment": "positive",
        "keywords": [
          "smart restaurant choices",
          "healthy eating out"
        ]
      },
      {
        "label": "No Deprivation, Just Smart Nutritional Balance ✨",
        "sentiment": "positive",
        "keywords": [
          "flexible diabetic lifestyle",
          "balanced enjoyment"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_07",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "How encouraging was the specialist when discussing your progress?",
    "options": [
      {
        "label": "Celebrated Every Small Victory with Me 🎉",
        "sentiment": "positive",
        "keywords": [
          "encouraging specialist",
          "celebrated health milestones"
        ]
      },
      {
        "label": "Constructive Problem-Solving When Blood Sugar Fluctuate 💡",
        "sentiment": "positive",
        "keywords": [
          "constructive problem solving",
          "supportive doctor"
        ]
      },
      {
        "label": "Kept Me Motivated to Stay on Track 🚀",
        "sentiment": "positive",
        "keywords": [
          "motivating physician",
          "inspired healthy habits"
        ]
      }
    ]
  },
  {
    "id": "endo_nut_08",
    "category": "lifestyle_diet",
    "categoryLabel": "Lifestyle & Nutrition Guidance",
    "question": "Have you noticed sustainable, lasting improvements in your lifestyle?",
    "options": [
      {
        "label": "Built Lifelong Healthy Habits Effortlessly 🌿",
        "sentiment": "positive",
        "keywords": [
          "sustainable habits",
          "lifelong wellness"
        ]
      },
      {
        "label": "Energy, Vitality and Mood are at an All-Time High ⚡",
        "sentiment": "positive",
        "keywords": [
          "abundant energy",
          "improved vitality"
        ]
      },
      {
        "label": "Healthiest I've Felt in Over a Decade! 🏆",
        "sentiment": "positive",
        "keywords": [
          "optimal health achieved",
          "life changing endocrine clinic"
        ]
      }
    ]
  },
  {
    "id": "endo_lab_01",
    "category": "lab_diagnostics",
    "categoryLabel": "Lab Testing & Diagnostics",
    "question": "How was the blood draw experience for your endocrine panels?",
    "options": [
      {
        "label": "Gentle Phlebotomist, Barely Felt the Needle 🪶",
        "sentiment": "positive",
        "keywords": [
          "gentle blood draw",
          "painless phlebotomist"
        ]
      },
      {
        "label": "Quick Blood Collection with Zero Bruising 👍",
        "sentiment": "positive",
        "keywords": [
          "quick blood draw",
          "no bruising"
        ]
      },
      {
        "label": "Calm & Sterile Blood Collection Room 🏥",
        "sentiment": "positive",
        "keywords": [
          "sterile lab room",
          "clean phlebotomy"
        ]
      }
    ]
  },
  {
    "id": "endo_lab_02",
    "category": "lab_diagnostics",
    "categoryLabel": "Lab Testing & Diagnostics",
    "question": "How fast did you receive your hormone and HbA1c lab reports?",
    "options": [
      {
        "label": "Rapid Same-Day / Next-Day Lab Results ⚡",
        "sentiment": "positive",
        "keywords": [
          "fast lab results",
          "same day hba1c"
        ]
      },
      {
        "label": "Instant Access via Patient Portal 📲",
        "sentiment": "positive",
        "keywords": [
          "digital portal access",
          "instant lab notification"
        ]
      },
      {
        "label": "Doctor Promptly Reviewed Results with Me 📞",
        "sentiment": "positive",
        "keywords": [
          "prompt lab review",
          "attentive follow-up"
        ]
      }
    ]
  },
  {
    "id": "endo_lab_03",
    "category": "lab_diagnostics",
    "categoryLabel": "Lab Testing & Diagnostics",
    "question": "How clearly did the doctor explain your lab numbers and graphs?",
    "options": [
      {
        "label": "Walked Through Every Single Marker in Plain Terms 💡",
        "sentiment": "positive",
        "keywords": [
          "explained lab markers clearly",
          "educational doctor"
        ]
      },
      {
        "label": "Compared Current Results to Past Trends Graphically 📊",
        "sentiment": "positive",
        "keywords": [
          "trend comparison graphs",
          "clear visual data"
        ]
      },
      {
        "label": "Made Confusing Hormone Panels Super Clear 🧠",
        "sentiment": "positive",
        "keywords": [
          "demystified lab results",
          "reassuring explanation"
        ]
      }
    ]
  },
  {
    "id": "endo_lab_04",
    "category": "lab_diagnostics",
    "categoryLabel": "Lab Testing & Diagnostics",
    "question": "Was the lab pricing and insurance coverage transparent?",
    "options": [
      {
        "label": "Clear Upfront Costs with In-Network Lab Billing 💵",
        "sentiment": "positive",
        "keywords": [
          "transparent lab pricing",
          "in-network lab coverage"
        ]
      },
      {
        "label": "No Surprise Invoices for Complex Hormone Tests 🛡️",
        "sentiment": "positive",
        "keywords": [
          "no unexpected lab bills",
          "honest pricing"
        ]
      },
      {
        "label": "Great Value for In-Depth Diagnostic Workup 💎",
        "sentiment": "positive",
        "keywords": [
          "fair diagnostic cost",
          "comprehensive lab testing"
        ]
      }
    ]
  },
  {
    "id": "endo_sup_01",
    "category": "longterm_support",
    "categoryLabel": "Long-Term Support & Accessibility",
    "question": "How accessible is the clinic between appointments for urgent questions?",
    "options": [
      {
        "label": "Quick Portal / WhatsApp Reply from the Nurse or Doctor 💬",
        "sentiment": "positive",
        "keywords": [
          "responsive between visits",
          "quick message replies"
        ]
      },
      {
        "label": "Fast Medication Dosage Advice When Needed ⚡",
        "sentiment": "positive",
        "keywords": [
          "fast dosage clarification",
          "accessible specialist"
        ]
      },
      {
        "label": "Never Felt Left in the Dark Between Visits 🌟",
        "sentiment": "positive",
        "keywords": [
          "continuous patient support",
          "reassuring clinic"
        ]
      }
    ]
  },
  {
    "id": "endo_sup_02",
    "category": "longterm_support",
    "categoryLabel": "Long-Term Support & Accessibility",
    "question": "How smooth are prescription refills for insulin, thyroid pills or CGM sensors?",
    "options": [
      {
        "label": "Electronic Refill Sent to Pharmacy in Minutes 📲",
        "sentiment": "positive",
        "keywords": [
          "instant pharmacy refill",
          "seamless prescription renewal"
        ]
      },
      {
        "label": "Staff Handled Prior Authorizations Effortlessly 🛡️",
        "sentiment": "positive",
        "keywords": [
          "prior authorization handled",
          "hassle-free insurance approval"
        ]
      },
      {
        "label": "Never Ran Out of Critical Hormone Medication 💊",
        "sentiment": "positive",
        "keywords": [
          "reliable medication support",
          "dependable clinic"
        ]
      }
    ]
  },
  {
    "id": "endo_sup_03",
    "category": "longterm_support",
    "categoryLabel": "Long-Term Support & Accessibility",
    "question": "How easy is booking your recurring quarterly or annual reviews?",
    "options": [
      {
        "label": "Scheduled Advance Slots at Checkout with Ease 📅",
        "sentiment": "positive",
        "keywords": [
          "advance appointment booking",
          "smooth scheduling"
        ]
      },
      {
        "label": "Convenient Telehealth Options for Routine Reviews 💻",
        "sentiment": "positive",
        "keywords": [
          "virtual endocrine follow up",
          "convenient telehealth"
        ]
      },
      {
        "label": "Friendly Automated Reminders Before Follow-Ups 🔔",
        "sentiment": "positive",
        "keywords": [
          "timely follow up reminders",
          "organized clinic"
        ]
      }
    ]
  },
  {
    "id": "endo_sup_04",
    "category": "longterm_support",
    "categoryLabel": "Long-Term Support & Accessibility",
    "question": "Overall, how has this clinic impacted your health and quality of life?",
    "options": [
      {
        "label": "Completely Transformed My Health and Vitality! 🏆",
        "sentiment": "positive",
        "keywords": [
          "transformed my health",
          "best endocrine clinic"
        ]
      },
      {
        "label": "Blood Sugar and Hormones Finally in Balance ⚖️",
        "sentiment": "positive",
        "keywords": [
          "hormones in balance",
          "stable blood sugar"
        ]
      },
      {
        "label": "Gave Me My Life Back — 5 Stars All the Way! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "gave me my life back",
          "5 star endocrinologist"
        ]
      }
    ]
  }
]
};
