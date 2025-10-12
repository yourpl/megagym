import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      hasSubscription?: boolean
    }
  }

  interface User {
    id: string
    hasSubscription?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    hasSubscription?: boolean
  }
}
