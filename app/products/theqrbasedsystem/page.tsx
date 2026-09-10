import SalesPageClient from "./SalesPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "15-Second QR Review Engine for Local Businesses | Mithun Das AI",
  description:
    "Turn everyday clinic, salon, gym, and restaurant visits into a flood of 5-star Google reviews in 15 seconds. $1/day transparent pricing with a 3-day free trial.",
  keywords: [
    "Google Review QR code",
    "Dental review generator",
    "Salon review booster",
    "Google Maps 5 star review SaaS",
    "QR code review standee",
  ],
};

export default function TheQrBasedSystemPage() {
  return <SalesPageClient />;
}
