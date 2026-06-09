const BACKEND = ((globalThis as any)?.process?.env?.BACKEND_URL) || 'http://localhost:8080';

export default async function handler(req: any, res: any) {
  try {
    const backendRes = await fetch(`${BACKEND}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: req.headers?.cookie || '',
      },
      redirect: 'manual',
    });

    const text = await backendRes.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      const cookiePair = setCookie.split(';')[0];
      const cookieStr = `${cookiePair}; Path=/; HttpOnly; Secure; SameSite=None`;
      res.setHeader('Set-Cookie', cookieStr);
    }

    res.status(backendRes.status).send(body);
  } catch (err: any) {
    res.status(500).json({ message: err?.message || 'Proxy error' });
  }
}
