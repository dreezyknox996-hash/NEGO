"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { seedMessages, seedProducts } from "@/lib/catalog";
import type { CartLine, ChatMessage, Product } from "@/lib/types";

type Profile = { name: string; email: string };
type MarketplaceContextValue = {
  products: Product[];
  cart: CartLine[];
  threadMessages: Record<string, ChatMessage[]>;
  profile: Profile | null;
  addToCart: (productId: string) => void;
  updateCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  addProduct: (product: Product, videoFile?: File) => void;
  sendMessage: (text: string, thread?: string) => void;
  makeOffer: (amount: number, thread?: string) => void;
  setProfile: (profile: Profile | null) => void;
  cartCount: number;
};

const Context = createContext<MarketplaceContextValue | null>(null);
const keys = { products: "nego-products-v2", cart: "nego-cart-v1", messages: "nego-messages-v1" };
const seedThreads: Record<string, ChatMessage[]> = {
  "Maya R.": seedMessages,
  "Theo L.": [],
  "Sam P.": [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [threadMessages, setThreadMessages] = useState<Record<string, ChatMessage[]>>(seedThreads);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const videoUrls = useRef<string[]>([]);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(keys.products);
      const storedCart = localStorage.getItem(keys.cart);
      const storedMessages = localStorage.getItem(keys.messages);
      if (storedProducts) setProducts(JSON.parse(storedProducts) as Product[]);
      if (storedCart) setCart(JSON.parse(storedCart) as CartLine[]);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages) as unknown;
        if (Array.isArray(parsed)) setThreadMessages({ ...seedThreads, "Maya R.": parsed as ChatMessage[] });
        else setThreadMessages(parsed as Record<string, ChatMessage[]>);
      }
    } catch {
      // Keep the seeded demo data if browser storage is unavailable or malformed.
    }
    setReady(true);
  }, []);
  useEffect(() => () => {
    videoUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(keys.products, JSON.stringify(products.map((p) => ({
        ...p,
        videoUrl: p.videoUrl?.startsWith("blob:") ? undefined : p.videoUrl,
      }))));
    } catch {
      // Photos stay in this session if storage runs out of room.
    }
  }, [products, ready]);
  useEffect(() => { if (ready) { try { localStorage.setItem(keys.cart, JSON.stringify(cart)); } catch { /* Keep the in-memory cart available. */ } } }, [cart, ready]);
  useEffect(() => { if (ready) { try { localStorage.setItem(keys.messages, JSON.stringify(threadMessages)); } catch { /* Keep the in-memory conversation available. */ } } }, [threadMessages, ready]);

  const addToCart = useCallback((productId: string) => {
    setCart((current) => {
      const found = current.find((line) => line.productId === productId);
      return found
        ? current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { productId, quantity: 1 }];
    });
  }, []);
  const updateCart = useCallback((productId: string, quantity: number) => {
    setCart((current) => quantity <= 0
      ? current.filter((line) => line.productId !== productId)
      : current.map((line) => line.productId === productId ? { ...line, quantity } : line));
  }, []);
  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((line) => line.productId !== productId));
  }, []);
  const addProduct = useCallback((product: Product, videoFile?: File) => {
    const videoUrl = videoFile ? URL.createObjectURL(videoFile) : product.videoUrl;
    if (videoFile && videoUrl) videoUrls.current.push(videoUrl);
    setProducts((current) => [{ ...product, videoUrl }, ...current]);
  }, []);
  const sendMessage = useCallback((text: string, thread = "Maya R.") => {
    if (!text.trim()) return;
    setThreadMessages((current) => ({
      ...current,
      [thread]: [...(current[thread] ?? []), {
        id: `msg-${Date.now()}`,
        sender: "buyer",
        text: text.trim(),
        createdAt: new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      }],
    }));
  }, []);
  const makeOffer = useCallback((amount: number, thread = "Maya R.") => {
    setThreadMessages((current) => ({
      ...current,
      [thread]: [...(current[thread] ?? []), {
        id: `offer-${Date.now()}`,
        sender: "buyer",
        text: "I’d love to make you an offer.",
        offerAmount: amount,
        createdAt: new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      }],
    }));
  }, []);
  const value = useMemo(() => ({
    products, cart, threadMessages, profile, addToCart, updateCart, removeFromCart, addProduct,
    sendMessage, makeOffer, setProfile, cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
  }), [products, cart, threadMessages, profile, addToCart, updateCart, removeFromCart, addProduct, sendMessage, makeOffer]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMarketplace() {
  const value = useContext(Context);
  if (!value) throw new Error("useMarketplace must be used inside AppProvider");
  return value;
}
