"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ImagePlus, MapPin, Play, Upload, Video, X } from "lucide-react";
import { useMarketplace } from "@/components/app-provider";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

function readImage(file: File): Promise<string> {
  return createImageBitmap(file).then((bitmap) => {
    const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare photo.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.82);
  });
}

export default function SellPage() {
  const { addProduct, profile, products } = useMarketplace();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Home");
  const [condition, setCondition] = useState("Good, gently worn");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<Product | null>(null);
  const videoLabel = useMemo(() => videoFile ? `${videoFile.name} · ${(videoFile.size / (1024 * 1024)).toFixed(1)} MB` : "", [videoFile]);

  useEffect(() => {
    if (!imageFile) { setImagePreview(""); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);
  useEffect(() => {
    if (!videoFile) { setVideoPreview(""); return; }
    const url = URL.createObjectURL(videoFile);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (title.trim().length < 4) nextErrors.push("Give your thing a title (at least 4 characters).");
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) nextErrors.push("Add a price above ₦0.");
    if (!location.trim()) nextErrors.push("Add a neighborhood or city.");
    if (description.trim().length < 12) nextErrors.push("Tell buyers a little more (at least 12 characters).");
    if (!imageFile) nextErrors.push("Add one photo so people can see the good stuff.");
    if (imageFile && imageFile.size > 12 * 1024 * 1024) nextErrors.push("Keep photos under 12 MB.");
    if (videoFile && videoFile.size > 80 * 1024 * 1024) nextErrors.push("Keep videos under 80 MB.");
    setErrors(nextErrors);
    if (nextErrors.length) return;
    setSaving(true);
    try {
      const product: Product = {
        id: `listing-${Date.now()}`,
        title: title.trim(),
        price: Number(price),
        category,
        condition,
        location: location.trim(),
        sellerName: profile?.name ?? "You",
        image: await readImage(imageFile as File),
        description: description.trim(),
        likes: 0,
        negotiable: true,
        videoUrl: videoPreview || undefined,
      };
      addProduct(product, videoFile ?? undefined);
      setSuccess(product);
      setErrors([]);
      setTitle("");
      setPrice("");
      setLocation("");
      setDescription("");
      setImageFile(null);
      setVideoFile(null);
    } catch {
      setErrors(["We couldn't read that photo. Please choose it again and retry."]);
    } finally {
      setSaving(false);
    }
  };

  if (success) return <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-7 sm:py-20 lg:px-10">
    <section className="grid overflow-hidden rounded-[9px] bg-[#d8fb50] md:grid-cols-[1.05fr_.95fr]">
      <div className="px-7 py-10 sm:px-12 sm:py-14">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#142a2a] text-[#d8fb50]"><Check size={23} /></span>
        <p className="mono mt-7 text-[9px] uppercase tracking-[.2em]">It's out in the neighborhood</p>
        <h1 className="display mt-3 text-[43px] font-bold leading-[.98] tracking-[-.08em] sm:text-[55px]">Your thing has<br />a new story.</h1>
        <p className="mt-5 max-w-[330px] text-sm leading-6 text-[#425241]">It’s on the shelf with {products.length - 1} other good finds. Let the right person find it.</p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link href="/" className="flex items-center gap-2 rounded-full bg-[#142a2a] px-5 py-3.5 text-[11px] font-extrabold text-white">See it on the shelf <ArrowRight size={14} /></Link>
          <button onClick={() => { setSuccess(null); setImageFile(null); }} className="rounded-full border border-[#142a2a]/30 px-5 py-3.5 text-[11px] font-extrabold hover:bg-[#fffdf7]/40">List one more thing</button>
        </div>
      </div>
      <div className="relative min-h-[290px] bg-[#ef765d] md:min-h-full">
        <img src={success.image} alt={success.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-[5px] bg-[#fffdf7]/95 px-4 py-3 backdrop-blur"><span className="truncate pr-3 text-xs font-extrabold">{success.title}</span><span className="mono text-xs">{formatPrice(success.price)}</span></div>
      </div>
    </section>
  </div>;

  return <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-7 sm:px-7 sm:pt-10 lg:px-10">
    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#75817c] transition hover:text-[#142a2a]"><ArrowLeft size={14} /> Back to the good stuff</Link>
    <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.75fr)] lg:gap-14">
      <div>
        <p className="mono text-[9px] uppercase tracking-[.2em] text-[#75817c]">A thing you love. A person who will.</p>
        <h1 className="display mt-3 max-w-[650px] text-[45px] font-bold leading-[.96] tracking-[-.08em] sm:text-[61px]">Give it a good<br />next <span className="text-[#fa765b]">chapter.</span></h1>
        <p className="mt-4 max-w-[480px] text-[12px] leading-6 text-[#75817c]">A couple of honest details go a long way. A little video lets people meet your find before they meet you.</p>

        <form onSubmit={submit} className="mt-8 rounded-[8px] border border-[#dcded4] bg-[#fffdf7] p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between border-b border-[#e8e7df] pb-4"><div><p className="mono text-[9px] uppercase tracking-[.17em] text-[#75817c]">01 / Put it out there</p><h2 className="display mt-1 text-xl font-bold tracking-[-.05em]">The little details</h2></div><span className="rounded-full bg-[#edf1e4] px-3 py-1.5 text-[9px] font-extrabold">All fields marked * matter</span></div>
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <label className="sm:col-span-2 block text-[10px] font-extrabold">What are we calling it? *<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={70} required minLength={4} placeholder="e.g. A lamp with excellent taste" className="mt-2 w-full rounded-xl border border-[#dcded4] bg-[#fffdf7] px-4 py-3 text-[12px] font-semibold outline-none transition focus:border-[#738963]" /><span className="mt-1 block text-right text-[9px] font-normal text-[#99a298]">{title.length}/70</span></label>
            <label className="block text-[10px] font-extrabold">Price in NGN *<div className="mt-2 flex items-center rounded-xl border border-[#dcded4] px-4 focus-within:border-[#738963]"><span className="mono text-sm text-[#75817c]">₦</span><input type="number" min="1" max="1000000000" step="100" required value={price} onChange={(event) => setPrice(event.target.value)} placeholder="45,000" className="mono h-[45px] w-full bg-transparent pl-2 text-sm outline-none" /></div></label>
            <label className="block text-[10px] font-extrabold">Category *<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-[47px] w-full rounded-xl border border-[#dcded4] bg-[#fffdf7] px-3 text-[11px] font-semibold outline-none focus:border-[#738963]"><option>Home</option><option>Tech</option><option>Style</option><option>Collectibles</option></select></label>
            <label className="block text-[10px] font-extrabold">Condition *<select value={condition} onChange={(event) => setCondition(event.target.value)} className="mt-2 h-[47px] w-full rounded-xl border border-[#dcded4] bg-[#fffdf7] px-3 text-[11px] font-semibold outline-none focus:border-[#738963]"><option>Like new</option><option>Great condition</option><option>Good, gently worn</option><option>Well loved</option></select></label>
            <label className="block text-[10px] font-extrabold">Where can it be picked up? *<div className="mt-2 flex items-center rounded-xl border border-[#dcded4] px-3 focus-within:border-[#738963]"><MapPin size={15} className="shrink-0 text-[#809087]" /><input value={location} onChange={(event) => setLocation(event.target.value)} required placeholder="Yaba, Lagos" className="h-[45px] min-w-0 flex-1 bg-transparent px-2 text-[11px] outline-none" /></div></label>
            <label className="block text-[10px] font-extrabold sm:col-span-2">The story so far *<textarea value={description} onChange={(event) => setDescription(event.target.value)} required minLength={12} maxLength={600} rows={4} placeholder="What do you love about it? Anything the next person should know?" className="mt-2 w-full resize-y rounded-xl border border-[#dcded4] bg-[#fffdf7] px-4 py-3 text-[11px] leading-5 outline-none focus:border-[#738963]" /><span className="mt-1 block text-right text-[9px] font-normal text-[#99a298]">{description.length}/600</span></label>
          </div>

          <div className="mt-7 border-t border-[#e8e7df] pt-6">
            <p className="mono text-[9px] uppercase tracking-[.17em] text-[#75817c]">02 / Let them see it</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="group relative flex min-h-[138px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[7px] border border-dashed border-[#bcc6b7] bg-[#f6f5ef] px-3 text-center transition hover:border-[#738963] hover:bg-[#eef0e5]">
                {imagePreview ? <><img src={imagePreview} alt="Your selected listing photo preview" className="absolute inset-0 h-full w-full object-cover" /><span className="absolute inset-x-0 bottom-0 bg-[#142a2a]/80 py-2 text-[9px] font-bold text-white">Photo ready · change photo</span></> : <><span className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-[#dce7d3]"><ImagePlus size={17} /></span><span className="text-[10px] font-extrabold">Choose a cover photo *</span><span className="mt-1 text-[9px] text-[#869188]">JPG, PNG or WebP · up to 12 MB</span></>}
                <input aria-label="Choose listing photo" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { setImageFile(event.target.files?.[0] ?? null); setErrors([]); }} />
              </label>
              <label className="group relative flex min-h-[138px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[7px] border border-dashed border-[#bcc6b7] bg-[#f6f5ef] px-3 text-center transition hover:border-[#738963] hover:bg-[#eef0e5]">
                {videoPreview ? <><video src={videoPreview} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline loop /><span className="absolute right-2 top-2 rounded-full bg-[#142a2a]/80 px-2 py-1 text-[8px] font-extrabold text-white">PREVIEW</span><span className="absolute inset-x-0 bottom-0 truncate bg-[#142a2a]/80 px-2 py-2 text-[9px] font-bold text-white">{videoLabel}</span></> : <><span className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-[#f4ded3]"><Video size={17} /></span><span className="text-[10px] font-extrabold">Add a 15-second peek</span><span className="mt-1 text-[9px] text-[#869188]">MP4, WebM or QuickTime · up to 80 MB</span></>}
                <input aria-label="Choose optional listing video" type="file" accept="video/mp4,video/webm,video/quicktime" className="sr-only" onChange={(event) => { setVideoFile(event.target.files?.[0] ?? null); setErrors([]); }} />
              </label>
            </div>
            {(imageFile || videoFile) && <div className="mt-2 flex justify-end gap-4">{imageFile && <button type="button" onClick={() => setImageFile(null)} className="flex items-center gap-1 text-[9px] font-bold text-[#75817c] hover:text-[#c34c3c]"><X size={11} /> Remove photo</button>}{videoFile && <button type="button" onClick={() => setVideoFile(null)} className="flex items-center gap-1 text-[9px] font-bold text-[#75817c] hover:text-[#c34c3c]"><X size={11} /> Remove video</button>}</div>}
          </div>

          {errors.length > 0 && <div role="alert" className="mt-5 rounded-xl border border-[#e9b7a9] bg-[#fff0e8] px-4 py-3"><p className="text-[10px] font-extrabold text-[#aa4738]">A couple of things before we put it out there:</p><ul className="mt-2 space-y-1">{errors.map((error) => <li key={error} className="text-[10px] text-[#a35446]">· {error}</li>)}</ul></div>}
          <button disabled={saving} type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#142a2a] py-4 text-[11px] font-extrabold text-white transition hover:bg-[#34504b] disabled:opacity-60">{saving ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Putting it out there…</> : <>List it on NEGO <ArrowRight size={14} /></>}</button>
          <p className="mt-3 text-center text-[9px] leading-4 text-[#929b92]">No fees or checkout here. Just a good listing and a conversation.</p>
        </form>
      </div>

      <aside className="sticky top-24 hidden lg:block">
        <div className="overflow-hidden rounded-[8px] bg-[#142a2a]">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#dce7d3]">
            {imagePreview ? <img src={imagePreview} alt="Listing cover preview" className="h-full w-full object-cover" /> : <div className="px-8 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fffdf7]"><Upload size={21} className="text-[#687b5b]" /></span><p className="mt-4 text-[11px] font-extrabold">Your cover photo goes here</p><p className="mt-1 text-[10px] text-[#75817c]">A little natural light never hurts.</p></div>}
            {videoPreview && <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#142a2a]/75 text-white"><Play size={13} fill="currentColor" /></span>}
          </div>
          <div className="p-5 text-[#f4f1e9]">
            <p className="mono text-[9px] uppercase tracking-[.18em] text-[#b0c3b1]">A little preview</p>
            <h3 className="display mt-2 truncate text-[20px] font-bold tracking-[-.055em]">{title || "Your thing, right here"}</h3>
            <div className="mt-2 flex items-center justify-between"><span className="text-[10px] text-[#bdc9bf]">{condition} · {location || "Your neighborhood"}</span><span className="mono text-sm text-[#d8fb50]">{price ? formatPrice(Number(price)) : "₦—"}</span></div>
            <p className="mt-3 line-clamp-3 text-[10px] leading-5 text-[#bdc9bf]">{description || "A few honest words can help the right person picture this in their life."}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4"><span className="rounded-full bg-[#d8fb50] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.1em]">Open to offers</span><span className="text-[9px] text-[#bdc9bf]">{profile?.name || "You"} · {location || "Nearby"}</span></div>
          </div>
        </div>
        <div className="mt-4 rounded-[6px] border border-[#dcded4] bg-[#fffdf7] p-4"><p className="text-[10px] font-extrabold">A note from NEGO</p><p className="mt-1.5 text-[9px] leading-4 text-[#75817c]">Describe the scuffs, share the good parts, and let someone know where they can meet you. Kindness looks good on everyone.</p></div>
      </aside>
    </div>
  </div>;
}
