# Jennifer Sandy Website

A **Next.js 14** (App Router) frontend for the Jennifer Sandy real estate platform. This site serves as the public-facing website where users can browse properties, read blogs, submit inquiries, and manage their accounts.

## Tech Stack

| Technology                | Purpose                               |
| ------------------------- | ------------------------------------- |
| **Next.js 14**            | React framework with App Router       |
| **TypeScript**            | Type-safe JavaScript                  |
| **Tailwind CSS**          | Utility-first CSS framework           |
| **next-auth**             | Authentication (credentials provider) |
| **@tanstack/react-query** | Server state management & caching     |
| **react-hook-form**       | Form handling with validation         |
| **zod**                   | Schema validation                     |
| **axios**                 | HTTP client for API calls             |
| **sonner**                | Toast notifications                   |
| **lucide-react**          | Icon library                          |
| **shadcn/ui**             | UI component library                  |
| **date-fns**              | Date utilities                        |
| **recharts**              | Charting library (dashboard)          |

## Architecture

### Server Components vs Client Components

- **All `page.tsx` files are Server Components** — they render on the server and send minimal HTML/JS to the client.
- **Interactive parts are extracted into Client Components** — only the components that need interactivity (forms, animations, data fetching with `useQuery`, etc.) use the `'use client'` directive.
- **Data-fetching logic resides in `lib/` files** — functions like `fetchBlogs()`, `loginUser()`, etc. are called from client components via `@tanstack/react-query`.

### Folder Structure

```
jennifer-sandy-website/
├── public/images/          # Static images
├── src/
│   ├── app/                # App Router pages (all server components)
│   │   ├── about/
│   │   ├── account/
│   │   │   ├── inquiries/
│   │   │   └── settings/
│   │   ├── blogs/
│   │   ├── change-password/
│   │   ├── faqs/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-otp/
│   │   ├── layout.tsx      # Root layout with AuthProvider, AppProvider
│   │   ├── page.tsx        # Home page
│   │   └── not-found.tsx   # 404 page
│   ├── components/         # React components
│   │   ├── about/
│   │   ├── account/
│   │   ├── auth/
│   │   ├── blog/
│   │   ├── dashboard/
│   │   ├── faq/
│   │   ├── home/
│   │   ├── not-found/
│   │   ├── providers/      # AuthProvider, AppProvider (QueryClient, Theme)
│   │   ├── shared/         # SiteHeader, SiteFooter, AuthLayout
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # API helpers and utilities
│   │   ├── auth-api.ts
│   │   ├── axios.ts        # Axios instance with interceptors
│   │   ├── blog-api.ts
│   │   ├── dashboard-api.ts
│   │   ├── get-api-error-message.ts
│   │   └── utils.ts        # cn(), etc.
│   ├── types/              # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── inquiry-detail.ts
│   │   └── next-auth.d.ts
│   └── middleware.ts       # NextAuth middleware for protected routes
├── middleware.ts           # Route protection (next-auth)
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## How API Calls Work

1. **Client Components** use `useQuery` / `useMutation` from `@tanstack/react-query`.
2. The actual HTTP calls are made inside **`src/lib/`** functions (e.g. `src/lib/blog-api.ts`, `src/lib/auth-api.ts`).
3. These `lib/` functions use an **Axios instance** (`src/lib/axios.ts`) that:
   - Points to the backend API (`NEXT_PUBLIC_API_URL`).
   - Automatically attaches the Authorization header when a token is available.
   - Handles response/error transformations.
4. Authentication state is managed via **next-auth** (`useSession()` hook).

Example flow for a blog listing page:

```
pages/blogs/page.tsx (Server Component)
  └── <BlogsPageContent /> (Client Component)
        └── useQuery({ queryFn: () => fetchBlogs(...) })
              └── lib/blog-api.ts → axios.get('/blog')
                    └── NestJS Backend API
```

## Authentication Flow

- Login/Signup pages use client-side forms with `react-hook-form` + `zod`.
- On successful login, `next-auth`'s `signIn('credentials')` is called to create a session.
- Protected routes (e.g., `/account/*`) are guarded by `middleware.ts`.
- Session token is accessed via `useSession()` for authenticated API calls.

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env  # Then edit .env with your config

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable              | Description                      |
| --------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend NestJS API base URL      |
| `NEXTAUTH_SECRET`     | Secret for next-auth session JWT |
| `NEXTAUTH_URL`        | Base URL of the website          |

## Key Design Decisions

- **Server-first rendering** — All pages are server components; client interactivity is isolated in dedicated `'use client'` components.
- **Extracted data layer** — API functions live in `src/lib/` for reusability and testability.
- **Protected routes** via `middleware.ts` — unauthenticated users cannot access `/account/*` pages.
- **shadcn/ui** for consistent, customizable UI components.
