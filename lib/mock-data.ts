// In-memory menu catalogue for Miele.
// This is a showcase menu — no prices, no payment, no external services.
// Photos live under /public/menu/. If a photo file is missing, components
// fall back to a soft gradient tile bearing the dish name (see DishImage).

export type Category =
  | "Cheesecakes"
  | "Tarts"
  | "Brownies & Bars"
  | "Cookies"
  | "Cupcakes";

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  image: string;
  gradient: [string, string];
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  "Cheesecakes",
  "Tarts",
  "Brownies & Bars",
  "Cookies",
  "Cupcakes",
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "baked-nutella-cheesecake",
    slug: "baked-nutella-cheesecake",
    name: "Baked Nutella Cheesecake",
    category: "Cheesecakes",
    description: "Creamy baked cheesecake swirled with Nutella over a hazelnut biscuit base.",
    image: "/menu/baked-nutella-cheesecake.jpg",
    gradient: ["#e9d9c3", "#7a5a42"],
  },
  {
    id: "biscoff-cheesecake",
    slug: "biscoff-cheesecake",
    name: "Biscoff Cheesecake",
    category: "Cheesecakes",
    description: "Baked cheesecake topped with golden Biscoff caramel.",
    image: "/menu/biscoff-cheesecake.jpg",
    gradient: ["#f2dfb8", "#c1893f"],
    featured: true,
  },
  {
    id: "set-biscoff-cheesecake",
    slug: "set-biscoff-cheesecake",
    name: "Set Biscoff Cheesecake",
    category: "Cheesecakes",
    description: "A set of individually portioned mini Biscoff cheesecakes, each finished with golden Biscoff caramel.",
    image: "/menu/set-biscoff-cheesecake.jpg",
    gradient: ["#f2e3c4", "#a9783f"],
  },
  {
    id: "blueberry-cheesecake",
    slug: "blueberry-cheesecake",
    name: "Blueberry Cheesecake",
    category: "Cheesecakes",
    description: "Baked cheesecake crowned with a glossy blueberry compote.",
    image: "/menu/blueberry-cheesecake.jpg",
    gradient: ["#e6e0ec", "#5b4a78"],
    featured: true,
  },
  {
    id: "strawberry-tart",
    slug: "strawberry-cream-tart",
    name: "Strawberry Cream Tart",
    category: "Tarts",
    description: "Buttery tart shell filled with strawberry cream and white chocolate.",
    image: "/menu/strawberry-tart.jpg",
    gradient: ["#f8e9e4", "#e8b7ac"],
  },
  {
    id: "chocolate-marble-tart",
    slug: "chocolate-marble-tart",
    name: "Chocolate Marble Tart",
    category: "Tarts",
    description: "Feathered dark-and-white chocolate ganache with toasted nuts.",
    image: "/menu/chocolate-marble-tart.jpg",
    gradient: ["#ece4d4", "#6b5642"],
  },
  {
    id: "rum-tart",
    slug: "rum-tart",
    name: "Rum Tart",
    category: "Tarts",
    description: "Buttery tart shell filled with a rich rum-infused custard and toasted nuts.",
    image: "/menu/rum-tart.jpg",
    gradient: ["#f1e3cd", "#9c6b3f"],
  },
  {
    id: "walnut-brownies",
    slug: "walnut-fudge-brownie",
    name: "Walnut Fudge Brownie",
    category: "Brownies & Bars",
    description: "Rich fudgy brownie loaded with toasted walnuts.",
    image: "/menu/walnut-brownies.jpg",
    gradient: ["#ddd0c0", "#5a4332"],
    featured: true,
  },
  {
    id: "chocolate-chip-brownies",
    slug: "chocolate-chip-brownie",
    name: "Chocolate Chip Brownie",
    category: "Brownies & Bars",
    description: "Gooey brownie studded with melting chocolate chips.",
    image: "/menu/chocolate-chip-brownies.jpg",
    gradient: ["#e3d6c8", "#4f3a2c"],
  },
  {
    id: "chocolate-chip-cookies",
    slug: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    category: "Cookies",
    description: "Soft-centred cookies packed with chocolate chips.",
    image: "/menu/chocolate-chip-cookies.jpg",
    gradient: ["#f3e6cf", "#c9a24a"],
  },
  {
    id: "chocolate-cupcake",
    slug: "chocolate-cupcake",
    name: "Chocolate Cupcake",
    category: "Cupcakes",
    description: "Moist chocolate cupcake with a swirl of ganache.",
    image: "/menu/chocolate-cupcake.jpg",
    gradient: ["#e7ddd0", "#6b4a35"],
    featured: true,
  },
  {
    id: "vanilla-cupcake",
    slug: "vanilla-cupcake",
    name: "Vanilla Cupcake",
    category: "Cupcakes",
    description: "Soft vanilla bean cupcake topped with a swirl of silky buttercream.",
    image: "/menu/vanilla-cupcake.jpg",
    gradient: ["#faf3e3", "#e7cf9e"],
  },
];

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.slug === slug);
}
