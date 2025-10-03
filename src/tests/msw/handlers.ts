import { HttpResponse, http } from 'msw';

export const handlers = [
  http.post('/sendEmail', () => HttpResponse.json({ ok: true })),
  http.post('/deleteImage', () => HttpResponse.json({ ok: true }))
];
