import { HttpResponse, http } from 'msw';

export const handlers = [
  http.post('/sendEmail', async () => HttpResponse.json({ ok: true })),
  http.post('/deleteImage', async () => HttpResponse.json({ ok: true }))
];

