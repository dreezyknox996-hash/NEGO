"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, MessageCircle, MoreHorizontal, Paperclip, Send, ShieldCheck, SmilePlus, X } from "lucide-react";
import { useMarketplace } from "@/components/app-provider";
import { formatPrice } from "@/lib/format";

const contacts = [
  { name: "Maya R.", initials: "MR", item: "Minolta X-700 film camera", image: "/products/film-camera.png", time: "10:35 AM", unread: 1, online: true },
  { name: "Theo L.", initials: "TL", item: "Space-age mushroom lamp", image: "/products/red-lamp.png", time: "Yesterday", unread: 0, online: false },
  { name: "Sam P.", initials: "SP", item: "Club C vintage court shoes", image: "/products/sneakers.png", time: "Monday", unread: 0, online: false },
];

export default function ChatPage() {
  const { threadMessages, sendMessage, makeOffer, products } = useMarketplace();
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileThread, setMobileThread] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const contact = contacts[selected];
  const messages = threadMessages[contact.name] ?? [];
  const product = products.find((item) => item.title === contact.item) ?? products[0];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selected]);

  const visibleContacts = contacts.filter((item) => `${item.name} ${item.item}`.toLowerCase().includes(contactSearch.toLowerCase()));
  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    sendMessage(text, contact.name);
    setText("");
    setNotice("");
  };
  const submitOffer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(offerAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount >= product.price) {
      setNotice(`Enter an offer under ${formatPrice(product.price)}.`);
      return;
    }
    makeOffer(amount, contact.name);
    setOfferOpen(false);
    setOfferAmount("");
    setNotice("Offer sent. The conversation just got interesting.");
  };

  return <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-7 sm:py-8 lg:px-10">
    <div className="mb-5 flex items-end justify-between">
      <div><p className="mono text-[9px] uppercase tracking-[.2em] text-[#64748b]">A good deal starts with a hello</p><h1 className="display mt-2 text-3xl font-bold tracking-[-.07em] sm:text-[38px]">Your conversations<span className="text-[#ff6b6b]">.</span></h1></div>
      <span className="hidden rounded-full bg-[#e0f2fe] px-3 py-2 text-[9px] font-extrabold uppercase tracking-[.11em] text-[#1e293b] sm:inline-flex"><ShieldCheck size={12} className="mr-1.5" /> Keep it kind, keep it local</span>
    </div>

    <section className="grid h-[min(720px,calc(100dvh-200px))] min-h-[520px] overflow-hidden rounded-[14px] border border-[#dbe4f0] bg-[#fffdf5] shadow-sm md:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[315px_minmax(0,1fr)_280px]">
      <aside className={`${mobileThread ? "hidden md:flex" : "flex"} flex-col border-r border-[#dbe4f0] bg-[#fffdf5]`}>
        <div className="flex h-[66px] items-center justify-between border-b border-[#dbe4f0] px-5"><span className="display text-lg font-bold tracking-[-.04em]">Inbox</span><span className="rounded-full bg-[#e0f2fe] px-2.5 py-1 text-[9px] font-extrabold text-[#1e293b]">3 THREADS</span></div>
        <label className="mx-4 mt-4 flex h-10 items-center gap-2 rounded-full bg-[#e0f2fe] px-3 text-[#64748b]"><MessageCircle size={14} /><input value={contactSearch} onChange={(event) => setContactSearch(event.target.value)} aria-label="Search conversations" placeholder="Find a conversation..." className="min-w-0 flex-1 bg-transparent text-[10px] outline-none placeholder:text-[#94a3b8]" />{contactSearch && <button type="button" aria-label="Clear conversation search" onClick={() => setContactSearch("")}><X size={13} /></button>}</label>
        <div className="mt-3 flex-1 overflow-y-auto">
          {visibleContacts.map((item) => { const index = contacts.indexOf(item); return <button key={item.name} onClick={() => { setSelected(index); setMobileThread(true); }} className={`flex w-full gap-3 border-b border-[#dbe4f0] px-4 py-4 text-left transition ${selected === index ? "bg-[#e0f2fe]" : "hover:bg-[#eff6ff]"}`}>
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#e0f2fe]"><img src={item.image} alt="" className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center bg-[#1e293b]/25 text-[10px] font-extrabold text-white">{item.initials}</span>{item.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#fffdf5] bg-[#1e40af]" />}</div>
            <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="text-[12px] font-extrabold">{item.name}</span><span className="text-[9px] text-[#64748b]">{threadMessages[item.name]?.at(-1)?.createdAt ?? item.time}</span></div><p className="mt-1 truncate text-[10px] text-[#64748b]">{threadMessages[item.name]?.at(-1)?.text ?? `About ${item.item}`}</p><p className="mt-1 truncate text-[9px] text-[#94a3b8]">{item.item}</p></div>
          </button>; })}
          {visibleContacts.length === 0 && <p className="px-5 py-8 text-center text-[10px] text-[#64748b]">No conversations match that search.</p>}
        </div>
        <div className="border-t border-[#dbe4f0] p-4"><div className="rounded-[10px] bg-[#e0f2fe] p-3"><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#1e40af]" /><span className="text-[10px] font-extrabold">A quick note</span></div><p className="mt-2 text-[9px] leading-4 text-[#64748b]">Meet somewhere public and trust your instincts. Good people appreciate the care.</p></div></div>
      </aside>

      <div className={`${mobileThread ? "flex" : "hidden md:flex"} min-w-0 flex-col`}>
        <div className="flex h-[66px] items-center justify-between border-b border-[#dbe4f0] px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setMobileThread(false)} aria-label="Back to inbox" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#e0f2fe] md:hidden"><ArrowLeft size={17} /></button>
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-[#e0f2fe] text-[10px] font-extrabold">{contact.initials}<span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#fffdf5] ${contact.online ? "bg-[#1e40af]" : "bg-[#94a3b8]"}`} /></span>
            <div><p className="text-[12px] font-extrabold">{contact.name}</p><p className="mt-0.5 text-[9px] text-[#64748b]">{contact.online ? "Around now" : "Last seen recently"}</p></div>
          </div>
          <div className="flex items-center gap-1"><span className="hidden rounded-full bg-[#e0f2fe] px-3 py-1.5 text-[9px] font-bold text-[#475569] sm:inline">On NEGO since 2023</span><button aria-label="Conversation options" onClick={() => setNotice("This conversation is part of your demo inbox.")} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#e0f2fe]"><MoreHorizontal size={18} /></button></div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#eff6ff] px-4 py-5 sm:px-7 sm:py-7">
          <div className="mx-auto mb-6 max-w-[430px] rounded-[12px] border border-[#dbe4f0] bg-[#fffdf5] p-3.5 shadow-sm sm:p-4">
            <div className="flex gap-3"><img src={product.image} alt="" className="h-[58px] w-[58px] rounded object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-extrabold">{product.title}</p><p className="mono mt-1 text-[10px]">{formatPrice(product.price)} <span className="text-[#64748b]">· {product.condition}</span></p><p className="mt-1 text-[9px] text-[#64748b]">Listed by {product.sellerName}</p></div><ChevronDown size={14} className="text-[#64748b]" /></div>
            {product.negotiable && <button onClick={() => { setOfferOpen(true); setNotice(""); }} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#ff6b6b] py-2.5 text-[10px] font-extrabold text-white transition hover:bg-[#f25757]"><ArrowUpRight size={13} /> Make an offer</button>}
          </div>
          <div className="mx-auto flex max-w-[530px] flex-col gap-3">
            <div className="my-1 flex items-center justify-center"><span className="rounded-full bg-[#fffdf5]/90 px-3 py-1 text-[9px] text-[#64748b] shadow-sm">Today</span></div>
            {messages.length === 0 && <div className="mx-auto max-w-[330px] rounded-[14px] border border-[#dbe4f0] bg-[#fffdf5] px-5 py-4 text-center shadow-sm"><p className="text-[11px] font-extrabold">A new conversation starts here.</p><p className="mt-1.5 text-[10px] leading-5 text-[#64748b]">Say hello to {contact.name}, ask about the {contact.item.toLowerCase()}, or make a friendly offer.</p></div>}
            {messages.map((message) => <div key={message.id} className={`flex ${message.sender === "buyer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-[15px] px-4 py-3 text-[11px] leading-5 shadow-sm sm:max-w-[70%] ${message.sender === "buyer" ? "rounded-br-[4px] bg-[#ff6b6b] text-white" : "rounded-bl-[4px] border border-[#dbe4f0] bg-[#fffdf5] text-[#334155]"}`}>
                {message.offerAmount && <div className="mb-2 border-b border-white/30 pb-2"><p className="mono text-[8px] uppercase tracking-[.14em]">Offer sent</p><p className="display mt-1 text-xl font-bold tracking-[-.05em]">{formatPrice(message.offerAmount)}</p></div>}
                {message.text}<p className={`mt-1.5 text-right text-[8px] ${message.sender === "buyer" ? "text-white/80" : "text-[#94a3b8]"}`}>{message.createdAt}</p>
              </div>
            </div>)}
            <div ref={bottomRef} />
          </div>
        </div>

        {notice && <div role="status" className="flex items-center justify-between border-t border-[#dbe4f0] bg-[#e0f2fe] px-5 py-2.5 text-[10px] font-semibold text-[#1e293b]"><span>{notice}</span><button aria-label="Dismiss notice" onClick={() => setNotice("")}><X size={13} /></button></div>}
        <form onSubmit={submitMessage} className="flex items-center gap-2 border-t border-[#dbe4f0] bg-[#fffdf5] px-3 py-3 sm:px-5">
          <button type="button" aria-label="Attach file" onClick={() => setNotice("File sharing is not available in this demo. Try a message or offer instead.")} className="hidden h-9 w-9 place-items-center rounded-full text-[#64748b] hover:bg-[#e0f2fe] sm:grid"><Paperclip size={16} /></button>
          <label className="flex min-w-0 flex-1 items-center rounded-full bg-[#e0f2fe] px-4"><input value={text} onChange={(event) => setText(event.target.value)} aria-label="Write a message" placeholder={`Message ${contact.name}...`} className="h-11 min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#94a3b8]" /><button type="button" aria-label="Message tips" onClick={() => setNotice("Say hi, ask a question, or send an offer. It’s up to you.")} className="text-[#64748b]"><SmilePlus size={16} /></button></label>
          <button disabled={!text.trim()} type="submit" aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ff6b6b] text-white transition hover:bg-[#f25757]"><Send size={15} /></button>
        </form>
      </div>

      <aside className="hidden flex-col border-l border-[#dbe4f0] bg-[#eff6ff] xl:flex">
        <div className="border-b border-[#dbe4f0] px-5 py-5"><p className="mono text-[9px] uppercase tracking-[.16em] text-[#64748b]">The person behind it</p><div className="mt-4 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#ff6b6b] text-xs font-extrabold text-white">{contact.initials}</span><div><p className="text-xs font-extrabold">{contact.name}</p><p className="mt-1 text-[9px] text-[#64748b]">Local seller · 4.9 good vibes</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><span className="rounded bg-[#e0f2fe] p-2 text-center"><b className="block text-[12px]">12</b><small className="text-[8px] text-[#64748b]">good finds sold</small></span><span className="rounded bg-[#e0f2fe] p-2 text-center"><b className="block text-[12px]">2023</b><small className="text-[8px] text-[#64748b]">joined NEGO</small></span></div></div>
        <div className="p-5"><p className="mono text-[9px] uppercase tracking-[.16em] text-[#64748b]">Meetup idea</p><div className="mt-3 rounded-[10px] bg-[#e0f2fe] p-4"><p className="text-[11px] font-extrabold">Keep it in the neighborhood.</p><p className="mt-2 text-[10px] leading-5 text-[#475569]">Pick a public spot you both know. Coffee shops are a classic.</p><span className="mt-3 inline-block rounded-full bg-[#fffdf5]/90 px-2.5 py-1.5 text-[9px] font-bold">Lagos · local meetup</span></div><button onClick={() => setNotice("Meetup planning is a conversation between you and the seller.")} className="mt-3 w-full rounded-full border border-[#cbd5e1] py-3 text-[10px] font-extrabold hover:bg-[#fffdf5]">Plan a meetup</button></div>
        <div className="mt-auto flex items-center gap-2 border-t border-[#dbe4f0] px-5 py-4 text-[9px] text-[#64748b]"><Check size={13} className="text-[#1e40af]" /> Your conversation stays private.</div>
      </aside>
    </section>

    {offerOpen && <div className="fixed inset-0 z-[80] grid place-items-center bg-[#1e293b]/45 px-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setOfferOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="offer-title" className="modal-enter relative w-full max-w-[390px] rounded-[19px] bg-[#fffdf5] p-7 shadow-2xl">
        <button onClick={() => setOfferOpen(false)} aria-label="Close offer dialog" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-[#e0f2fe]"><X size={17} /></button>
        <p className="mono text-[9px] uppercase tracking-[.17em] text-[#64748b]">Good deals start somewhere</p><h2 id="offer-title" className="display mt-3 text-[29px] font-bold tracking-[-.065em]">Make it an offer.</h2><p className="mt-2 text-[11px] leading-5 text-[#64748b]">A kind, fair offer for <b className="text-[#1e293b]">{product.title}</b>. Listed at {formatPrice(product.price)}.</p>
        <form onSubmit={submitOffer} className="mt-5">
          <label className="block text-[10px] font-extrabold">Your offer in NGN<input autoFocus type="number" min="1" max={product.price - 1} step="1" value={offerAmount} onChange={(event) => { setOfferAmount(event.target.value); setNotice(""); }} placeholder="₦ —" className="mono mt-2 w-full rounded-xl border border-[#dbe4f0] bg-transparent px-4 py-3.5 text-lg outline-none focus:border-[#1e40af]" /></label>
          <div className="mt-3 flex gap-2">{[product.price - 5000, product.price - 10000, Math.round(product.price * .8)].filter((amount, index, arr) => amount > 0 && arr.indexOf(amount) === index).map((amount) => <button key={amount} type="button" onClick={() => setOfferAmount(String(amount))} className="rounded-full bg-[#e0f2fe] px-3 py-2 text-[9px] font-bold hover:bg-[#dbeafe]">{formatPrice(amount)}</button>)}</div>
          {notice && <p role="alert" className="mt-3 text-[10px] font-semibold text-[#c34c3c]">{notice}</p>}
          <button className="mt-5 w-full rounded-full bg-[#ff6b6b] py-3.5 text-[11px] font-extrabold text-white transition hover:bg-[#f25757]">Send a friendly offer</button>
        </form>
      </section>
    </div>}
  </div>;
}
