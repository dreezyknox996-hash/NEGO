"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Heart, MessageCircle, Pause, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { useMarketplace } from "@/components/app-provider";
import { formatPrice } from "@/lib/format";

export default function VideoPage() {
  const { products, addToCart } = useMarketplace();
  const clips = products.filter((product) => product.videoUrl || product.image).slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const product = clips[active];

  useEffect(() => {
    setLiked(false);
    setAdded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [active]);

  useEffect(() => {
    if (videoRef.current) {
      if (paused) videoRef.current.pause();
      else void videoRef.current.play().catch(() => undefined);
    }
    if (paused || clips.length < 2) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % clips.length), 15000);
    return () => window.clearTimeout(timer);
  }, [active, paused, clips.length]);

  if (!product) return <div className="p-10 text-center">No seller clips just yet.</div>;

  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-5 sm:px-7 sm:pt-8 lg:px-10">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div><p className="mono text-[9px] uppercase tracking-[.2em] text-[#75817c]">A closer look, from the people who found it</p><h1 className="display mt-2 text-3xl font-bold tracking-[-.07em] sm:text-[38px]">Good things, <span className="text-[#fa765b]">in motion.</span></h1></div>
      <span className="mono text-[9px] uppercase tracking-[.15em] text-[#75817c]">{String(active + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")} · 15 sec each</span>
    </div>

    <section className="grid min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
      <div className="relative mx-auto aspect-[9/13] min-h-[530px] w-full max-w-[480px] overflow-hidden rounded-[7px] bg-[#223c38] sm:aspect-[9/12] lg:max-w-[480px]">
        {product.videoUrl ? <video ref={videoRef} key={product.id} src={product.videoUrl} poster={product.image} autoPlay muted={muted} loop playsInline className="absolute inset-0 h-full w-full object-cover" /> : <img key={product.id} src={product.image} alt={`${product.title} close-up`} className={`absolute inset-0 h-full w-full object-cover ${paused ? "" : "clip-drift"}`} />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#142a2a]/90 via-[#142a2a]/10 to-[#142a2a]/15" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <span className="rounded-full border border-white/30 bg-[#142a2a]/35 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.14em] text-white backdrop-blur">Seller's 15-second peek</span>
          <span className="mono text-[10px] font-medium text-white">00:15</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d8fb50] text-[10px] font-extrabold text-[#142a2a]">{product.sellerName.split(" ").map((s) => s[0]).join("")}</span>
            <span className="text-xs font-bold text-white">{product.sellerName}</span>
            <span className="h-1 w-1 rounded-full bg-white/60" />
            <span className="text-[10px] font-medium text-white/75">{product.location}</span>
          </div>
          <h2 className="display max-w-[540px] text-[27px] font-bold leading-[1.04] tracking-[-.055em] text-white sm:text-[38px]">{product.title}</h2>
          <p className="mt-2 line-clamp-2 max-w-[510px] text-[11px] leading-5 text-white/75">{product.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="mono rounded-full bg-[#d8fb50] px-4 py-2.5 text-sm font-medium text-[#142a2a]">{formatPrice(product.price)}</span>
            {product.negotiable && <span className="rounded-full border border-white/35 px-3 py-2.5 text-[9px] font-extrabold uppercase tracking-[.11em] text-white">Make an offer</span>}
            <button onClick={handleAdd} aria-label={added ? `${product.title} added to cart` : `Add ${product.title} to cart`} className="flex items-center gap-1.5 rounded-full bg-[#d8fb50] px-4 py-3 text-[10px] font-extrabold text-[#142a2a] transition hover:bg-[#c8ef37]">
              {added ? <><Check size={13} /> Added</> : <><Plus size={13} /> Add to cart</>}
            </button>
            <Link href="/chat" className="flex items-center gap-1.5 rounded-full bg-[#fffdf7] px-4 py-3 text-[10px] font-extrabold text-[#142a2a] transition hover:bg-[#d8fb50]"><MessageCircle size={13} /> Ask seller</Link>
          </div>
        </div>
        <button aria-label={paused ? "Play seller preview" : "Pause seller preview"} onClick={() => { setPaused((value) => { const next = !value; if (videoRef.current) { if (next) videoRef.current.pause(); else void videoRef.current.play().catch(() => undefined); } return next; }); }} className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-[#142a2a]/40 text-white opacity-70 backdrop-blur transition hover:opacity-100 focus:opacity-100">
          {paused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
        </button>
        <button aria-label={muted ? "Unmute preview" : "Mute preview"} onClick={() => setMuted((value) => { const next = !value; if (videoRef.current) videoRef.current.muted = next; return next; })} className="absolute bottom-[130px] right-5 grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-[#142a2a]/25 text-white backdrop-blur hover:bg-[#142a2a]/50 sm:bottom-[145px]">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20"><div key={`${active}-${paused}`} className={`h-full w-full origin-left bg-[#d8fb50] ${paused ? "" : "clip-progress"}`} /></div>
      </div>

      <aside className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center gap-2 rounded-[6px] bg-[#fffdf7] p-4">
          <button onClick={() => setLiked((value) => !value)} aria-label={liked ? "Unlike listing" : "Like listing"} className={`grid h-10 w-10 place-items-center rounded-full ${liked ? "bg-[#fa765b] text-white" : "bg-[#f4f1e9] text-[#142a2a]"}`}><Heart size={16} fill={liked ? "currentColor" : "none"} /></button>
          <div className="min-w-0 flex-1"><p className="text-xs font-extrabold">{liked ? product.likes + 1 : product.likes} people like this</p><p className="mt-1 text-[10px] text-[#75817c]">Small things find good homes here.</p></div>
          <button onClick={() => setActive((current) => (current + 1) % clips.length)} aria-label="Skip to next clip" className="grid h-9 w-9 place-items-center rounded-full border border-[#dcded4] hover:bg-[#edf0e5]"><ArrowDown size={15} /></button>
        </div>
        <div className="flex items-center justify-between px-1">
          <div><p className="mono text-[9px] uppercase tracking-[.15em] text-[#75817c]">Little video, big feeling</p><h3 className="display mt-1 text-xl font-bold tracking-[-.05em]">Made by the seller.</h3></div>
          <span className="mono text-[9px] text-[#75817c]">{clips.length} clips</span>
        </div>
        <div className="hide-scrollbar flex min-w-0 gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {clips.map((clip, index) => <button key={clip.id} onClick={() => setActive(index)} aria-label={`Watch ${clip.title}`} className={`group flex min-w-[225px] items-center gap-3 rounded-[6px] p-2 text-left transition lg:min-w-0 ${active === index ? "bg-[#d8fb50]" : "bg-[#fffdf7] hover:bg-[#eceee1]"}`}>
            <div className="relative h-[68px] w-[60px] shrink-0 overflow-hidden rounded-[4px]"><img src={clip.image} alt="" className="h-full w-full object-cover" />{active === index && <span className="absolute inset-0 grid place-items-center bg-[#142a2a]/25"><Pause size={15} className="text-white" /></span>}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold">{clip.title}</p><p className="mt-1 text-[9px] text-[#75817c]">{clip.sellerName} · {clip.location}</p><p className="mono mt-2 text-[10px]">{formatPrice(clip.price)}</p></div><ArrowUpRight size={14} className="mr-1 shrink-0 text-[#75817c]" />
          </button>)}
        </div>
      </aside>
    </section>
    <style jsx global>{`
      @keyframes clip-drift { from { transform: scale(1.025) translate3d(-.8%, .4%, 0); } to { transform: scale(1.12) translate3d(1.2%, -1%, 0); } }
      @keyframes clip-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .clip-drift { animation: clip-drift 15s linear forwards; }
      .clip-progress { animation: clip-progress 15s linear forwards; }
    `}</style>
  </div>;
}
