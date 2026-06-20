import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  component: AdminGuard,
});

function AdminGuard() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.navigate({ to: "/auth" }); return; }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) { router.navigate({ to: "/" }); return; }
      setAllowed(true);
      setChecking(false);
    })();
  }, []);

  if (checking) return <div className="min-h-screen flex items-center justify-center text-[color:var(--gold)]">Verifying access...</div>;
  if (!allowed) return null;
  return <Outlet />;
}
