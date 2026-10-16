// ---- Contact ----
export const WEBSITE = "https://www.sfmtravels.co.in/";
export const PHONE = "+971 52 697 3378";
export const PHONE_TEL = "tel:+971526973378";
export const WA = "https://wa.me/971526973378";

// ---- Photos (files in public/images). [file, background-position] ----
const BA = "/images/burj-al-arab.jpg", AT = "/images/atlantis.jpg", BK = "/images/burj-khalifa.jpg";
export const HERO = [[BA, "center"], [AT, "center 45%"], [BK, "center 35%"]];
// [label, photo, position, package filter]
export const CATS = [["Skyline", BK, "center 35%", "City"], ["Beaches", BA, "center", "Honeymoon"], ["Resorts", AT, "center 40%", "Luxury"]];
export const AREAS = [
  ["Downtown Dubai", "Burj Khalifa, Dubai Fountain, Dubai Mall.", BK, "center 35%"],
  ["Palm Jumeirah", "Beach resorts and Atlantis.", AT, "center 40%"],
  ["Jumeirah", "Burj Al Arab, Jumeirah Beach, Madinat Jumeirah.", BA, "center"],
];
// Packages without a photo here show a plain colour block. Add a file and an entry to fill it.
export const PKG_IMG = { classic: [BK, "center 35%"], family: [AT, "center 85%"], honeymoon: [BA, "left center"], luxury: [AT, "center 30%"] };
export const SEASONS = [
  ["Winter (Dec to Feb)", "Warm days around 25°C. Ideal for beaches, safaris and outdoor events."],
  ["Spring (Mar to May)", "Getting hotter. Good for city tours and lower hotel rates."],
  ["Summer (Jun to Sep)", "Very hot. Best for malls, indoor attractions and summer hotel deals."],
  ["Autumn (Oct to Nov)", "Temperatures ease. Good value before the busy winter season."],
];
export const TIPS = [
  ["Visas", "Visa rules depend on your nationality. Ask us before you book."],
  ["Currency", "The UAE dirham (AED). Cards are accepted almost everywhere."],
  ["Getting around", "Use the Metro, taxis or a private driver arranged by us."],
  ["Dress and etiquette", "Dress modestly in mosques and souks. Beachwear is fine at the beach and pool."],
];
export const CHIPS = ["All", "City", "Desert", "Family", "Honeymoon", "Luxury"];
export const NIGHTS = { "Any nights": [0, 99], "3-4 nights": [3, 4], "5-6 nights": [5, 6], "7+ nights": [7, 99] };
