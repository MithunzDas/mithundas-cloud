export * from "./types";

import { IndustryConfig, PoolQuestion } from "./types";
import { DENTIST_POOL } from "./dentist";
import { DOCTOR_POOL } from "./doctor";
import { ENDOCRINE_POOL } from "./endocrine";
import { RESTAURANT_POOL } from "./restaurant";
import { CAFE_POOL } from "./cafe";
import { HOTEL_POOL } from "./hotel";
import { SALON_POOL } from "./salon";
import { GYM_POOL } from "./gym";
import { AUTO_POOL } from "./auto";
import { SERVICES_POOL } from "./services";

export {
  DENTIST_POOL,
  DOCTOR_POOL,
  ENDOCRINE_POOL,
  RESTAURANT_POOL,
  CAFE_POOL,
  HOTEL_POOL,
  SALON_POOL,
  GYM_POOL,
  AUTO_POOL,
  SERVICES_POOL,
};

export const INDUSTRY_QUESTION_POOLS: Record<string, IndustryConfig> = {
  DENTIST: DENTIST_POOL,
  DOCTOR_CLINIC: DOCTOR_POOL,
  ENDOCRINE: ENDOCRINE_POOL,
  RESTAURANT: RESTAURANT_POOL,
  CAFE: CAFE_POOL,
  LUXURY_HOTEL: HOTEL_POOL,
  SALON_SPA: SALON_POOL,
  GYM: GYM_POOL,
  AUTO_REPAIR: AUTO_POOL,
  GENERAL_SERVICES: SERVICES_POOL,
};

export const CATEGORY_ALIASES: Record<string, string> = {
  // Dentist aliases
  "DENTAL": "DENTIST",
  "DENTISTRY": "DENTIST",
  "ORTHODONTIST": "DENTIST",
  "TEETH": "DENTIST",
  "DENTAL_CLINIC": "DENTIST",

  // Medical Doctor aliases
  "DOCTOR": "DOCTOR_CLINIC",
  "PHYSICIAN": "DOCTOR_CLINIC",
  "MEDICAL": "DOCTOR_CLINIC",
  "HEALTH_CLINIC": "DOCTOR_CLINIC",
  "CLINIC": "DOCTOR_CLINIC",
  "CARDIOLOGIST": "DOCTOR_CLINIC",
  "DERMATOLOGIST": "DOCTOR_CLINIC",
  "PEDIATRICIAN": "DOCTOR_CLINIC",

  // Endocrine & Diabetes aliases
  "ENDOCRINOLOGY": "ENDOCRINE",
  "ENDOCRINOLOGIST": "ENDOCRINE",
  "DIABETES": "ENDOCRINE",
  "DIABETIC_CLINIC": "ENDOCRINE",
  "THYROID": "ENDOCRINE",
  "THYROID_CLINIC": "ENDOCRINE",
  "HORMONE": "ENDOCRINE",
  "METABOLIC": "ENDOCRINE",

  // Restaurant aliases
  "FINE_DINING": "RESTAURANT",
  "DINING": "RESTAURANT",
  "BISTRO": "RESTAURANT",
  "STEAKHOUSE": "RESTAURANT",
  "EATERY": "RESTAURANT",
  "BAR_AND_GRILL": "RESTAURANT",

  // Cafe aliases
  "COFFEE_SHOP": "CAFE",
  "COFFEE": "CAFE",
  "BAKERY": "CAFE",
  "ESPRESSO_BAR": "CAFE",
  "PASTRY": "CAFE",

  // Hotel aliases
  "HOTEL_HOSPITALITY": "LUXURY_HOTEL",
  "HOTEL": "LUXURY_HOTEL",
  "RESORT": "LUXURY_HOTEL",
  "LUXURY_HOTELS": "LUXURY_HOTEL",
  "BOUTIQUE_HOTEL": "LUXURY_HOTEL",
  "INN": "LUXURY_HOTEL",

  // Salon & Spa aliases
  "SALON": "SALON_SPA",
  "SPA": "SALON_SPA",
  "BEAUTY": "SALON_SPA",
  "HAIR": "SALON_SPA",
  "HAIR_SALON": "SALON_SPA",
  "BARBER": "SALON_SPA",
  "BARBERSHOP": "SALON_SPA",
  "ESTHETICIAN": "SALON_SPA",

  // Gym aliases
  "FITNESS": "GYM",
  "FITNESS_CENTER": "GYM",
  "GYM_FITNESS": "GYM",
  "CROSSFIT": "GYM",
  "YOGA": "GYM",
  "PILATES": "GYM",
  "HEALTH_CLUB": "GYM",

  // Auto aliases
  "AUTO": "AUTO_REPAIR",
  "MECHANIC": "AUTO_REPAIR",
  "CAR_REPAIR": "AUTO_REPAIR",
  "GARAGE": "AUTO_REPAIR",
  "TIRES": "AUTO_REPAIR",
  "TIRE_SHOP": "AUTO_REPAIR",
  "DETAILING": "AUTO_REPAIR",
  "CAR_WASH": "AUTO_REPAIR",

  // General Services aliases
  "SERVICES": "GENERAL_SERVICES",
  "HOME_SERVICES": "GENERAL_SERVICES",
  "PLUMBING": "GENERAL_SERVICES",
  "PLUMBER": "GENERAL_SERVICES",
  "HVAC": "GENERAL_SERVICES",
  "ELECTRICIAN": "GENERAL_SERVICES",
  "ROOFING": "GENERAL_SERVICES",
  "CONTRACTOR": "GENERAL_SERVICES"
};

/**
 * Resolves any category string (e.g. from cold email, onboard dropdown, or Google scrape)
 * to a canonical category configuration.
 */
export function resolveCategoryKey(rawCategory?: string | null): string {
  if (!rawCategory) return "GENERAL_SERVICES";
  const upper = rawCategory.toUpperCase().trim().replace(/[\s-]+/g, "_");
  if (INDUSTRY_QUESTION_POOLS[upper]) return upper;
  if (CATEGORY_ALIASES[upper]) return CATEGORY_ALIASES[upper];

  // Specific keyword / Substring matching
  if (upper.includes("ENDOCRIN") || upper.includes("DIABET") || upper.includes("THYROID") || upper.includes("HORMONE")) {
    return "ENDOCRINE";
  }
  if (upper.includes("DENT")) return "DENTIST";
  if (upper.includes("COFFEE") || upper.includes("CAFE") || upper.includes("BAKER")) return "CAFE";
  if (upper.includes("RESTAU") || upper.includes("BISTRO") || upper.includes("DIN")) return "RESTAURANT";
  if (upper.includes("HOTEL") || upper.includes("RESORT") || upper.includes("HOSPITALITY")) return "LUXURY_HOTEL";
  if (upper.includes("DOCTOR") || upper.includes("CLINIC") || upper.includes("HEALTH") || upper.includes("MED")) return "DOCTOR_CLINIC";
  if (upper.includes("SALON") || upper.includes("SPA") || upper.includes("BEAUTY") || upper.includes("HAIR") || upper.includes("BARBER")) return "SALON_SPA";
  if (upper.includes("GYM") || upper.includes("FIT") || upper.includes("CROSSFIT") || upper.includes("WORKOUT")) return "GYM";
  if (upper.includes("AUTO") || upper.includes("MECHANIC") || upper.includes("TIRE") || upper.includes("CAR") || upper.includes("GARAGE")) return "AUTO_REPAIR";

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
    const remaining = questions.filter((q) => !selected.some((s) => s.id === q.id));
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
