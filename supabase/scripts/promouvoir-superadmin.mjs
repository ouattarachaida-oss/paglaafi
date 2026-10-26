/**
 * Nomme un compte existant Superadmin National.
 *
 * Usage : pnpm run db:superadmin -- <email>
 *
 * Le rôle superadmin ne peut JAMAIS être attribué depuis l'application :
 * ce script agit directement sur la base (connexion administrateur via le pooler).
 * Le compte doit d'abord avoir été créé (inscription dans l'application ou
 * Supabase > Authentication > Add user).
 */
import { clientPostgres } from "./env.mjs";

const email = process.argv.slice(2).find((a) => a.includes("@"));
if (!email || !email.includes("@")) {
  console.error("Usage : pnpm run db:superadmin -- <email>");
  process.exit(1);
}

const client = await clientPostgres();
try {
  const { rowCount } = await client.query(
    `update public.profils p set role = 'superadmin'
       from auth.users u
      where u.id = p.id and lower(u.email) = lower($1)`,
    [email],
  );
  console.log(rowCount ? `${email} est désormais Superadmin National.` : `Aucun compte trouvé pour ${email}.`);
  if (!rowCount) process.exitCode = 1;
} finally {
  await client.end();
}
