# SA FishFind — Mobile & Web App

Expo (React Native + web) client for the Gauteng fishing guide. Browse dams, search by GPS proximity, and chat with an AI fishing advisor. Talks to the [sa-fishfind](https://github.com/muvhulawamuthula/sa-fishfind) Spring Boot API.

## Features

| Area | What it does |
|------|----------------|
| **Dams** | Searchable list with All / Chalets / Camping filters; opens full dam detail |
| **Dam detail** | Times, fees, species (bait/rig/technique), bait shops, safety, CTA into AI advisor |
| **Nearby** | expo-location proximity search with 25 / 50 / 100 km radius; results sorted by distance |
| **AI Advisor** | Chat UI posting to `POST /api/v1/advisor/ask` with dam context and suggestion chips |

Dam inventory and advisor behaviour come from the backend. This app does not hardcode the dam catalogue.

## Stack

- Expo ~56 / React Native 0.85 / React 19
- React Navigation (bottom tabs + native stacks)
- expo-location
- Fetch client (`src/api/client.js`)
- StyleSheet theme
- MIT

## Quick start

Node 18+ and [sa-fishfind](https://github.com/muvhulawamuthula/sa-fishfind) running on `:8080`.

```bash
git clone https://github.com/muvhulawamuthula/fishfind-app.git
cd fishfind-app
npm install
npx expo start
```

See [docs/getting-started.md](docs/getting-started.md) for platform notes and troubleshooting.

## API surface used

`BASE_URL` defaults to `http://localhost:8080/api/v1`.

| Client helper | Backend |
|---------------|---------|
| `getDams` | `GET /dams` |
| `getDamById` | `GET /dams/{id}` |
| `getDamsNearby` | `GET /dams/nearby?lat&lng&radius` |
| `getDamsWithChalets` / `getDamsWithCamping` | `GET /dams/filter/chalets` / `camping` |
| `askAdvisor` | `POST /advisor/ask` `{ damId, question }` |

More detail: [docs/architecture.md](docs/architecture.md).

## Layout

```
App.js                 # tab + stack navigators
src/api/client.js      # fetch wrapper
src/screens/           # DamList, DamDetail, Nearby, Advisor
src/theme.js           # color tokens + activity helpers
app.json               # Expo config, location permissions
```

## Status

Shipped for local/demo use against sa-fishfind. Not yet: accounts, favourites, catch log, push, or community features.
