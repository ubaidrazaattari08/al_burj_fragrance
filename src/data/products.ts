import b1 from "@/assets/bottle-1.jpg";
import b2 from "@/assets/bottle-2.jpg";
import b3 from "@/assets/bottle-3.jpg";
import b4 from "@/assets/bottle-4.jpg";
import b5 from "@/assets/bottle-5.jpg";
import b6 from "@/assets/bottle-6.jpg";

const IMG = [b1, b2, b3, b4, b5, b6];

export type Category =
  | "Fresh" | "Woody" | "Citrus" | "Oud"
  | "Sweet" | "Summer" | "Winter" | "Office"
  | "Formal" | "Signature Scents";

export const CATEGORIES: Category[] = [
  "Fresh", "Woody", "Citrus", "Oud", "Sweet",
  "Summer", "Winter", "Office", "Formal", "Signature Scents",
];

export interface Size { ml: number; price: number; }

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  categories: Category[];
  notes: { top: string[]; heart: string[]; base: string[] };
  longevity: number;   // 1-10
  projection: number;  // 1-10
  sizes: Size[];
  image: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  rating: number;
  reviews: number;
}

const NAMES: Array<[string, string, Category[], number, number, boolean, boolean, boolean]> = [
  ["Nuit d'Oud",        "Eau de Parfum",  ["Oud", "Winter", "Signature Scents"], 9, 8, true, false, true],
  ["Royal Amber",       "Extrait de Parfum", ["Woody", "Winter", "Formal"], 10, 9, true, false, true],
  ["Citrus Mirage",     "Eau de Toilette",["Citrus", "Fresh", "Summer"], 6, 6, false, true, true],
  ["Velvet Rose",       "Eau de Parfum",  ["Sweet", "Signature Scents", "Formal"], 8, 7, true, false, false],
  ["Smoke & Saffron",   "Extrait de Parfum", ["Oud", "Woody", "Winter"], 10, 9, true, false, true],
  ["Boulevard Noir",    "Eau de Parfum",  ["Woody", "Office", "Formal"], 8, 7, false, true, false],
  ["Lumière d'Été",     "Eau de Toilette",["Fresh", "Summer", "Office"], 5, 5, false, true, false],
  ["Imperial Musk",     "Eau de Parfum",  ["Sweet", "Signature Scents"], 9, 8, true, false, false],
  ["Cèdre Sauvage",     "Eau de Parfum",  ["Woody", "Office"], 7, 6, false, false, false],
  ["Bergamot Dusk",     "Eau de Toilette",["Citrus", "Fresh"], 6, 5, false, true, false],
  ["Oud Royale",        "Extrait de Parfum", ["Oud", "Signature Scents"], 10, 10, true, false, true],
  ["Vanille Obscure",   "Eau de Parfum",  ["Sweet", "Winter"], 8, 7, false, false, false],
  ["Marrakech 1962",    "Eau de Parfum",  ["Oud", "Woody"], 9, 8, false, true, false],
  ["Saffron Empire",    "Eau de Parfum",  ["Sweet", "Winter", "Formal"], 9, 8, true, false, false],
  ["Aqua Dorée",        "Eau de Toilette",["Fresh", "Summer", "Office"], 5, 6, false, true, false],
  ["Ambre Solaire",     "Eau de Parfum",  ["Sweet", "Summer"], 7, 7, false, false, false],
  ["Patchouli Velours", "Extrait de Parfum", ["Woody", "Signature Scents"], 9, 8, false, false, false],
  ["Nuit Blanche",      "Eau de Parfum",  ["Fresh", "Formal", "Office"], 7, 6, false, true, false],
  ["Tabac d'Orient",    "Eau de Parfum",  ["Sweet", "Woody", "Winter"], 9, 8, false, false, false],
  ["Le Dernier Soupir", "Extrait de Parfum", ["Oud", "Signature Scents", "Formal"], 10, 9, true, false, true],
];

const NOTE_POOL = {
  top: [
    ["Bergamot", "Pink Pepper", "Saffron"],
    ["Sicilian Lemon", "Cardamom", "Bitter Orange"],
    ["Calabrian Bergamot", "Mandarin", "Black Pepper"],
    ["Italian Citron", "Aldehydes", "Cinnamon Bark"],
    ["Grapefruit", "Coriander Seed", "Elemi"],
  ],
  heart: [
    ["Bulgarian Rose", "Jasmine Sambac", "Saffron Threads"],
    ["Damascena Rose", "Cypriol", "Cedar Atlas"],
    ["Orris Butter", "Tuberose", "Magnolia"],
    ["Cinnamon", "Davana", "Geranium"],
    ["Tobacco Leaf", "Honeyed Plum", "Iris"],
  ],
  base: [
    ["Cambodian Oud", "Amber", "White Musk"],
    ["Sandalwood", "Vetiver", "Vanilla Bourbon"],
    ["Patchouli", "Tonka Bean", "Cashmeran"],
    ["Oakmoss", "Leather", "Benzoin"],
    ["Frankincense", "Labdanum", "Amberwood"],
  ],
};

const STORY = "Composed in our Lahore atelier by a master perfumer, this scent threads heritage Eastern materials with modern French composition. Sourced ingredients from Cambodia, Bulgaria and the Mediterranean coast give every spray a distinctive, lingering character.";

function priceFor(idx: number, baseMl: number) {
  const base = 3800 + (idx % 6) * 400;
  const factor = baseMl === 30 ? 0.55 : baseMl === 50 ? 1 : baseMl === 100 ? 1.7 : 2.4;
  return Math.round((base * factor) / 50) * 50;
}

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const PRODUCTS: Product[] = NAMES.map((row, i) => {
  const [name, subtitle, cats, longevity, projection, best, fresh, feat] = row;
  return {
    id: `alb-${String(i + 1).padStart(3, "0")}`,
    slug: slugify(name),
    name,
    subtitle,
    description: `${name} is a ${cats[0].toLowerCase()} composition designed for those who treat fragrance as adornment. Velvet sillage, refined longevity.`,
    story: STORY,
    categories: cats,
    notes: {
      top: NOTE_POOL.top[i % NOTE_POOL.top.length],
      heart: NOTE_POOL.heart[i % NOTE_POOL.heart.length],
      base: NOTE_POOL.base[i % NOTE_POOL.base.length],
    },
    longevity,
    projection,
    sizes: [
      { ml: 30, price: priceFor(i, 30) },
      { ml: 50, price: priceFor(i, 50) },
      { ml: 100, price: priceFor(i, 100) },
    ],
    image: IMG[i % IMG.length],
    bestSeller: best,
    newArrival: fresh,
    featured: feat,
    rating: 4.4 + ((i % 6) * 0.1),
    reviews: 28 + (i * 7) % 180,
  };
});

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function byCategory(cat: Category) {
  return PRODUCTS.filter((p) => p.categories.includes(cat));
}
