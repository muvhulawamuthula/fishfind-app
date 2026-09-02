# Architecture

UI-only Expo client for the [sa-fishfind](https://github.com/muvhulawamuthula/sa-fishfind) Spring Boot API (`http://localhost:8080/api/v1`).

## Navigation

`App.js` defines a bottom-tab navigator with three tabs — **Dams**, **Nearby**, and **Advisor**. Each tab owns a native stack:

| Tab | Stack screens |
|-----|----------------|
| Dams | `DamList` → `DamDetail` → `Advisor` (optional CTA) |
| Nearby | `Nearby` → `DamDetail` → `Advisor` |
| Advisor | `Advisor` (standalone chat; can receive dam context via params) |

## API client

`src/api/client.js` wraps `fetch` against `BASE_URL` (`http://localhost:8080/api/v1`):

| Helper | Method / path |
|--------|----------------|
| `getDams` | `GET /dams` |
| `getDamById(id)` | `GET /dams/{id}` |
| `getDamsNearby(lat, lng, radius)` | `GET /dams/nearby` |
| `getDamsWithChalets` / `getDamsWithCamping` | `GET /dams/filter/chalets` / `camping` |
| `askAdvisor({ damId, question })` | `POST /advisor/ask` |

There is no offline cache; list and detail data are always live from the API. The AI advisor runs server-side — the app only posts the question and renders the reply.

## Screens

| Screen | Role |
|--------|------|
| `DamListScreen` | Searchable dam list with All / Chalets / Camping filters |
| `DamDetailScreen` | Full dam card: times, fees, species, shops, safety |
| `NearbyScreen` | GPS proximity search (25 / 50 / 100 km) via expo-location |
| `AdvisorScreen` | Chat UI with suggestion chips and dam context |

## Theming

`src/theme.js` holds shared color tokens and small activity helpers used across screens. Styling is plain React Native `StyleSheet` (no UI kit).

## Boundaries

- Dam catalogue size and content are owned by sa-fishfind — do not hardcode counts or species lists in the app.
- Auth, favourites, catch logging, and push notifications are out of scope for the current client.
