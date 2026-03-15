# Bubblestz Store 🛒

A modern **Vite + React** order management dashboard built with TypeScript, Tailwind CSS, and integrated with Turso database.

![Order Dashboard Screenshot](public/image/logo.png) <!-- Optional: replace with actual screenshot if available -->

## 🚀 Features

- **Order Dashboard** - Real-time KPIs, hourly volume charts, status pie charts, orders grid
- **Order Details** - Comprehensive view with items table, customer info, status timeline & actions
- **Order History** - Paginated table of past orders
- **Settings** - User preferences management
- **Responsive Design** - Mobile-first with Tailwind CSS & shadcn/ui inspired components
- **Charts & Visuals** - Recharts for analytics, confetti effects, glassmorphism cards
- **Notifications** - Sonner toasts with rich colors
- **Database** - Turso (libSQL) integration with schema & migrations
- **Modern Stack** - React 19, React Router, Vite (fast HMR), TypeScript
- **Icons** - Heroicons & Lucide React
- **Theme** - Dark mode support, custom animations & shadows

## 🛠️ Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

3. **Optional: Setup Turso DB** (if using real data):
   - Configure `src/lib/turso.ts` with your database URL & auth token
   - Run migrations: See `src/lib/migrations.ts`

## 📁 Project Structure

```
bubblestz_store/
├── public/                    # Static assets (icons, logo, manifest)
├── src/
│   ├── app/                   # Pages & page-specific components
│   │   ├── order-dashboard/   # Dashboard page (KPIs, charts, orders grid)
│   │   ├── order-details/     # Order details page
│   │   ├── order-history/     # History table
│   │   ├── settings/          # Settings page
│   │   └── not-found.tsx
│   ├── components/            # Shared components (AppLayout, Sidebars, UI)
│   ├── hooks/                 # Custom hooks (useSettings, useNotifications)
│   ├── lib/                   # Utilities (utils.ts, orders.ts, turso.ts, mockData.ts)
│   ├── styles/                # Tailwind & global CSS
│   └── types/
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite config (port 3000, React plugin)
├── tailwind.config.js         # Custom theme (DM Sans font, glassmorphism)
├── tsconfig.json              # TypeScript config
└── README.md
```

## 🌐 Key Pages

| Route | Description |
|-------|-------------|
| `/order-dashboard` | Main dashboard with KPIs, charts (hourly volume, status pie), orders grid, confetti |
| `/order-details` | Single order view: header, items, customer panel, timeline, actions |
| `/order-history` | All orders table |
| `/settings` | App settings |

## 🛠️ Tech Stack

- **Framework**: Vite 8.0 + React 19 + React Router DOM 7
- **Styling**: Tailwind CSS 3.4 + tailwind-merge + clsx (shadcn/ui pattern)
- **Charts**: Recharts 2.15
- **Database**: @libsql/client (Turso), with schema/migrations
- **UI**: Lucide React, Heroicons, Sonner (toasts), Canvas-confetti
- **Dev Tools**: ESLint, Prettier, TypeScript 5

## 📦 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | TypeScript check + Vite build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Prettier format |
| `npm run type-check` | TypeScript check only |

## 🚀 Build & Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs to `dist/`.

2. **Preview build**:
   ```bash
   npm run preview
   ```

**Deploy anywhere** (Netlify, Vercel, etc.) - just serve the `dist/` folder. For DB, set Turso env vars.

## 🔧 Customization

- **Tailwind Theme**: Edit `tailwind.config.js` (colors, fonts: DM Sans/JetBrains Mono, animations: pulse-slow/spin-slow)
- **Components**: `src/components/ui/` (StatusBadge, AppIcon/Image/Logo, NotificationDropdown)
- **Mock Data**: `src/lib/mockData.ts` - switch to real DB via `turso.ts`
- **Utils**: `cn()` helper in `src/lib/utils.ts`

## 📚 Learn More

- [Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Turso](https://turso.tech)
- [Recharts](https://recharts.org)

Built with ❤️ using modern web technologies.

---

*Project migrated from Rocket.new template*

