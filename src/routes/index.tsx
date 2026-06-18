import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award, Star, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import notesImg from "@/assets/notes.jpg";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Meter } from "@/components/site/Meter";
import { formatPKR, whatsappLink } from "@/lib/site";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alburj Fragrance — Luxury Eastern Perfumery" },
      { name: "description", content: "Discover Alburj Fragrance: hand-composed oud, amber and signature scents. Free shipping across Pakistan on orders above PKR 7,500." },
      { property: "og:title", content: "Alburj Fragrance — Luxury Eastern Perfumery" },
      { property: "og:description", content: "Hand-composed oud, amber and signature scents from Lahore." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);
  const best = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);
  const fresh = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Alburj signature crystal flacon on obsidian"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--ink)] via-[color:var(--ink)]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-transparent to-transparent" />
        <div className="relative container-luxe min-h-[88vh] flex items-center">
          <div className="max-w-xl animate-float-up">
            <div className="text-eyebrow mb-6">Maison Alburj · Est. Lahore</div>
            <h1 className="heading-display text-5xl md:text-7xl">
              The art of <em className="italic gold-gradient-text">scent</em>, the soul of the Orient.
            </h1>
            <p className="mt-7 text-base md:text-lg text-foreground/80 leading-relaxed max-w-md">
              Twenty hand-composed fragrances. Cambodian oud, Bulgarian rose, Sicilian citrus — drawn together with the patience of a master perfumer.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-luxe btn-luxe-hover">Shop Collection <ArrowRight className="size-3.5" /></Link>
              <Link to="/collections" className="btn-ghost-gold">Explore Olfactive Families</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.7rem] tracking-[0.35em] uppercase text-muted-foreground">
          Scroll
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-luxe py-24">
        <SectionHeading
          eyebrow="The Maison"
          title={<>Featured <em className="italic">Fragrances</em></>}
          subtitle="Six compositions hand-picked by our founder. A starting point for discovering the Alburj sensibility."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
        <SectionHeading eyebrow="Adored" title={<>Best <em className="italic">Sellers</em></>} subtitle="Worn by thousands across Pakistan and the Gulf." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {best.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/best-sellers" className="btn-ghost-gold">View all best sellers</Link>
        </div>
      </section>

      {/* QUIZ */}
      <FragranceFinderQuiz />

      {/* WHY US */}
      <section className="container-luxe py-24">
        <SectionHeading eyebrow="The Difference" title={<>Why choose <em className="italic">Alburj</em></>} />
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Award, title: "Master Perfumer", text: "Every composition is built and aged in our Lahore atelier." },
            { icon: Sparkles, title: "Rare Ingredients", text: "Cambodian oud, Damascena rose, Madagascan vanilla." },
            { icon: ShieldCheck, title: "Authentic, Always", text: "Sealed boxes, batch-coded bottles, lifetime authentication." },
            { icon: Truck, title: "Discreet Delivery", text: "Same-day in Lahore. Free shipping above PKR 7,500." },
          ].map((f) => (
            <div key={f.title} className="card-luxe p-7">
              <f.icon className="size-7 text-[color:var(--gold)]" strokeWidth={1.3} />
              <h3 className="font-display text-xl mt-5">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
        <SectionHeading eyebrow="Just Composed" title={<>New <em className="italic">Arrivals</em></>} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {fresh.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* NOTES SHOWCASE */}
      <section className="relative py-32 my-12 overflow-hidden">
        <img src={notesImg} alt="Fragrance ingredients" width={1600} height={900} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--ink)] to-[color:var(--ink)]/40" />
        <div className="relative container-luxe grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-eyebrow mb-4">Olfactive Architecture</div>
            <h2 className="heading-display text-4xl md:text-5xl">The grammar of a great perfume</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Every Alburj fragrance is built in three movements. Top notes greet the wearer, heart notes carry the story, base notes write the memory.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              { label: "Top Notes", notes: "Bergamot · Saffron · Pink Pepper", desc: "First 15 minutes — the opening flourish." },
              { label: "Heart Notes", notes: "Rose · Jasmine · Orris Butter", desc: "Hours one through four — the soul." },
              { label: "Base Notes", notes: "Oud · Amber · White Musk", desc: "All evening — the lingering signature." },
            ].map((n) => (
              <div key={n.label} className="card-luxe p-5">
                <div className="text-eyebrow text-[color:var(--gold-soft)]">{n.label}</div>
                <div className="font-display text-xl mt-2">{n.notes}</div>
                <p className="text-xs text-muted-foreground mt-2">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <CompareSection />

      {/* FBT */}
      <FrequentlyBoughtTogether />

      {/* TESTIMONIALS */}
      <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
        <SectionHeading eyebrow="In Their Words" title={<>What our patrons <em className="italic">say</em></>} />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Hira A., Lahore", text: "Nuit d'Oud is now my signature scent. Compliments every single day at work.", rating: 5 },
            { name: "Faisal R., Karachi", text: "Quality rivals fragrances I bought in Dubai for three times the price. Beautifully packaged.", rating: 5 },
            { name: "Zoya M., Islamabad", text: "The Velvet Rose feels like wearing silk. Lasts all day, projects beautifully.", rating: 5 },
          ].map((t) => (
            <div key={t.name} className="card-luxe p-7">
              <div className="flex gap-1 text-[color:var(--gold)]">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="size-3.5 fill-[color:var(--gold)]" />)}
              </div>
              <p className="mt-4 font-display text-lg leading-relaxed text-foreground/90">"{t.text}"</p>
              <div className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <HomeFaq />

      {/* NEWSLETTER */}
      <section className="container-luxe py-24">
        <div className="card-luxe p-12 md:p-16 text-center">
          <div className="text-eyebrow mb-4">Letter from the Atelier</div>
          <h2 className="heading-display text-3xl md:text-5xl gold-gradient-text">Receive new compositions first</h2>
          <p className="mt-4 max-w-lg mx-auto text-muted-foreground">Private previews, atelier stories and members-only releases. No spam — just scent.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--gold)]"
            />
            <button className="btn-luxe btn-luxe-hover">Subscribe</button>
          </form>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="container-luxe py-16 border-t border-[color:var(--gold)]/10 text-center">
        <div className="text-eyebrow mb-3">Follow the House</div>
        <h3 className="font-display text-3xl">@alburjfragrance</h3>
        <p className="mt-2 text-sm text-muted-foreground">Behind-the-scenes from Lahore, customer reviews and new launches.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-3">
          {PRODUCTS.slice(0, 6).map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden bg-[color:var(--plum)]">
              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition duration-700" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FragranceFinderQuiz() {
  const [mood, setMood] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const moods = ["Bold", "Soft", "Fresh", "Mysterious"];
  const seasons = ["Summer", "Winter", "Office", "Formal"] as const;

  const result = useMemo(() => {
    if (!mood || !season) return null;
    const pool = PRODUCTS.filter((p) => p.categories.includes(season as any));
    if (!pool.length) return PRODUCTS.slice(0, 3);
    const score = (p: typeof PRODUCTS[number]) => {
      let s = 0;
      if (mood === "Bold" && (p.projection >= 8)) s += 3;
      if (mood === "Soft" && (p.projection <= 7)) s += 3;
      if (mood === "Fresh" && (p.categories.includes("Fresh") || p.categories.includes("Citrus"))) s += 4;
      if (mood === "Mysterious" && (p.categories.includes("Oud") || p.categories.includes("Woody"))) s += 4;
      return s + p.rating;
    };
    return [...pool].sort((a, b) => score(b) - score(a)).slice(0, 3);
  }, [mood, season]);

  return (
    <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
      <SectionHeading eyebrow="The Concierge" title={<>Fragrance <em className="italic">Finder</em></>} subtitle="Answer two questions, receive three considered recommendations." />
      <div className="card-luxe p-8 md:p-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="text-eyebrow mb-4">Mood</div>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((m) => (
                <button key={m} onClick={() => setMood(m)} className={`py-3 text-sm uppercase tracking-[0.22em] border transition ${mood === m ? "bg-[color:var(--gold)] text-[color:var(--ink)] border-[color:var(--gold)]" : "border-[color:var(--gold)]/30 hover:border-[color:var(--gold)]"}`}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-eyebrow mb-4">Occasion</div>
            <div className="grid grid-cols-2 gap-2">
              {seasons.map((s) => (
                <button key={s} onClick={() => setSeason(s)} className={`py-3 text-sm uppercase tracking-[0.22em] border transition ${season === s ? "bg-[color:var(--gold)] text-[color:var(--ink)] border-[color:var(--gold)]" : "border-[color:var(--gold)]/30 hover:border-[color:var(--gold)]"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-10 pt-10 border-t border-[color:var(--gold)]/20">
            <div className="text-eyebrow mb-6">Your Curation</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompareSection() {
  const items = PRODUCTS.filter((p) => p.featured).slice(0, 3);
  return (
    <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
      <SectionHeading eyebrow="Side by side" title={<>Compare <em className="italic">signatures</em></>} subtitle="Three of our most loved compositions — measured by longevity and projection." />
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} className="card-luxe p-7 space-y-5">
            <img src={p.image} alt={p.name} loading="lazy" className="aspect-square object-cover bg-[color:var(--ink)] w-full" />
            <div>
              <h3 className="font-display text-xl">{p.name}</h3>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{p.categories.slice(0, 2).join(" · ")}</div>
            </div>
            <Meter label="Longevity" value={p.longevity} />
            <Meter label="Projection" value={p.projection} />
            <Link to="/product/$slug" params={{ slug: p.slug }} className="btn-ghost-gold w-full">Discover</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function FrequentlyBoughtTogether() {
  const trio = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[5]];
  const total = trio.reduce((s, p) => s + p.sizes[1].price, 0);
  const bundle = Math.round(total * 0.88);
  const { add } = useCart();
  return (
    <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
      <SectionHeading eyebrow="The Trio" title={<>Frequently bought <em className="italic">together</em></>} subtitle="Three contrasting characters — save 12% when collected as a set." />
      <div className="card-luxe p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-2">
          {trio.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4">
              <Link to="/product/$slug" params={{ slug: p.slug }} className="text-center group">
                <img src={p.image} alt={p.name} loading="lazy" className="w-32 h-40 object-cover bg-[color:var(--ink)] group-hover:scale-105 transition" />
                <div className="font-display text-base mt-3 group-hover:text-[color:var(--gold)]">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.sizes[1].ml}ml · {formatPKR(p.sizes[1].price)}</div>
              </Link>
              {i < trio.length - 1 && <Plus className="size-5 text-[color:var(--gold)] hidden md:block" />}
            </div>
          ))}
        </div>
        <div className="gold-divider my-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-eyebrow">Trio Bundle</div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl gold-gradient-text">{formatPKR(bundle)}</span>
              <span className="text-sm line-through text-muted-foreground">{formatPKR(total)}</span>
            </div>
          </div>
          <button
            onClick={() => trio.forEach((p) => add({ productId: p.id, ml: p.sizes[1].ml, qty: 1 }))}
            className="btn-luxe btn-luxe-hover"
          >
            Add Trio to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

function HomeFaq() {
  const faqs = [
    { q: "Where are Alburj fragrances made?", a: "Composed and bottled in our Lahore atelier using rare materials sourced from Cambodia, Bulgaria, Madagascar and the Mediterranean." },
    { q: "How long does a fragrance last?", a: "Our Extrait de Parfum compositions perform 8–12 hours. Eau de Parfum 6–8 hours. Eau de Toilette 4–6 hours." },
    { q: "Do you ship outside Pakistan?", a: "Yes — international shipping is available on request via WhatsApp." },
    { q: "Are returns accepted?", a: "Sealed bottles can be returned within 7 days. See our Return Policy for details." },
  ];
  return (
    <section className="container-luxe py-24 border-t border-[color:var(--gold)]/10">
      <SectionHeading eyebrow="Considered Answers" title={<>Frequently <em className="italic">asked</em></>} />
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card-luxe p-6 group">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-display text-lg">{f.q}</span>
              <Plus className="size-4 text-[color:var(--gold)] group-open:rotate-45 transition" />
            </summary>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
