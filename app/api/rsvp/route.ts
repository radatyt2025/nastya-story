import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
const allowed = new Set(['17:00','17:30','18:00','18:30','19:00','19:30','20:00']);
export async function POST(request: Request) {
  try {
    const { date, time } = await request.json();
    if (date !== '2026-11-11' || !allowed.has(time)) {
      return NextResponse.json({ error: 'Некоректна дата або час' }, { status: 400 });
    }
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ error: 'Базу даних ще не підключено' }, { status: 503 });
    const res = await fetch(`${url.replace(/\/$/,'')}/rest/v1/meeting_rsvps`, {
      method:'POST',
      headers: { apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Prefer:'return=minimal' },
      body: JSON.stringify({ meeting_date:date, meeting_time:time }),
      cache:'no-store'
    });
    if (!res.ok) return NextResponse.json({ error:'Не вдалося зберегти підтвердження' },{status:502});
    return NextResponse.json({ok:true});
  } catch {
    return NextResponse.json({error:'Помилка запиту'}, {status:400});
  }
}
