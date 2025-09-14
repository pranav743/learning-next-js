import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

const users = [
  {
    id: "1",
    email: "pranav@example.com",
    password: "$2b$12$LcW/RbkilCh5mz.ofB22zu2j09YIA.R9MbifYo..repM7Al114aIS",
    name: "Pranav"
  }
]

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "Sign Up", type: "boolean" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const existingUser = users.find(user => user.email === credentials.email)

        if (credentials.isSignUp === "true") {
          if (existingUser) {
            throw new Error("User already exists")
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 12)
          const newUser = {
            id: (users.length + 1).toString(),
            email: credentials.email,
            password: hashedPassword,
            name: credentials.email.split("@")[0]
          }
          users.push(newUser)

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
          }
        }

        if (!existingUser) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
