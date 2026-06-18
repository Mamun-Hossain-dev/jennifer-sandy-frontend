import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { ApiResponse, LoginResponse } from '@/types/auth'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

function normalizeAuthUser(user: {
  _id?: string
  id?: string
  firstName: string
  lastName: string
  email: string
  role?: string
  profilePicture?: string
}) {
  return {
    id: user._id || user.id || '',
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        accessToken: { label: 'Access Token', type: 'text' },
        user: { label: 'User', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.accessToken && credentials?.user) {
          try {
            const parsedUser = normalizeAuthUser(JSON.parse(credentials.user))

            return {
              id: parsedUser.id,
              name: `${parsedUser.firstName} ${parsedUser.lastName}`,
              email: parsedUser.email,
              role: parsedUser.role,
              accessToken: credentials.accessToken,
              firstName: parsedUser.firstName,
              lastName: parsedUser.lastName,
              profilePicture: parsedUser.profilePicture,
            }
          } catch {
            return null
          }
        }

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!response.ok) {
          const errorBody = (await response.json().catch(() => null)) as {
            message?: string
            error?: string
          } | null

          throw new Error(
            errorBody?.message || errorBody?.error || 'Unable to log in',
          )
        }

        const body = (await response.json()) as ApiResponse<LoginResponse>

        const { accessToken, user } = body.data
        const normalizedUser = normalizeAuthUser(user)

        return {
          id: normalizedUser.id,
          name: `${normalizedUser.firstName} ${normalizedUser.lastName}`,
          email: normalizedUser.email,
          role: normalizedUser.role,
          accessToken,
          firstName: normalizedUser.firstName,
          lastName: normalizedUser.lastName,
          profilePicture: normalizedUser.profilePicture,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
        token.user = {
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
        }
      }

      // Handle session update (e.g. after profile picture upload)
      if (trigger === 'update' && session?.image && token.user) {
        token.user.profilePicture = session.image
      }

      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub || token.user?.id || session.user.id
        session.user.role = token.role
        session.user.accessToken = token.accessToken
        session.user.name = token.user
          ? `${token.user.firstName ?? ''} ${token.user.lastName ?? ''}`.trim()
          : session.user.name
        session.user.email = token.user?.email ?? session.user.email
        session.user.image = token.user?.profilePicture ?? session.user.image
        session.accessToken = token.accessToken
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
