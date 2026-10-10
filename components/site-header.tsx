"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { X, ShoppingBag, MessageCircle, CircleUserRound, Plus, Minus, Trash2, ArrowRight, Menu, Compass, Play } from "lucide-react";
import { useMarketplace } from "@/components/app-provider";
import { formatPrice } from "@/lib/format";

const links = [
  { href: "/", label: "Discover" },
  { href: "/video", label: "Watch" },
  { href: "/chat", label: "Messages" },
  { href: "/sell", label: "Sell a thing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { cart, products, cartCount, updateCart, removeFromCart, profile, setProfile } = useMarketplace();
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const subtotal = cart.reduce((sum, line) => sum + (products.find((item) => item.id === line.productId)?.price ?? 0) * line.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#1e40af] bg-[#1e40af] text-white backdrop-blur-md">
        <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="NEGO home">
              <span className="display grid h-9 w-9 rotate-[-5deg] place-items-center rounded-[11px] bg-[#ff6b6b] text-[18px] font-bold tracking-[-.1em] text-white transition-transform group-hover:rotate-0">N.</span>
            <span className="display text-[24px] font-bold tracking-[-.09em]">nego<span className="text-[#ff6b6b]">.</span></span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={`rounded-full px-4 py-2 text-[12px] font-bold transition-colors ${pathname === href ? "bg-[#1e293b] text-white" : "text-white/85 hover:bg-[#1d4ed8] hover:text-white"}`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/chat" className="relative hidden h-10 w-10 place-items-center rounded-full text-white transition hover:bg-[#1d4ed8] sm:grid" aria-label="Open messages">
              <MessageCircle size={18} strokeWidth={1.7} />
              <span className="absolute right-[6px] top-[5px] h-[7px] w-[7px] rounded-full border-2 border-[#1e40af] bg-[#ff6b6b]" />
            </Link>
            <button onClick={() => { setCartOpen(true); setCheckoutMessage(""); }} className="relative grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-[#1d4ed8]" aria-label={`Open cart, ${cartCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.7} />
              {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-h-[17px] min-w-[17px] place-items-center rounded-full bg-[#ff6b6b] px-1 text-[9px] font-extrabold text-white">{cartCount}</span>}
            </button>
            <button onClick={() => setLoginOpen(true)} className="hidden h-10 items-center gap-2 rounded-full border border-white/45 px-4 text-[11px] font-extrabold transition hover:border-white hover:bg-white/10 sm:flex" aria-label={profile ? `Signed in as ${profile.name}` : "Open demo profile"}>
              <CircleUserRound size={16} /> <span>{profile?.name.split(" ")[0] ?? "Log in"}</span>
            </button>
            <button onClick={() => setMobileMenuOpen((value) => !value)} aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-[#1d4ed8] md:hidden">
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="grid gap-1 border-t border-white/20 bg-[#1e40af] px-4 py-3 text-white md:hidden" aria-label="Mobile navigation">
            {links.map(({ href, label }) => <Link key={href} onClick={() => setMobileMenuOpen(false)} href={href} className={`rounded-xl px-4 py-3 text-sm font-bold ${pathname === href ? "bg-[#1e293b] text-white" : "hover:bg-[#1d4ed8]"}`}>{label}</Link>)}
            <button onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }} className="rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-[#1d4ed8]">Demo profile</button>
          </nav>
        )}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[66px] items-center justify-around border-t border-[#dbe4f0] bg-[#eff6ff]/95 backdrop-blur-md md:hidden" aria-label="Mobile bottom navigation">
        {links.map(({ href, label }) => {
          const Icon = href === "/" ? Compass : href === "/video" ? Play : href === "/chat" ? MessageCircle : Plus;
          return <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} aria-label={label} className={`relative flex min-w-[58px] flex-col items-center gap-1 ${pathname === href ? "text-[#1e293b]" : "text-[#64748b]"}`}>
            <Icon size={18} strokeWidth={pathname === href ? 2.3 : 1.7} />
            <span className="text-[9px] font-bold">{label === "Sell a thing" ? "Sell" : label}</span>
            {href === "/chat" && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff6b6b] px-1 text-[8px] font-extrabold text-white">1</span>}
          </Link>;
        })}
      </nav>

      {cartOpen && (
        <div className="fixed inset-0 z-[70]">
          <button aria-label="Close cart" onClick={() => setCartOpen(false)} className="absolute inset-0 bg-[#1e293b]/45" />
          <aside role="dialog" aria-modal="true" aria-label="Your cart" className="drawer-enter absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-[#fffdf5] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#dbe4f0] px-6 py-5">
              <div><p className="mono text-[9px] uppercase tracking-[.18em] text-[#64748b]">The good stuff</p><h2 className="display mt-1 text-2xl font-bold tracking-[-.06em]">Your bag <span className="text-[#94a3b8]">({cartCount})</span></h2></div>
              <button aria-label="Close cart drawer" onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#e0f2fe]"><X size={19} /></button>
            </div>
            <div className="hide-scrollbar flex-1 overflow-y-auto px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#e0f2fe]"><ShoppingBag size={25} strokeWidth={1.4} /></div>
                  <h3 className="display mt-5 text-xl font-bold">Nothing in your bag. Yet.</h3>
                  <p className="mt-2 max-w-[240px] text-sm leading-6 text-[#64748b]">Find something with a story and bring it home.</p>
                  <button onClick={() => setCartOpen(false)} className="mt-6 rounded-full bg-[#ff6b6b] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#f25757]">Go find a good thing</button>
                </div>
              ) : (
                <div className="divide-y divide-[#dbe4f0]">
                  {cart.map((line) => {
                    const item = products.find((product) => product.id === line.productId);
                    if (!item) return null;
                    return <div key={line.productId} className="flex gap-4 py-5">
                      <img src={item.image} alt="" className="h-[88px] w-[82px] rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2"><p className="truncate text-sm font-extrabold">{item.title}</p><span className="mono text-xs">{formatPrice(item.price * line.quantity)}</span></div>
                        <p className="mt-1 text-[11px] text-[#64748b]">From {item.sellerName}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[#dbe4f0]">
                            <button aria-label={`Decrease ${item.title} quantity`} onClick={() => updateCart(item.id, line.quantity - 1)} className="grid h-7 w-7 place-items-center"><Minus size={12} /></button>
                            <span className="mono min-w-6 text-center text-[11px]">{line.quantity}</span>
                            <button aria-label={`Increase ${item.title} quantity`} onClick={() => updateCart(item.id, line.quantity + 1)} className="grid h-7 w-7 place-items-center"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-1 text-[10px] font-bold text-[#64748b] hover:text-[#ff6b6b]"><Trash2 size={12} /> Remove</button>
                        </div>
                      </div>
                    </div>;
                  })}
                </div>
              )}
            </div>
            {cart.length > 0 && <div className="border-t border-[#dbe4f0] px-6 pb-7 pt-5">
              <div className="flex justify-between text-sm"><span className="font-semibold">Subtotal</span><span className="mono">{formatPrice(subtotal)}</span></div>
              <p className="mt-2 text-[10px] leading-5 text-[#64748b]">Pickup and payment details are arranged directly with each seller.</p>
              {checkoutMessage ? <div role="status" className="mt-4 rounded-xl bg-[#e0f2fe] p-3 text-center"><p className="text-xs font-bold">{checkoutMessage}</p><Link href="/chat" onClick={() => setCartOpen(false)} className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold underline underline-offset-4">Open messages <ArrowRight size={12} /></Link></div> :
                <button onClick={() => { setCheckoutMessage("Nice finds. Your sellers are ready to chat."); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b6b] py-4 text-xs font-extrabold text-white transition hover:bg-[#f25757]">Continue to chat <ArrowRight size={15} /></button>}
            </div>}
          </aside>
        </div>
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSave={(nextProfile) => { setProfile(nextProfile); setLoginOpen(false); }} />}
    </>
  );
}

function LoginModal({ onClose, onSave }: { onClose: () => void; onSave: (profile: { name: string; email: string }) => void }) {
  const { profile, setProfile } = useMarketplace();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Add a name and a valid email to continue.");
      return;
    }
    onSave({ name: name.trim(), email: email.trim() });
  };
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-[#1e293b]/45 px-4 py-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="profile-title" className="modal-enter relative w-full max-w-[410px] rounded-[22px] bg-[#fffdf5] p-7 shadow-2xl sm:p-9">
      <button aria-label="Close profile dialog" onClick={onClose} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full hover:bg-[#e0f2fe]"><X size={18} /></button>
      <span className="mono inline-flex rounded-full bg-[#e0f2fe] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[.17em]">Just for this demo</span>
      <h2 id="profile-title" className="display mt-5 text-[32px] font-bold leading-[1.03] tracking-[-.07em]">Hey, nice to<br />meet you.</h2>
      <p className="mt-3 text-sm leading-6 text-[#64748b]">A name and email make this little demo feel more personal. No account, no password, no backend.</p>
      {profile && <button onClick={() => { setProfile(null); onClose(); }} className="mt-4 text-xs font-bold text-[#ff6b6b] underline underline-offset-4">Clear demo profile</button>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-xs font-bold">What should we call you?<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dbe4f0] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#1e40af]" placeholder="Your name" /></label>
        <label className="block text-xs font-bold">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dbe4f0] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#1e40af]" placeholder="you@example.com" /></label>
        {error && <p role="alert" className="text-xs font-semibold text-[#c34c3c]">{error}</p>}
        <button type="submit" className="w-full rounded-full bg-[#ff6b6b] py-3.5 text-xs font-extrabold text-white transition hover:bg-[#f25757]">Come on in</button>
      </form>
      <p className="mt-4 text-center text-[10px] text-[#64748b]">Your details stay on this screen only. Please don’t enter sensitive information.</p>
    </section>
  </div>;
}
