# Getting started

Run the FishFind Expo app against a local [sa-fishfind](https://github.com/muvhulawamuthula/sa-fishfind) API.

## Prerequisites

- Node.js 18+
- package manager
- Expo CLI via the Expo starter (no global install required)
- sa-fishfind listening on `http://localhost:8080`

## Install and start

```bash
git clone https://github.com/muvhulawamuthula/fishfind-app.git
cd fishfind-app
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), `w` (web), or scan the QR code with Expo Go on a device.

## API base URL

`src/api/client.js` uses:

```text
http://localhost:8080/api/v1
```

On a physical device, `localhost` points at the phone — change `BASE_URL` to your machine LAN IP (e.g. `http://192.168.x.x:8080/api/v1`) or use a tunnel.

## Location permissions

The Nearby tab needs location access (`expo-location`, declared in `app.json`). Deny or fail → the screen shows an error; grant and retry to load dams sorted by distance (25 / 50 / 100 km).

## Smoke checks

1. **Dams** tab loads a list from `GET /dams` (filters: All / Chalets / Camping).
2. Open a dam → detail from `GET /dams/{id}`.
3. **Nearby** → allow location → results from `GET /dams/nearby`.
4. **Advisor** → send a question → `POST /advisor/ask` returns a reply.

## Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| Network / failed fetch | Start sa-fishfind on `:8080`; on device, fix `BASE_URL` |
| Empty dam list | Backend has no data — seed sa-fishfind |
| Location denied | Enable location for Expo Go / the simulator |
| Advisor errors | Confirm `/api/v1/advisor/ask` and any LLM/API keys on the backend |

## Next reading

- [Architecture](architecture.md) — navigation, client helpers, screen map
- Root [README](../README.md) — features and API surface summary
