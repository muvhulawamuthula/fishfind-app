# SA FishFind — Mobile & Web App
### Gauteng fishing guide — React Native + Web frontend

> **Backend API:** [github.com/muvhulawamuthula/sa-fishfind](https://github.com/muvhulawamuthula/sa-fishfind)

---

## Screens

| Screen | Description |
|--------|-------------|
| **Dam List** | Browse all 5 Gauteng dams — search, filter by chalets/camping, activity badges, safety warnings |
| **Dam Detail** | Full info — fishing times, entry fees, fish species with bait/rig/technique, nearby bait shops with call & directions |
| **Nearby** | GPS-based proximity search with 25/50/100 km radius picker, results sorted by distance |
| **AI Advisor** | Claude-powered chat — ask anything about a dam, pre-populated from Dam Detail or pick from the dam selector |

---

## Tech stack

| | |
|--|--|
| Framework | Expo SDK (React Native + Web) |
| Language | JavaScript |
| Navigation | React Navigation — bottom tabs + native stack |
| Styling | Plain `StyleSheet` — purple/white dark design system |
| Location | `expo-location` |
| API | Fetch → Spring Boot backend on `:8080` |

---

## Running locally

**Prerequisites:** Node 18+, Expo CLI, the [SA FishFind backend](https://github.com/muvhulawamuthula/sa-fishfind) running on `:8080`

```bash
git clone https://github.com/muvhulawamuthula/fishfind-app.git
cd fishfind-app
npm install

npx expo start
```

| Platform | Command |
|----------|---------|
| Web | Press `w` — opens at `http://localhost:8081` |
| Android emulator | Press `a` |
| iOS simulator | Press `i` (macOS only) |
| Physical device | Scan QR code with Expo Go |

> **Android emulator:** Change `localhost` to `10.0.2.2` in `src/api/client.js`

> **Physical device:** Change `localhost` to your machine's LAN IP in `src/api/client.js`

---

## Project structure

```
src/
├── api/
│   └── client.js          — Fetch wrapper for all backend endpoints
├── screens/
│   ├── DamListScreen.js   — List with search + All/Chalets/Camping filter
│   ├── DamDetailScreen.js — Full dam detail, species, bait shops, advisor CTA
│   ├── NearbyScreen.js    — GPS search with radius picker
│   └── AdvisorScreen.js   — AI chat with dam picker + suggestion chips
└── theme.js               — Color tokens + activityColor/activityBg helpers
App.js                     — Tab + stack navigation setup
```

---

## Design system

Dark purple theme — key tokens from `src/theme.js`:

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0D0B1A` | Screen backgrounds |
| `surface` | `#141128` | Cards |
| `primary` | `#8B5CF6` | Buttons, accents, active states |
| `textPrimary` | `#FFFFFF` | Headings, values |
| `textSecondary` | `#C4B5FD` | Labels, secondary info |
| `success` | `#34D399` | HIGH activity, safety clear |
| `danger` | `#F87171` | Warnings, safety hazards |

---

## Roadmap

- [x] Dam list with search and amenity filters
- [x] Full dam detail — species, bait shops, safety
- [x] GPS nearby search
- [x] AI fishing advisor (Claude-powered)
- [ ] User accounts + favourite dams
- [ ] Fishing log / catch journal
- [ ] Push notifications for fishing conditions
- [ ] Community catches + photos
