export const SITE = {
  brand: "Alburj Fragrance",
  tagline: "Whispers of the Orient, captured in glass.",
  whatsapp: "923001234567", // placeholder PK number
  email: "concierge@alburj.com",
  phone: "+92 300 1234567",
  address: "Boulevard 12, Gulberg, Lahore, Pakistan",
  instagram: "https://instagram.com/alburjfragrance",
  tiktok: "https://tiktok.com/@alburjfragrance",
  currency: "PKR",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatPKR(value: number) {
  return `PKR ${value.toLocaleString("en-PK")}`;
}
