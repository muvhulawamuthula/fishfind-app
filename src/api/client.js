// Android emulator: use 'http://10.0.2.2:8080/api/v1'
// Physical device: use your machine's LAN IP, e.g. 'http://192.168.1.x:8080/api/v1'
const BASE_URL = 'http://localhost:8080/api/v1';

const get = (path) =>
  fetch(`${BASE_URL}${path}`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export const getDams = () => get('/dams');

export const getDamById = (id) => get(`/dams/${id}`);

export const getDamsNearby = (lat, lng, radius = 100) =>
  get(`/dams/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);

export const getDamsWithChalets = () => get('/dams/filter/chalets');

export const getDamsWithCamping = () => get('/dams/filter/camping');

export const askAdvisor = (damId, question) =>
  fetch(`${BASE_URL}/advisor/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ damId, question }),
  }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
