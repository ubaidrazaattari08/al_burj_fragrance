import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Sign In / Register — Alburj Fragrance" }, { name: "description", content: "Sign in or create your Alburj account." }],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email({ message: "Valid email required" }).max(255);
const passwordSchema = z.string().min(8, "Min 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Name required").max(80);

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      const e1 = emailSchema.safeParse(email); if (!e1.success) throw new Error(e1.error.issues[0].message);
      const p1 = passwordSchema.safeParse(password); if (!p1.success) throw new Error(p1.error.issues[0].message);
      if (mode === "signup") {
        const n1 = nameSchema.safeParse(name); if (!n1.success) throw new Error(n1.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: e1.data, password: p1.data,
          options: { emailRedirectTo: `${window.location.origin}/account`, data: { full_name: n1.data } },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
        navigate({ to: "/account" });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: e1.data, password: p1.data });
        if (error) throw error;
        toast.success("Welcome back.");
        // Check admin role on client side after login
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();
        navigate({ to: role ? "/admin" : "/account" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally { setLoading(false); }
  }

  return (
    <>
      <PageHero eyebrow="Members" title={mode === "signin" ? "Sign In" : "Create Account"} />
      <section className="container-luxe py-16 max-w-md mx-auto">
        <div className="card-luxe p-8">
          <div className="flex border border-[color:var(--gold)]/30 mb-6">
            <button onClick={() => setMode("signin")} className={`flex-1 py-3 text-xs uppercase tracking-[0.22em] ${mode === "signin" ? "bg-[color:var(--gold)]/10 text-[color:var(--gold)]" : ""}`}>Sign In</button>
            <button onClick={() => setMode("signup")} className={`flex-1 py-3 text-xs uppercase tracking-[0.22em] ${mode === "signup" ? "bg-[color:var(--gold)]/10 text-[color:var(--gold)]" : ""}`}>Register</button>
          </div>
          <form onSubmit={handle} className="space-y-5">
            {mode === "signup" && (
              <div><label className="text-eyebrow block mb-2">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80}
                  className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" /></div>
            )}
            <div><label className="text-eyebrow block mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255}
                className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" /></div>
            <div><label className="text-eyebrow block mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={72}
                className="w-full bg-transparent border border-[color:var(--gold)]/30 px-4 py-3 focus:outline-none focus:border-[color:var(--gold)]" /></div>
            <button disabled={loading} className="btn-luxe btn-luxe-hover w-full">{loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}</button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="text-[color:var(--gold)]">← Return to storefront</Link>
          </p>
        </div>
      </section>
    </>
  );
}
