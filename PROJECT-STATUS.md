# IDS Africa Self-Care Portal – Project Status & Roadmap

**Last updated:** February 26, 2026

This is the single source of truth for what has been built, fixed, changed, and what comes next.

## 1. Project Overview & Goals

**Product name:** IDS Africa FTTH Self-Care Portal  
**Target users:** FTTH customers of IDS Africa  
**Core purpose:** Allow users to log in, view dashboard (profile, service plan, remaining days, last login, payments), open tickets, make payments via Paystack, and manage their account.

**Key principles we are following:**

- All dashboard data comes from backend APIs (no mocks)
- Consistent with old MVC look & behavior where possible (e.g. red when ≤7 days low, active always green)
- Clean, modern UI with shadcn/ui components
- Secure session handling (JWT cookies, auto-logout on expiry)
- Use services layer for API calls
- Use Zustand for auth state
- Use TanStack Query for data fetching/caching
- Graceful handling: loading skeletons, error states, empty states (no crashes on missing data)

## 2. Current Status – What has been completed (as of Feb 26, 2026)

| Area                              | Status     | Details / Key Changes                                                                                                                                                                                        | Last updated |
| --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Authentication (Login)            | ✅ Done    | POST /api/auth/login works<br>Updates `customerLastLogin` in DB<br>JWT + refresh token cookies<br>Fixed stale `lastLogin` / `daysAgo` issue                                                                  | Feb 20       |
| Auth Store (Zustand)              | ✅ Done    | `useAuthStore` with login/logout/checkAuth/forceLogout<br>Header reacts instantly to logout                                                                                                                  | Feb 20       |
| Global API Interceptor            | ✅ Done    | `api.ts` catches 401 → `forceLogout()` → clears store instantly<br>No more "zombie logged-in header" after expiry                                                                                            | Feb 20       |
| Dashboard – Layout & Skeleton     | ✅ Done    | Real loading skeleton matching old design<br>Animate-in effects preserved                                                                                                                                    | Feb 19       |
| Dashboard – User Section          | ✅ Done    | `UserProfileCard`: correct name, Login ID, Account ID, last login<br>Layout rearranged (side-by-side IDs, value under Account ID)<br>Button restored to blue filled                                          | Feb 20       |
| Dashboard – Login Activity        | ✅ Done    | Relative time bold + absolute date below<br>Matches old MVC behavior exactly                                                                                                                                 | Feb 20       |
| Dashboard – Service Section       | ✅ Done    | Real plan name, speeds, status, dates, remaining days from `/api/app/dashboard`<br>`ServicePlanCard` status type extended<br>Small circle ring red when ≤7 days (consistent with RemainingDaysCard)          | Feb 26       |
| Dashboard – Payment Section       | 🟡 Partial | Layout & cards present<br>Plan name & expiry from backend<br>Last payment still mock ("N/A")                                                                                                                 | Feb 19       |
| Profile Page (/profile)           | ✅ Done    | Full profile view with avatar, name, account info, email, phone, address<br>Safe handling (empty state if no user data)<br>Consistent loading/error states                                                   | Feb 26       |
| Service Plan Page (/service-plan) | ✅ Done    | Real data from dashboard API<br>Progress bar red when ≤7 days or suspended<br>Consistent color logic (active always green, urgency only on suspended/expired)<br>Safe empty state handling                   | Feb 26       |
| Payment History Page              | 🟡 Partial | Table + filters + sorting + pagination<br>Empty state UI added<br>Error handling<br>Still using mock data (next: connect real `/api/payments/history`)                                                       | Feb 26       |
| Tickets Page                      | 🟡 Partial | Layout + "No open tickets" empty state with CTA<br>Mock data for now<br>Ready for real ticket API when available                                                                                             | Feb 26       |
| Session Expiry UX                 | ✅ Done    | 401 anywhere → instant store clear → header shows "Login"<br>Toast + redirect to /login                                                                                                                      | Feb 20       |
| Global Empty/Error States         | ✅ Done    | Added safe null checks + friendly "No active plan" / "No payment history" / "No tickets" / "No profile" screens with CTAs across all main pages (dashboard, profile, service-plan, payment history, tickets) | Feb 26       |

## 3. Known Issues / Minor Polish (low priority)

- [ ] Payment history still mock → connect real `/api/payments/history`
- [ ] Tickets count hardcoded 0 → no backend endpoint yet
- [ ] Relative time phrasing ("today @ HH:MM" vs "Today at HH:MM") — currently using whatever `dateUtils.daysAgo()` outputs
- [ ] If user has no service plan → show nicer fallback UI (already started, can polish further)

## 4. Next Priorities (proposed order)

### Highest priority – Revenue flow

1. **Make Payment** (/payment/make-payment) — **highest business value**
   - Form: amount (pre-filled from plan or custom), email (from user)
   - POST `/api/payments/initialize`
   - Redirect to Paystack `authorization_url`
   - Handle success/cancel (basic success page + update dashboard balance)

### Next logical steps (after payment works)

2. **Real Payment History** (connect backend)

   - Replace mock with real `/api/payments/history`
   - Show last payment in dashboard card

3. **Tickets backend** (when endpoint ready)

   - List real tickets
   - Create new ticket form

4. **Account balance display**
   - Show `user.accountBalance` somewhere (dashboard or profile)

### Your call

Please tell me:

1. "Let's do Make Payment first" → I'll give full code for:

   - Payment form component
   - Paystack initialization flow
   - Success/cancel handling

2. "First finish Payment History with real data" → I'll give:

   - Updated `paymentService.ts`
   - Real table with backend data

3. Or any other preference

The portal is now **very stable**: loading skeletons, error handling, empty states, no crashes, consistent colors — it's ready for real payment integration.  
Let's finish strong! 🚀
