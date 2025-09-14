import { auth, signIn, signOut } from "./api/auth/[...nextauth]/route"

export { auth, signIn, signOut }

export async function getSession() {
  return await auth()
}

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}
