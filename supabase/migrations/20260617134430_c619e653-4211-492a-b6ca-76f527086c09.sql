
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_reseller_order_commission() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "apps public insert" ON public.reseller_applications;
CREATE POLICY "apps public insert" ON public.reseller_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(coalesce(full_name,'')) BETWEEN 2 AND 120
    AND length(coalesce(email,''))  BETWEEN 5 AND 160
    AND length(coalesce(mobile,'')) BETWEEN 6 AND 30
    AND length(coalesce(whatsapp,'')) BETWEEN 6 AND 30
    AND length(coalesce(city,'')) BETWEEN 2 AND 80
    AND length(coalesce(country,'')) BETWEEN 2 AND 80
  );
