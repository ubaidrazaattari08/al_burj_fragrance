
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE n BIGINT; BEGIN
  n := nextval('public.order_number_seq');
  RETURN 'ALB-' || to_char(now(),'YYYY') || '-' || lpad(n::text, 5, '0');
END; $$;
GRANT EXECUTE ON FUNCTION public.generate_order_number() TO authenticated, anon;
GRANT USAGE ON SEQUENCE public.order_number_seq TO authenticated, anon;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
