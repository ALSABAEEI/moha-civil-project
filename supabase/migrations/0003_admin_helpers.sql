-- =========================================================
-- Admin helpers — small RPCs admins can call from the client
-- =========================================================

-- Lets an admin mark a new user's email as confirmed so they can sign in
-- immediately, regardless of the project's "Confirm email" setting.
create or replace function public.admin_confirm_email(user_id uuid)
returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can confirm emails';
  end if;

  update auth.users
    set email_confirmed_at = coalesce(email_confirmed_at, now()),
        confirmed_at       = coalesce(confirmed_at,       now())
    where id = user_id;
end $$;

revoke all on function public.admin_confirm_email(uuid) from public, anon;
grant execute on function public.admin_confirm_email(uuid) to authenticated;
