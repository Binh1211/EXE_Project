const BACKEND = ((globalThis as any)?.process?.env?.BACKEND_URL) || 'http://localhost:8080';

export default async function handler(req: any, res: any) {
  try {
    const backendRes = await fetch(`${BACKEND}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: req.headers?.cookie || '',
      },
    });

    // clear cookie on client
    res.setHeader('Set-Cookie', `refresh_token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None`);

    const text = await backendRes.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    res.status(backendRes.status).send(body);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Proxy error' });
  }
}
