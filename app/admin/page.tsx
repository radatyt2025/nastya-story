'use client';
import {useState} from 'react';
type Rsvp={meeting_date:string;meeting_time:string;created_at:string};
export default function AdminPage(){
 const [token,setToken]=useState('');
 const [rows,setRows]=useState<Rsvp[]>([]);
 const [error,setError]=useState('');
 const [loaded,setLoaded]=useState(false);
 const load=async()=>{setError('');setLoaded(false);try{
 const r=await fetch('/api/admin/rsvps',{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
 if(!r.ok)throw new Error('Неправильний пароль або база даних ще не налаштована');
 setRows(await r.json());setLoaded(true);
 }catch(e){setError(e instanceof Error?e.message:'Помилка');}};
 return <main className="min-h-screen bg-[#170d17] px-5 py-20 text-[#f6f0e8]">
 <div className="mx-auto max-w-lg"><h1 className="font-serif text-4xl">Підтвердження зустрічі ♡</h1>
 <p className="mt-4 text-[#d9bc8a]">Приватна сторінка для перегляду обраного часу.</p>
 <label className="mt-8 block text-sm" htmlFor="password">Пароль адміністратора</label>
 <input id="password" type="password" autoComplete="off" value={token} onChange={e=>setToken(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d9bc8a]/50 bg-white/10 p-4"/>
 <button onClick={load} className="mt-4 rounded-full bg-[#d9bc8a] px-7 py-3 text-[#170d17]">Переглянути відповіді</button>
 {error&&<p role="alert" className="mt-5 text-red-300">{error}</p>}
 {loaded&&<div className="mt-10 space-y-3">{rows.length===0?<p>Поки що підтверджень немає.</p>:rows.map((r,i)=><div key={i} className="rounded-xl border border-[#d9bc8a]/30 p-4"><p className="font-serif text-2xl">{r.meeting_date} · {r.meeting_time}</p><p className="mt-1 text-xs opacity-70">Отримано: {new Date(r.created_at).toLocaleString('uk-UA',{timeZone:'Europe/Kyiv'})}</p></div>)}</div>}
 </div></main>;
}
