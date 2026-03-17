# Al-Batal Admin Dashboard - Development Guide

## Project Overview

**Name:** Al-Batal Admin Dashboard  
**Purpose:** Admin panel for photography marketplace connecting customers with freelance photographers  
**Tech Stack:** React 19 + Vite + TypeScript + Material-UI + react-i18next

## Core Features

1. **Dashboard Overview** - Key metrics and statistics
2. **Customer Management** - View customers, bookings, spending
3. **Freelancer Management** - Portfolio, ratings, account approval
4. **Service Approval** - Review and approve/reject service submissions
5. **Payment Verification** - Verify manual bank transfer receipts
6. **Dark/Light Mode** - Theme toggle with persistence
7. **Bilingual Support** - Arabic (RTL) and English (LTR)

## File Structure

```
src/
├── pages/              # Main page components
│   ├── OverviewPage.tsx
│   ├── CustomersPage.tsx
│   ├── FreelancersPage.tsx
│   ├── ServiceApprovalPage.tsx
│   └── PendingPaymentsPage.tsx
├── layouts/            # Layout components
│   └── Layout.tsx      # App header + sidebar
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── hooks/              # Custom hooks
│   ├── useLanguageDirection.ts
│   └── useData.ts
├── services/           # API calls (mock)
│   └── api.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── i18n/               # Translations
│   └── config.ts
└── App.tsx             # Main app with routing
```

## Key Implementation Details

### Types (src/types/index.ts)
- `Customer` - User profile
- `Freelancer` - Photographer info  
- `PaymentProof` - Payment verification data
- `ServiceRequest` - Service submission
- `Contract` - Customer-Freelancer agreement
- `DashboardStats` - Dashboard metrics
- `Booking` - Event booking record

### Hooks (src/hooks/)
- `useTheme()` - Dark/light mode toggle
- `useLanguageDirection()` - RTL/LTR support, document direction
- `useData<T>()` - Data fetching with loading/error states

### API Service (src/services/api.ts)
Mock implementations for:
- Dashboard stats
- Customer list/details
- Freelancer list/approval
- Service approval queue
- Payment verification queue

Replace mock data with actual API calls to backend.

### Contexts (src/contexts/)
- **ThemeContext** - Dark/light mode with localStorage persistence
- i18next handles language context

### Pages
Each page is responsive and handles:
- Loading states (CircularProgress)
- Error states (Alert)
- Empty states
- Data display (Tables, Cards, Grids)
- User interactions (Dialogs, Buttons)

### i18n (src/i18n/config.ts)
- English (en) and Arabic (ar) translations
- 100+ UI strings
- RTL/LTR handled by useLanguageDirection hook
- Add new strings to both language objects

## Development Workflow

### Adding a New Page
1. Create component in `src/pages/PageName.tsx`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/layouts/Layout.tsx`
4. Add translations to `src/i18n/config.ts`
5. Create TypeScript types if needed

### Adding a New Feature
1. Define types in `src/types/index.ts`
2. Add API methods to `src/services/api.ts`
3. Create component/page
4. Add translations for all UI text
5. Test with both languages and themes

### Styling
- Use MUI components (Button, Card, Table, Dialog, etc.)
- Customize via MUI's theme system in `ThemeContext.tsx`
- Material Design principles
- Responsive grid system

## Important Notes

### Payment Verification
This is the critical feature for platform stability:
- Customers submit proof of bank transfer (receipt image)
- Admin verifies sender details match customer
- Admin reviews transfer date and amount
- Approve → Activates contract immediately
- Reject → Returns funds to customer (add explanation)

### Bilingual Support
- All UI text must have translations
- Document direction changes with language (RTL/LTR)
- Numbers and dates should be localized
- Component margins/padding adapt to RTL

### Theme Support
- All components respond to dark/light mode
- MUI theme handles most styling
- Custom components use theme colors
- localStorage remembers user preference

## Testing Checklist

- [ ] All routes work
- [ ] Dark/Light mode toggles correctly
- [ ] Arabic/English switch works
- [ ] RTL/LTR layout correct for Arabic
- [ ] Mobile responsive (<600px)
- [ ] Table scrolls on mobile
- [ ] Dialogs display correctly
- [ ] Images load with fallbacks
- [ ] Translations appear
- [ ] No console errors

## API Integration

Replace mock methods in `src/services/api.ts` with real API calls:

```typescript
// Example
async getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${this.baseUrl}/stats`);
  return response.json();
}
```

Backend endpoints needed:
- `/stats` - Dashboard metrics
- `/customers` - Customer list
- `/freelancers` - Photographer list
- `/freelancers/:id/approve` - Approve account
- `/freelancers/:id/suspend` - Suspend account
- `/services/pending` - Service queue
- `/services/:id/approve` - Approve service
- `/services/:id/reject` - Reject service
- `/payments/pending` - Payment queue
- `/payments/:id/approve` - Approve payment
- `/payments/:id/reject` - Reject payment

## Deployment

```bash
# Build
npm run build

# This creates dist/ folder
# Deploy dist/ to hosting provider
```

Tested on: Vercel, Netlify, GitHub Pages, Docker

## Customization

### Change Colors
Edit `src/contexts/ThemeContext.tsx`:
```typescript
primary: { main: '#YOUR_COLOR' }
secondary: { main: '#YOUR_COLOR' }
```

### Change Fonts
Update MUI theme typography in `ThemeContext.tsx`:
```typescript
typography: {
  fontFamily: '"Your Font", sans-serif',
}
```

### Add New Language
Add to `src/i18n/config.ts` resources object and resources type

### Add New Route
1. Create page component
2. Add route in `App.tsx`
3. Add nav item in `Layout.tsx`
4. Add i18n strings

## Troubleshooting

**Build errors:** `npm install` then `npm run build`  
**Type errors:** Check `src/types/index.ts` for correct interfaces  
**i18n not working:** Verify translations exist in config.ts  
**RTL broken:** Check `useLanguageDirection` hook  
**Theme not changing:** Check localStorage, browser cache  

## Production Checklist

- [ ] All API endpoints connected
- [ ] Error handling implemented
- [ ] Loading states polished
- [ ] Translations complete
- [ ] Dark/Light mode tested
- [ ] RTL/LTR layouts correct
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Deployed and tested

---

For questions or updates, refer to this guide.
