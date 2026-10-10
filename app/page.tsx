"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Search, SlidersHorizontal, X, Play } from "lucide-react";
import { categories } from "@/lib/catalog";
import { useMarketplace } from "@/components/app-provider";
import { ProductCard } from "@/components/product-card";

export default function MarketplacePage() {
  const { products, cartCount } = useMarketplace();
  const [category, setCategory] = useState("Everything");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Everywhere");
  const [condition, setCondition] = useState("Any condition");
  const [sortBy, setSortBy] = useState("Fresh finds");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = products.filter((product) =>
      (category === "Everything" || product.category === category) &&
      (!needle || `${product.title} ${product.description} ${product.category} ${product.sellerName}`.toLowerCase().includes(needle)) &&
      (location === "Everywhere" || product.location.includes(location)) &&
      (condition === "Any condition" || product.condition.toLowerCase().includes(condition.toLowerCase()))
    );
    if (sortBy === "Price: low to high") result.sort((a, b) => a.price - b.price);
    if (sortBy === "Most loved") result.sort((a, b) => b.likes - a.likes);
    return result;
  }, [products, category, query, location, condition, sortBy]);
  const clearFilters = () => { setCategory("Everything"); setQuery(""); setLocation("Everywhere"); setCondition("Any condition"); };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-7 lg:px-10">
      <section className="relative mb-12 mt-7 overflow-hidden rounded-[8px] bg-[#d8fb50] sm:mb-16 sm:mt-9">
        <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[1px] border-[#142a2a]/10 sm:right-[19%] sm:top-[-126px] sm:h-[470px] sm:w-[470px]" />
        <div className="absolute -right-4 -top-9 h-52 w-52 rounded-full border-[1px] border-[#142a2a]/10 sm:right-[21%] sm:top-[-106px] sm:h-[430px] sm:w-[430px]" />
        <div className="relative grid min-h-[330px] grid-cols-1 items-center gap-5 px-6 py-8 sm:min-h-[390px] sm:px-12 lg:grid-cols-[1.15fr_.85fr] lg:px-[7.5%]">
          <div className="max-w-[610px]">
            <p className="mono animate-enter text-[10px] uppercase tracking-[.21em]">Good finds. Good people. Lagos and beyond.</p>
            <h1 className="display animate-enter animate-delay-1 mt-5 text-[48px] font-bold leading-[.91] tracking-[-.085em] sm:text-[68px] lg:text-[80px]">The good stuff<br />is <span className="relative inline-block">out there.<span className="absolute -bottom-1 left-0 h-[6px] w-full -rotate-[2deg] bg-[#fa765b] sm:h-[9px]" /></span></h1>
            <p className="animate-enter animate-delay-2 mt-5 max-w-[395px] text-[13px] font-medium leading-6 text-[#32483e] sm:text-[14px]">Find a thing with a past. Meet the person behind it. Make an offer that feels right.</p>
            <div className="animate-enter animate-delay-3 mt-6 flex flex-wrap items-center gap-3">
              <a href="#the-finds" className="flex items-center gap-2 rounded-full bg-[#142a2a] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-[#365350]">Start exploring <ArrowDown size={14} /></a>
              <Link href="/video" className="flex items-center gap-2 rounded-full border border-[#142a2a]/25 px-4 py-3 text-[11px] font-extrabold transition hover:bg-[#fffdf7]/50"><Play size={13} fill="currentColor" /> See it in motion</Link>
            </div>
          </div>
          <div className="relative hidden min-h-[250px] lg:block">
            <div className="absolute right-[22%] top-[0] h-[258px] w-[258px] -rotate-[8deg] overflow-hidden rounded-[4px] border-[9px] border-[#fffdf7] bg-[#e7cec0] shadow-xl">
              <img src="/products/film-camera.png" alt="A silver Minolta camera, one of today's finds" className="h-full w-full object-cover" />
            </div>
            <div className="absolute right-[4%] top-[106px] rotate-[8deg] rounded-[3px] bg-[#fa765b] px-4 py-3 text-[11px] font-extrabold leading-tight shadow-lg">GOOD THINGS<br />CHANGE HANDS</div>
            <div className="absolute bottom-[4px] right-[49%] rotate-[8deg] rounded-full bg-[#fffdf7] px-4 py-2 text-[10px] font-bold shadow-md">scroll & fall in love ↘</div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden rounded-tl-[9px] bg-[#142a2a] px-5 py-3 text-[#d8fb50] md:block"><span className="mono text-[9px] uppercase tracking-[.17em]">A little less new. A lot more you.</span></div>
      </section>

      <section id="the-finds" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[9px] uppercase tracking-[.2em] text-[#75817c]">The neighborhood shelf</p>
            <h2 className="display mt-2 text-[33px] font-bold tracking-[-.075em] sm:text-[40px]">Find your next <span className="text-[#fa765b]">thing.</span></h2>
          </div>
          <p className="mono text-[10px] uppercase tracking-[.13em] text-[#75817c]">{visibleProducts.length} good {visibleProducts.length === 1 ? "find" : "finds"} · {cartCount} in your bag</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-y border-[#dcded4] py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-extrabold transition ${category === item ? "bg-[#142a2a] text-[#f4f1e9]" : "bg-[#e8e8dd] text-[#56645d] hover:bg-[#dcdfd3]"}`}>{item}</button>)}
          </div>
          <div className="flex min-w-0 gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#d5d8ce] bg-[#fffdf7]/60 px-4 lg:w-[260px] lg:flex-none">
              <Search size={15} className="shrink-0 text-[#75817c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search the marketplace" placeholder="Search good stuff..." className="h-10 min-w-0 flex-1 bg-transparent text-[11px] font-semibold outline-none placeholder:text-[#929b92]" />
              {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
            </label>
            <button onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[11px] font-extrabold transition ${filtersOpen ? "border-[#142a2a] bg-[#142a2a] text-white" : "border-[#d5d8ce] hover:border-[#142a2a]"}`}><SlidersHorizontal size={14} /> <span className="hidden sm:inline">Filter</span></button>
            <label className="hidden items-center gap-2 rounded-full border border-[#d5d8ce] px-3 sm:flex">
              <span className="mono text-[8px] uppercase tracking-[.13em] text-[#7c8981]">Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products" className="max-w-[122px] bg-transparent text-[10px] font-bold outline-none"><option>Fresh finds</option><option>Price: low to high</option><option>Most loved</option></select>
            </label>
          </div>
        </div>

        {filtersOpen && <div className="animate-enter flex flex-wrap items-end gap-3 border-b border-[#dcded4] bg-[#eae9df] px-4 py-4">
          <label className="flex flex-col gap-1.5 text-[10px] font-extrabold uppercase tracking-[.1em]">Around
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="min-w-[145px] rounded-lg border border-[#d1d5cb] bg-[#fffdf7] px-3 py-2.5 text-xs font-semibold normal-case tracking-normal outline-none"><option>Everywhere</option><option>Lagos Island</option><option>Lekki</option><option>Yaba</option><option>Surulere</option><option>Ikeja</option><option>Gbagada</option></select>
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] font-extrabold uppercase tracking-[.1em]">Condition
            <select value={condition} onChange={(event) => setCondition(event.target.value)} className="min-w-[170px] rounded-lg border border-[#d1d5cb] bg-[#fffdf7] px-3 py-2.5 text-xs font-semibold normal-case tracking-normal outline-none"><option>Any condition</option><option>Like new</option><option>Great condition</option><option>Good</option></select>
          </label>
          <label className="flex flex-col gap-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] sm:hidden">Sort
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-w-[145px] rounded-lg border border-[#d1d5cb] bg-[#fffdf7] px-3 py-2.5 text-xs font-semibold normal-case tracking-normal outline-none"><option>Fresh finds</option><option>Price: low to high</option><option>Most loved</option></select>
          </label>
          <button onClick={clearFilters} className="ml-auto flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-extrabold text-[#68756c] hover:text-[#c34c3c]"><X size={13} /> Clear all</button>
        </div>}

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 pt-6 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
        </div>
        {visibleProducts.length === 0 && <div className="my-10 rounded-[8px] border border-dashed border-[#bcc8b6] bg-[#edf0e5] px-6 py-14 text-center">
          <p className="mono text-[9px] uppercase tracking-[.2em] text-[#75817c]">Nothing on this shelf</p>
          <h3 className="display mt-3 text-2xl font-bold tracking-[-.05em]">Try another little corner?</h3>
          <p className="mt-2 text-sm text-[#75817c]">Change your search or loosen a filter to see what turns up.</p>
          <button onClick={clearFilters} className="mt-5 rounded-full bg-[#142a2a] px-5 py-3 text-[11px] font-extrabold text-white">Clear filters</button>
        </div>}
      </section>

      <section className="mt-16 grid overflow-hidden rounded-[7px] bg-[#142a2a] text-[#f4f1e9] sm:grid-cols-[1fr_auto]">
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <p className="mono text-[9px] uppercase tracking-[.19em] text-[#b0c3b1]">Every good thing has a story</p>
          <h2 className="display mt-3 max-w-[550px] text-[32px] font-bold leading-[1.02] tracking-[-.06em] sm:text-[42px]">Show the details. Find your person.</h2>
          <p className="mt-3 max-w-[410px] text-[12px] leading-6 text-[#bdc9bf]">Put your thing out there with a little video, then let the conversation do its thing.</p>
        </div>
        <Link href="/sell" className="flex items-center gap-3 bg-[#fa765b] px-7 py-7 text-sm font-extrabold text-[#142a2a] transition hover:bg-[#ff8b70] sm:px-10"><span>List something lovely</span><ArrowUpRight size={19} /></Link>
      </section>
    </div>
  );
}
