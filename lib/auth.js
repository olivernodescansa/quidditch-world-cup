import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Variables: AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    jwt({ token, account, profile }) {
      if (account && profile) token.uid = profile.sub;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.uid ?? token.sub;
      return session;
    },
  },
});

export function isAdminEmail(email) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
