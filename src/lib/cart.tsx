import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";

export interface CartItem {
  productId: string;
  ml: number;
  qty: number;
}

interface State { items: CartItem[]; }

type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; productId: string; ml: number }
  | { type: "qty"; productId: string; ml: number; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const KEY = "alburj-cart-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const i = state.items.findIndex(
        (it) => it.productId === action.item.productId && it.ml === action.item.ml,
      );
      if (i === -1) return { items: [...state.items, action.item] };
      const next = [...state.items];
      next[i] = { ...next[i], qty: next[i].qty + action.item.qty };
      return { items: next };
    }
    case "remove":
      return {
        items: state.items.filter(
          (it) => !(it.productId === action.productId && it.ml === action.ml),
        ),
      };
    case "qty":
      return {
        items: state.items.map((it) =>
          it.productId === action.productId && it.ml === action.ml
            ? { ...it, qty: Math.max(1, action.qty) }
            : it,
        ),
      };
    case "clear":
      return { items: [] };
  }
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  detailed: Array<{ item: CartItem; product: Product; size: { ml: number; price: number } }>;
  add: (item: CartItem) => void;
  remove: (productId: string, ml: number) => void;
  setQty: (productId: string, ml: number, qty: number) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartCtx>(() => {
    const detailed = state.items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        const size = product.sizes.find((s) => s.ml === item.ml);
        if (!size) return null;
        return { item, product, size };
      })
      .filter(Boolean) as Array<{ item: CartItem; product: Product; size: { ml: number; price: number } }>;

    const subtotal = detailed.reduce((sum, d) => sum + d.size.price * d.item.qty, 0);
    const count = state.items.reduce((sum, it) => sum + it.qty, 0);

    return {
      items: state.items,
      count,
      subtotal,
      detailed,
      add: (item) => dispatch({ type: "add", item }),
      remove: (productId, ml) => dispatch({ type: "remove", productId, ml }),
      setQty: (productId, ml, qty) => dispatch({ type: "qty", productId, ml, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
