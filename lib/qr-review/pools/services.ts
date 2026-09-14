import { IndustryConfig } from "./types";

export const SERVICES_POOL: IndustryConfig = {
  id: "GENERAL_SERVICES",
  name: "Home Services, Trade & Professional",
  icon: "🛠️",
  defaultPlaceHolder: "ProCraft Home & Trade Services",
  sampleReview: "Outstanding service from start to finish! The technician arrived on time, wore booties in the house, diagnosed the issue within minutes, and explained the upfront price clearly. Solved the problem on the first visit and left the area spotless. 5 stars! ⭐⭐⭐⭐⭐",
  questions: [
  {
    "id": "srv_qlt_01",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "How was the quality of the repair, trade work, or installation performed?",
    "options": [
      {
        "label": "Flawless Craftsmanship! Solved on the First Visit 🏆",
        "sentiment": "positive",
        "keywords": [
          "flawless workmanship",
          "fixed right the first time",
          "master technician"
        ]
      },
      {
        "label": "Solid, Durable & Built Strictly to Code 🛡️",
        "sentiment": "positive",
        "keywords": [
          "built to code",
          "durable installation",
          "high quality materials"
        ]
      },
      {
        "label": "Meticulous Attention to Every Single Detail 🔍",
        "sentiment": "positive",
        "keywords": [
          "meticulous trade craftsmanship",
          "precision trade work"
        ]
      },
      {
        "label": "Everything Operates Smoothly and Effortlessly ⚙️",
        "sentiment": "positive",
        "keywords": [
          "everything functions smoothly",
          "expert installation"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_02",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "Did the technician use high-grade commercial materials and tools?",
    "options": [
      {
        "label": "Heavy-Duty, Premium Brand Materials Installed 🔩",
        "sentiment": "positive",
        "keywords": [
          "premium materials used",
          "top quality hardware"
        ]
      },
      {
        "label": "Commercial-Grade Tools for a Clean, Tight Finish 🧰",
        "sentiment": "positive",
        "keywords": [
          "professional grade tools",
          "clean workmanship"
        ]
      },
      {
        "label": "No Cheap Shortcuts Taken Anywhere 🛡️",
        "sentiment": "positive",
        "keywords": [
          "no shortcuts taken",
          "built to last"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_03",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "How was the troubleshooting capability of the service technician?",
    "options": [
      {
        "label": "Pinpointed the Root Cause Within Minutes 🎯",
        "sentiment": "positive",
        "keywords": [
          "diagnosed root cause quickly",
          "expert troubleshooting"
        ]
      },
      {
        "label": "Fixed a Persistent Issue Previous Contractors Couldn't 💡",
        "sentiment": "positive",
        "keywords": [
          "fixed stubborn problem",
          "skilled contractor"
        ]
      },
      {
        "label": "Clear, Knowledgeable Diagnostic Method 🧠",
        "sentiment": "positive",
        "keywords": [
          "systematic diagnosis",
          "highly knowledgeable technician"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_04",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "Did the professional test and demonstrate the completed work before leaving?",
    "options": [
      {
        "label": "Thoroughly Tested System Multiple Times in Front of Me 🔄",
        "sentiment": "positive",
        "keywords": [
          "rigorous testing",
          "verified operation before leaving"
        ]
      },
      {
        "label": "Walked Me Through How to Operate Controls & Thermostat 📱",
        "sentiment": "positive",
        "keywords": [
          "explained how to operate",
          "educational technician"
        ]
      },
      {
        "label": "Left Me 100% Confident in the Final Result 🌟",
        "sentiment": "positive",
        "keywords": [
          "confident in work",
          "peace of mind"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_05",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "How was the aesthetic and visual finish of the project?",
    "options": [
      {
        "label": "Seamless, Clean Lines That Blend with the Home 🏡",
        "sentiment": "positive",
        "keywords": [
          "clean visual finish",
          "blends with home aesthetic"
        ]
      },
      {
        "label": "Straight Pipework, Clean Wiring & Tidy Panels ⚡",
        "sentiment": "positive",
        "keywords": [
          "tidy wiring",
          "straight clean pipework"
        ]
      },
      {
        "label": "Looks Like It Was Done by a True Master Artisan 🎨",
        "sentiment": "positive",
        "keywords": [
          "true artisan quality",
          "proud craftsmanship"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_06",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "Was a written warranty or satisfaction guarantee provided?",
    "options": [
      {
        "label": "Comprehensive Warranty on Both Labor & Parts 🛡️",
        "sentiment": "positive",
        "keywords": [
          "full warranty on labor and parts",
          "backed by guarantee"
        ]
      },
      {
        "label": "Stood Behind Their Work 100% 📜",
        "sentiment": "positive",
        "keywords": [
          "stands behind work",
          "guaranteed satisfaction"
        ]
      },
      {
        "label": "Clear Written Documentation Provided 📑",
        "sentiment": "positive",
        "keywords": [
          "written warranty certificate",
          "reputable company"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_07",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "How well did the equipment / installation perform in the following weeks?",
    "options": [
      {
        "label": "Running Flawlessly with Zero Issues Since Installation ⚙️",
        "sentiment": "positive",
        "keywords": [
          "running flawlessly",
          "reliable performance"
        ]
      },
      {
        "label": "Noticeable Improvement in Energy Efficiency & Utility Bills 📉",
        "sentiment": "positive",
        "keywords": [
          "energy efficient installation",
          "lower utility bills"
        ]
      },
      {
        "label": "Quiet, Powerful and Dependable 🤫",
        "sentiment": "positive",
        "keywords": [
          "quiet operation",
          "dependable system"
        ]
      }
    ]
  },
  {
    "id": "srv_qlt_08",
    "category": "workmanship_quality",
    "categoryLabel": "Workmanship, Skill & Durability",
    "question": "Overall, how would you rate the trade craftsmanship?",
    "options": [
      {
        "label": "Top-Tier Professional Grade Workmanship 🏆",
        "sentiment": "positive",
        "keywords": [
          "top tier trade craftsmanship",
          "best home service contractor"
        ]
      },
      {
        "label": "Exceeded Every Expectation for Quality 💎",
        "sentiment": "positive",
        "keywords": [
          "exceeded quality expectations",
          "master level trade"
        ]
      },
      {
        "label": "The Only Contractor I Will Call in the Future! 🌟",
        "sentiment": "positive",
        "keywords": [
          "trusted contractor for life",
          "highest recommendation"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_01",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "Did the service technician arrive on time for the scheduled window?",
    "options": [
      {
        "label": "Arrived Right on Time at the Start of the Window ⏱️",
        "sentiment": "positive",
        "keywords": [
          "on time technician",
          "punctual arrival",
          "respected my time"
        ]
      },
      {
        "label": "Called / Texted 20 Minutes Before Arrival 📲",
        "sentiment": "positive",
        "keywords": [
          "courtesy call before arrival",
          "live tracking link"
        ]
      },
      {
        "label": "Accommodated Urgent Same-Day Service Request 🚨",
        "sentiment": "positive",
        "keywords": [
          "same day emergency service",
          "fast dispatch"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_02",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "How easy was booking the appointment with the dispatch / front office?",
    "options": [
      {
        "label": "Polite Customer Service Booked in Under 2 Minutes 📞",
        "sentiment": "positive",
        "keywords": [
          "courteous dispatch team",
          "fast phone booking"
        ]
      },
      {
        "label": "Convenient 24/7 Online Booking System 💻",
        "sentiment": "positive",
        "keywords": [
          "easy online service booking",
          "instant scheduling"
        ]
      },
      {
        "label": "Accommodated My Work Schedule with Weekend Slots 🗓️",
        "sentiment": "positive",
        "keywords": [
          "flexible appointment windows",
          "weekend service available"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_03",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "Did the technician come fully prepared with a stocked service vehicle?",
    "options": [
      {
        "label": "Truck Had All Necessary Replacement Parts On-Hand 🚚",
        "sentiment": "positive",
        "keywords": [
          "fully stocked service van",
          "had parts on vehicle"
        ]
      },
      {
        "label": "No Delay Leaving Jobsite to Fetch Basic Parts ⚡",
        "sentiment": "positive",
        "keywords": [
          "completed in single trip",
          "no wasted trips"
        ]
      },
      {
        "label": "Equipped with Specialized Diagnostic Testing Gear 🧰",
        "sentiment": "positive",
        "keywords": [
          "specialized diagnostic tools",
          "fully equipped technician"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_04",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "How fast was the total project or repair turnaround time?",
    "options": [
      {
        "label": "Finished Ahead of Schedule in Record Time ⏱️",
        "sentiment": "positive",
        "keywords": [
          "finished ahead of schedule",
          "fast efficient trade work"
        ]
      },
      {
        "label": "Worked Steadily and Diligently from Start to Finish 🔨",
        "sentiment": "positive",
        "keywords": [
          "diligent hard worker",
          "uninterrupted focus"
        ]
      },
      {
        "label": "Minimal Disruption to My Household 🏡",
        "sentiment": "positive",
        "keywords": [
          "minimal household disruption",
          "efficient project flow"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_05",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "If this was an emergency call (burst pipe, AC outage, electrical short), how fast was help?",
    "options": [
      {
        "label": "Technician Arrived Within 60 Minutes of My Call 🚨",
        "sentiment": "positive",
        "keywords": [
          "rapid emergency response",
          "lifesaver contractor"
        ]
      },
      {
        "label": "Prevented Severe Water / Property Damage 💧",
        "sentiment": "positive",
        "keywords": [
          "prevented water damage",
          "immediate emergency fix"
        ]
      },
      {
        "label": "Calm, Professional & Took Control of the Emergency 🛡️",
        "sentiment": "positive",
        "keywords": [
          "calm under pressure",
          "restored safety immediately"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_06",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "Did you receive clear appointment confirmations and tracking?",
    "options": [
      {
        "label": "Received Text with Technician Name and Photo 📸",
        "sentiment": "positive",
        "keywords": [
          "technician photo and bio",
          "safe home service"
        ]
      },
      {
        "label": "Live GPS Tracking Link of Technician En Route 📍",
        "sentiment": "positive",
        "keywords": [
          "live technician tracking",
          "real time arrival updates"
        ]
      },
      {
        "label": "Clear Automated Calendar Confirmation 📅",
        "sentiment": "positive",
        "keywords": [
          "automated calendar invite",
          "well organized dispatch"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_07",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "Did the company keep all promised milestones and timelines?",
    "options": [
      {
        "label": "100% Kept Every Promise and Deadline 🤝",
        "sentiment": "positive",
        "keywords": [
          "kept every promise",
          "dependable timelines"
        ]
      },
      {
        "label": "Finished Major Installation Within Single Day 🌅",
        "sentiment": "positive",
        "keywords": [
          "single day installation",
          "rapid turnaround"
        ]
      },
      {
        "label": "Prompt Inspection and Final Sign-Off 📋",
        "sentiment": "positive",
        "keywords": [
          "smooth final inspection",
          "hassle free sign-off"
        ]
      }
    ]
  },
  {
    "id": "srv_pnc_08",
    "category": "punctuality_speed",
    "categoryLabel": "Punctuality, Arrival & Scheduling",
    "question": "How would you rate the punctuality and response time of this company?",
    "options": [
      {
        "label": "5 Stars for Dependability and Prompt Arrival! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star punctuality",
          "most dependable contractor"
        ]
      },
      {
        "label": "The Most Reliable Home Service Team in the Region 🏆",
        "sentiment": "positive",
        "keywords": [
          "reliable trade professional",
          "prompt service team"
        ]
      },
      {
        "label": "Respected My Time at Every Step ⏱️",
        "sentiment": "positive",
        "keywords": [
          "respected my schedule",
          "flawless punctuality"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_01",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "Was a clear, upfront written quote provided before work began?",
    "options": [
      {
        "label": "Clear Itemized Quote with Zero Hidden Fees 📋",
        "sentiment": "positive",
        "keywords": [
          "upfront written quote",
          "no hidden fees",
          "transparent trade pricing"
        ]
      },
      {
        "label": "Final Invoice Matched the Agreed Estimate Exactly 💵",
        "sentiment": "positive",
        "keywords": [
          "exact estimate honored",
          "honest billing"
        ]
      },
      {
        "label": "Multiple Tiered Options Provided to Fit My Budget 💡",
        "sentiment": "positive",
        "keywords": [
          "good better best options",
          "budget friendly choices"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_02",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "Did the contractor explain what each cost component was for?",
    "options": [
      {
        "label": "Clear Breakdown of Parts, Equipment & Labor 🧾",
        "sentiment": "positive",
        "keywords": [
          "clear parts and labor breakdown",
          "transparent invoice"
        ]
      },
      {
        "label": "Honest Explanation of Premium vs Standard Upgrades ⚖️",
        "sentiment": "positive",
        "keywords": [
          "honest upgrade advice",
          "no high pressure sales"
        ]
      },
      {
        "label": "Patiently Answered All Cost-Related Questions 💬",
        "sentiment": "positive",
        "keywords": [
          "patient cost discussion",
          "trustworthy contractor"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_03",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "How did the pricing compare to other quotes you received?",
    "options": [
      {
        "label": "Fair, Competitive Rates for Premium Craftsmanship 💎",
        "sentiment": "positive",
        "keywords": [
          "competitive trade rates",
          "great value for master craftsmanship"
        ]
      },
      {
        "label": "Best Overall Value Considering Equipment Quality 🏆",
        "sentiment": "positive",
        "keywords": [
          "best value quote",
          "highest quality trade work"
        ]
      },
      {
        "label": "Saved Money Compared to the Bigger Commercial Franchises 💰",
        "sentiment": "positive",
        "keywords": [
          "saved money on home service",
          "fair local prices"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_04",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "Were there any surprise fees or unexpected add-ons at the end?",
    "options": [
      {
        "label": "Zero Surprises! Total Transparency Throughout 🛡️",
        "sentiment": "positive",
        "keywords": [
          "zero surprise charges",
          "honest contractor"
        ]
      },
      {
        "label": "Any Necessary Adjustment Was Pre-Approved by Me 📲",
        "sentiment": "positive",
        "keywords": [
          "pre approved change orders",
          "clear communication"
        ]
      },
      {
        "label": "Ethical Pricing Standards You Can Count On 👍",
        "sentiment": "positive",
        "keywords": [
          "ethical pricing",
          "dependable billing"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_05",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "Were flexible financing or payment plans available for large projects?",
    "options": [
      {
        "label": "Great 0% Interest Financing Options for New Systems 💳",
        "sentiment": "positive",
        "keywords": [
          "hvac financing",
          "plumbing payment plan"
        ]
      },
      {
        "label": "Fast Digital Approval Without Bureaucracy 📲",
        "sentiment": "positive",
        "keywords": [
          "instant financing approval",
          "hassle free financing"
        ]
      },
      {
        "label": "Easy Credit Card / Electronic Invoicing 💻",
        "sentiment": "positive",
        "keywords": [
          "digital invoice payment",
          "contactless payment"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_06",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "Did the company offer maintenance plan discounts or loyalty savings?",
    "options": [
      {
        "label": "Enrolled in Annual Maintenance Club for Priority Service 🏷️",
        "sentiment": "positive",
        "keywords": [
          "annual service agreement",
          "priority customer perks"
        ]
      },
      {
        "label": "Received Great Discount on Replacement Filters & Parts 📦",
        "sentiment": "positive",
        "keywords": [
          "member parts discount",
          "loyalty savings"
        ]
      },
      {
        "label": "Valuable Long-Term Savings on Home Maintenance 💰",
        "sentiment": "positive",
        "keywords": [
          "preventative maintenance savings",
          "great value plan"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_07",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "How was the clarity of your final invoice and warranty documentation?",
    "options": [
      {
        "label": "Detailed Digital Receipt Emailed with Manufacturer Warranty 📧",
        "sentiment": "positive",
        "keywords": [
          "emailed warranty documentation",
          "detailed digital invoice"
        ]
      },
      {
        "label": "All Permits and Code Inspections Handled Smoothly 🏛️",
        "sentiment": "positive",
        "keywords": [
          "handled city permits",
          "code compliant inspection"
        ]
      },
      {
        "label": "Clear Registration of Equipment Warranties 🛡️",
        "sentiment": "positive",
        "keywords": [
          "registered manufacturer warranty",
          "thorough documentation"
        ]
      }
    ]
  },
  {
    "id": "srv_prc_08",
    "category": "transparent_pricing",
    "categoryLabel": "Upfront Quotes & Fair Pricing",
    "question": "Overall, was the investment worth the peace of mind and quality received?",
    "options": [
      {
        "label": "Worth Every Single Dollar for Such Exceptional Work 💎",
        "sentiment": "positive",
        "keywords": [
          "worth every dollar",
          "unbeatable home service value"
        ]
      },
      {
        "label": "Saved Me from a Major Disaster Down the Road 🛡️",
        "sentiment": "positive",
        "keywords": [
          "prevented costly future damage",
          "smart investment"
        ]
      },
      {
        "label": "5 Stars for Integrity and Fair Value! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star trade value",
          "honest home contractor"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_01",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "Did the technician wear protective shoe covers (booties) and use drop cloths inside your home?",
    "options": [
      {
        "label": "Put on Fresh Shoe Booties Before Stepping Inside 👟",
        "sentiment": "positive",
        "keywords": [
          "wore shoe covers",
          "protective booties inside home"
        ]
      },
      {
        "label": "Laid Down Protective Canvas Drop Cloths on Floors 🛡️",
        "sentiment": "positive",
        "keywords": [
          "laid drop cloths",
          "protected hardwood floors"
        ]
      },
      {
        "label": "Treated My Home with the Utmost Care & Respect 🏡",
        "sentiment": "positive",
        "keywords": [
          "respected homeowner property",
          "polite and clean"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_02",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "How clean was the workspace left after the job was completed?",
    "options": [
      {
        "label": "Swept, Vacuumed & Left Cleaner Than They Found It! 🧹",
        "sentiment": "positive",
        "keywords": [
          "left workspace spotless",
          "vacuumed work area",
          "clean contractor"
        ]
      },
      {
        "label": "All Old Equipment, Scrap Pipes & Debris Hauled Away 🚛",
        "sentiment": "positive",
        "keywords": [
          "hauled away old equipment",
          "zero debris left behind"
        ]
      },
      {
        "label": "Zero Dust, Fingerprints or Smudges Left Behind ✨",
        "sentiment": "positive",
        "keywords": [
          "wiped down surfaces",
          "immaculate cleanup"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_03",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "How careful was the crew when carrying heavy tools and machinery through the house?",
    "options": [
      {
        "label": "Extremely Careful Around Walls, Doors & Furniture 🛋️",
        "sentiment": "positive",
        "keywords": [
          "careful with furniture",
          "no scuffs on walls"
        ]
      },
      {
        "label": "Padded Doorways and Corners to Prevent Scratches 🚪",
        "sentiment": "positive",
        "keywords": [
          "padded door corners",
          "meticulous property protection"
        ]
      },
      {
        "label": "Navigated Tight Hallways and Stairs with Ease 🪜",
        "sentiment": "positive",
        "keywords": [
          "careful navigation",
          "experienced trade crew"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_04",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "How was the professional appearance and uniform of the technicians?",
    "options": [
      {
        "label": "Clean, Professional Branded Uniforms with Badges 👔",
        "sentiment": "positive",
        "keywords": [
          "professional uniform",
          "branded work attire",
          "identification badge"
        ]
      },
      {
        "label": "Well-Groomed, Clean Trucks and Orderly Tools 🚚",
        "sentiment": "positive",
        "keywords": [
          "clean branded truck",
          "organized trade van"
        ]
      },
      {
        "label": "Instilled Immediate Trust and Confidence 🌟",
        "sentiment": "positive",
        "keywords": [
          "trustworthy appearance",
          "professional demeanor"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_05",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "How courteous and polite was the crew throughout their time in your home?",
    "options": [
      {
        "label": "Incredibly Polite, Respectful and Soft-Spoken 😊",
        "sentiment": "positive",
        "keywords": [
          "courteous trade crew",
          "polite technicians"
        ]
      },
      {
        "label": "Zero Loud Music, Shouting, or Inappropriate Language 🤫",
        "sentiment": "positive",
        "keywords": [
          "quiet respectful workers",
          "professional conduct"
        ]
      },
      {
        "label": "Mindful of Sleeping Children and Pets 🐕",
        "sentiment": "positive",
        "keywords": [
          "pet friendly contractor",
          "mindful of sleeping kids"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_06",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "Did the technician dispose of hazardous materials or old refrigerants properly?",
    "options": [
      {
        "label": "Strict EPA / Environmental Disposal Standards Followed ♻️",
        "sentiment": "positive",
        "keywords": [
          "epa certified refrigerant recovery",
          "environmentally safe disposal"
        ]
      },
      {
        "label": "Recycled Old Metal, Wire and Fixtures Responsibly 🌿",
        "sentiment": "positive",
        "keywords": [
          "recycled old metal",
          "eco-friendly contractor"
        ]
      },
      {
        "label": "Took Pride in Clean, Green Trade Practices 🌍",
        "sentiment": "positive",
        "keywords": [
          "green trade practices",
          "responsible trade team"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_07",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "How was the communication when the technician completed the job?",
    "options": [
      {
        "label": "Called Me In for a Full Inspection Tour of the Work 🚶",
        "sentiment": "positive",
        "keywords": [
          "walked through completed work",
          "thorough tour"
        ]
      },
      {
        "label": "Showed Photos of Attic / Crawlspace Installation 📸",
        "sentiment": "positive",
        "keywords": [
          "attic installation photos",
          "transparent verification"
        ]
      },
      {
        "label": "Courteous Farewell and Left Emergency Contact Number 👋",
        "sentiment": "positive",
        "keywords": [
          "emergency contact provided",
          "warm farewell"
        ]
      }
    ]
  },
  {
    "id": "srv_cln_08",
    "category": "jobsite_cleanliness",
    "categoryLabel": "Cleanliness, Booties & Property Respect",
    "question": "What is your final rating for this trade and home services company?",
    "options": [
      {
        "label": "The Cleanest and Most Professional Trade Team Ever Hired 🏆",
        "sentiment": "positive",
        "keywords": [
          "cleanest contractor in town",
          "best home service company"
        ]
      },
      {
        "label": "Earned a Customer for Life — Highest Recommendation! 🌟",
        "sentiment": "positive",
        "keywords": [
          "customer for life",
          "rave recommendation"
        ]
      },
      {
        "label": "Flawless 5-Star Service From Start to Finish! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star home service",
          "exceptional trade work"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_01",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "Was the technician fully licensed, insured and certified?",
    "options": [
      {
        "label": "Fully Licensed, Insured & Master Certified 📜",
        "sentiment": "positive",
        "keywords": [
          "licensed and insured contractor",
          "master certified technician"
        ]
      },
      {
        "label": "Demonstrated Deep Trade Code Compliance 🏛️",
        "sentiment": "positive",
        "keywords": [
          "strict code compliance",
          "permitted safety standard"
        ]
      },
      {
        "label": "Peace of Mind Knowing Experts Were on the Job 🛡️",
        "sentiment": "positive",
        "keywords": [
          "expert safety",
          "trusted licensed team"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_02",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "How responsive was the dispatch team if you had a follow-up question?",
    "options": [
      {
        "label": "Answered Phone Immediately with Knowledgeable Advice 📞",
        "sentiment": "positive",
        "keywords": [
          "immediate phone answer",
          "helpful dispatch staff"
        ]
      },
      {
        "label": "Technician Returned My Call Within 15 Minutes ⏱️",
        "sentiment": "positive",
        "keywords": [
          "prompt callback",
          "accessible trade experts"
        ]
      },
      {
        "label": "Smooth Customer Service Portal with Online Notes 💻",
        "sentiment": "positive",
        "keywords": [
          "customer portal access",
          "clear communication history"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_03",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "Did the company follow up post-service to ensure you were 100% satisfied?",
    "options": [
      {
        "label": "Service Manager Called Personally to Verify My Happiness 🤝",
        "sentiment": "positive",
        "keywords": [
          "quality assurance follow up",
          "service manager check in"
        ]
      },
      {
        "label": "Ensured Every Detail of the Service Was Complete 👍",
        "sentiment": "positive",
        "keywords": [
          "verified 100% satisfaction",
          "dedicated company"
        ]
      },
      {
        "label": "True Commitment to Customer Service Excellence ❤️",
        "sentiment": "positive",
        "keywords": [
          "commitment to excellence",
          "customer first focus"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_04",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "How was the company's attitude when dealing with unexpected challenges on the job?",
    "options": [
      {
        "label": "Stayed Calm, Resourceful & Solved It Seamlessly 💡",
        "sentiment": "positive",
        "keywords": [
          "resourceful problem solver",
          "calm under challenges"
        ]
      },
      {
        "label": "No Complaints or Excuses — True Can-Do Attitude 🚀",
        "sentiment": "positive",
        "keywords": [
          "can do attitude",
          "resilient technician"
        ]
      },
      {
        "label": "Delivered a Brilliant Engineering Solution 🧠",
        "sentiment": "positive",
        "keywords": [
          "brilliant trade solution",
          "master craftsmanship"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_05",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "How easy was it to access manufacturer rebate assistance or tax credit documentation?",
    "options": [
      {
        "label": "Helped Me File for Energy Rebates & Saved Hundreds! 💵",
        "sentiment": "positive",
        "keywords": [
          "energy rebate assistance",
          "tax credit documentation"
        ]
      },
      {
        "label": "Filled Out All the Rebate Paperwork for Me 📑",
        "sentiment": "positive",
        "keywords": [
          "hassle free rebate processing",
          "helpful front office"
        ]
      },
      {
        "label": "High-Efficiency Energy Star Certified Systems 🌿",
        "sentiment": "positive",
        "keywords": [
          "energy star equipment",
          "eco savings"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_06",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "Have you recommended this service provider to neighbors or family?",
    "options": [
      {
        "label": "Already Shared Their Number in Our Neighborhood Group 📲",
        "sentiment": "positive",
        "keywords": [
          "recommended to neighbors",
          "neighborhood preferred contractor"
        ]
      },
      {
        "label": "My Family Uses Them for All Their Homes Now 👨‍👩‍👧",
        "sentiment": "positive",
        "keywords": [
          "family contractor",
          "trusted home service"
        ]
      },
      {
        "label": "The Most Reliable Trade Company in the Area 🏆",
        "sentiment": "positive",
        "keywords": [
          "most reliable local trade",
          "reputable company"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_07",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "How confident are you in this company's ongoing warranty support?",
    "options": [
      {
        "label": "100% Confident They Stand Behind Every Job 🛡️",
        "sentiment": "positive",
        "keywords": [
          "stands behind warranty",
          "peace of mind guarantee"
        ]
      },
      {
        "label": "Prompt Warranty Response if Anything Needs Adjustment ⏱️",
        "sentiment": "positive",
        "keywords": [
          "fast warranty response",
          "zero hassle service"
        ]
      },
      {
        "label": "A Company of True Integrity and Honor 🌟",
        "sentiment": "positive",
        "keywords": [
          "integrity and honor",
          "top reputation"
        ]
      }
    ]
  },
  {
    "id": "srv_rel_08",
    "category": "professionalism_reliability",
    "categoryLabel": "Professionalism & Reliability",
    "question": "Will you hire this company again for your next project or maintenance?",
    "options": [
      {
        "label": "My Permanent Number One Service Call! 🏆",
        "sentiment": "positive",
        "keywords": [
          "permanent contractor",
          "first choice for home repairs"
        ]
      },
      {
        "label": "Already Scheduling Our Next Seasonal Maintenance 📅",
        "sentiment": "positive",
        "keywords": [
          "scheduled seasonal tune-up",
          "dependable partner"
        ]
      },
      {
        "label": "5 Stars Across Every Single Metric! ⭐⭐⭐⭐⭐",
        "sentiment": "positive",
        "keywords": [
          "5 star home service company",
          "highest possible recommendation"
        ]
      }
    ]
  }
]
};
