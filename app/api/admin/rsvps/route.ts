import { NextResponse } from 'next/server';
export const runtime='nodejs';
export async function GET(req:Request) {
 const admin=process.env.ADMIN_VIEW_TOKEN;
 const supplied=req.headers.get('authorization')?.replace(/^Bearer /,'');
 if (!admin || !supplied || supplied!==admin) return NextResponse.json({error:'Немає доступу'},{status:401});
 const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_PUBLISHABLE_KEY;
 if (!url || !key) return NextResponse.json({error:'База даних не налаштована'},{status:503});
 const res=await fetch(`${url.replace(/\/$/,'')}/rest/v1/rpc/get_meeting_rsvps`,{
 method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({admin_secret:admin}),cache:'no-store'});
 if(!res.ok) return NextResponse.json({error:'Помилка читання даних'},{status:502});
 return NextResponse.json(await res.json(),{headers:{'Cache-Control':'no-store'}});
}
