'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import { P } from '@/lib/photos';

const ease = [0.22, 1, 0.36, 1] as const;
const crop: Record<string, string> = {
  bq1: '50% 67%', bq2: '50% 67%', bereal: '50% 62%',
  roses: '50% 75%', real2: '50% 48%'
};
const Open = createContext<(k: string) => void>(() => {});

/* ---------- базові елементи ---------- */
function Ph({ k, cls = '', ratio, pos = 'center', rot = 0, priority = false, sizes = '(max-width:768px) 92vw, 44vw' }:
  { k: string; cls?: string; ratio?: string; pos?: string; rot?: number; priority?: boolean; sizes?: string }) {
  const p = P[k]; const open = useContext(Open); const rm = useReducedMotion();
  return (
    <motion.button type="button" onClick={() => open(k)} aria-label={`Відкрити фото: ${p.alt}`}
      initial={rm ? false : { opacity: 0, y: 70, rotate: rot - 6, scale: .82, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, rotate: rot, scale: 1, filter: 'blur(0px)' }} whileTap={{ scale: .97 }}
      viewport={{ once: true, margin: '-8%' }} transition={{ duration: 1.3, ease }}
      style={{ aspectRatio: ratio ?? `${p.w}/${p.h}` }}
      className={`relative block w-full overflow-hidden bg-black/30 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)] ${cls}`}>
      <Image src={`/photos/${p.f}`} alt={p.alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: crop[k] ?? pos, transform: ['bq1','bq2','roses'].includes(k) ? 'scale(1.5)' : crop[k] ? 'scale(1.24)' : undefined }} />
    </motion.button>
  );
}
function Para({ children, amt = 40 }: { children: ReactNode; amt?: number }) {
  const ref = useRef(null); const rm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [amt, -amt]);
  return <div ref={ref}><motion.div style={{ y }}>{children}</motion.div></div>;
}
function Line({ children, cls = '', d = 0 }: { children: ReactNode; cls?: string; d?: number }) {
  const rm = useReducedMotion();
  return <motion.p initial={rm ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-10%' }} transition={{ duration: 1.1, delay: d, ease }} className={cls}>{children}</motion.p>;
}
const Title = ({ children, cls = '' }: { children: ReactNode; cls?: string }) =>
  <h2 className={`font-serif text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:text-6xl ${cls}`}>{children}</h2>;
const Sec = ({ id, bg, children, cls = '' }: { id: string; bg: string; children: ReactNode; cls?: string }) =>
  <section id={id} className={`relative px-5 py-24 sm:px-10 sm:py-32 ${bg} ${cls}`}><div className="mx-auto max-w-5xl">{children}</div></section>;

/* ---------- лайтбокс ---------- */
function Lightbox({ k, onClose }: { k: string | null; onClose: () => void }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);
  return (
    <AnimatePresence>{k && (
      <motion.div key="lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={P[k].alt}
        onClick={onClose} className="fixed inset-0 z-[70] bg-night/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="relative mx-auto h-full w-full max-w-3xl overflow-hidden">
          <Image src={`/photos/${P[k].f}`} alt={P[k].alt} fill sizes="100vw"
            className={['bq1','bq2','roses'].includes(k) ? 'object-cover' : 'object-contain'}
            style={['bq1','bq2','roses'].includes(k) ? {objectPosition:crop[k],transform:'scale(1.5)'} : undefined}/>
        </div>
        <button aria-label="Закрити" onClick={onClose} className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] grid h-12 w-12 place-items-center rounded-full bg-night/70 text-2xl text-ivory ring-1 ring-gold/40">×</button>
      </motion.div>)}
    </AnimatePresence>
  );
}

/* ---------- Інтерактивний фотоальбом з явними кнопками ---------- */
function Album({ keys, title }: { keys: string[]; title: string }) {
  const [page, setPage] = useState(0);
  const rm = useReducedMotion();
  const prev = () => setPage(i => (i - 1 + keys.length) % keys.length);
  const next = () => setPage(i => (i + 1) % keys.length);
  return (
    <div className="mx-auto mt-12 max-w-md px-5">
      <div className="relative rounded-[1.5rem] border border-gold/30 bg-[#261c22] p-3 pb-5 shadow-[0_25px_100px_rgba(0,0,0,.55)]">
        <div className="mb-3 flex items-center justify-between px-2 text-xs tracking-[.2em] text-gold/80">
          <span>{title}</span><span className="tabular-nums">{page + 1} / {keys.length}</span>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-black/50">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={keys[page]} initial={rm ? false : { opacity: 0, rotateY: -22, x: 50, scale: .92 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }} exit={rm ? { opacity: 0 } : { opacity: 0, rotateY: 18, x: -40, scale: .96 }}
              transition={{ duration: rm ? .1 : .65, ease }} className="absolute inset-0">
              <Ph k={keys[page]} ratio="4/5" cls="h-full rounded-lg" sizes="90vw" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={prev} aria-label="Попереднє фото" className="grid h-12 w-12 place-items-center rounded-full border border-gold/60 text-2xl text-gold">←</button>
          <div className="flex gap-2" aria-label="Сторінки альбому">{keys.map((_,i)=><button key={i} onClick={()=>setPage(i)} aria-label={`Фото ${i+1}`} className={`h-2 rounded-full transition-all ${i===page?'w-7 bg-gold':'w-2 bg-gold/30'}`}/>)}</div>
          <button type="button" onClick={next} aria-label="Наступне фото" className="grid h-12 w-12 place-items-center rounded-full border border-gold/60 text-2xl text-gold">→</button>
        </div>
        <p className="mt-3 text-center text-xs tracking-widest text-ivory/60">Гортай наші спогади стрілками</p>
      </div>
    </div>
  );
}


/* ---------- Мобільні кінематографічні сцени ---------- */
function FloatingLights() {
  const rm = useReducedMotion();
  return <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({length:13},(_,i)=><motion.span key={i} className="absolute rounded-full bg-amber-200/30 blur-[3px]"
      style={{left:`${(i*37)%100}%`,top:`${(i*23)%90}%`,width: i%3===0?12:5,height:i%3===0?12:5}}
      animate={rm?{}:{opacity:[.15,.65,.15],y:[0,-24,0],scale:[1,1.4,1]}}
      transition={{duration:3+i%5,repeat:Infinity,delay:i*.31}} />)}
  </div>;
}
function CinemaScene() {
  const rm=useReducedMotion();
  return <section id="ch3" className="relative overflow-hidden bg-[#0d0b12] px-5 py-28 text-ivory sm:px-10">
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(255,236,190,.22),transparent_70%)]"/>
    <div className="mx-auto max-w-5xl">
      <p className="mb-5 text-center text-xs uppercase tracking-[.4em] text-gold/70">Сцена третя · Наше кіно</p>
      <motion.div initial={rm?false:{opacity:0,scale:.85,filter:'blur(14px)'}} whileInView={{opacity:1,scale:1,filter:'blur(0px)'}} viewport={{once:true}} transition={{duration:1.2}}>
        <Title cls="text-center">У кожної історії є свої кадри</Title>
      </motion.div>
      <div className="relative mx-auto mt-12 max-w-xl">
        <motion.div aria-hidden className="pointer-events-none absolute -inset-5 rounded-[2rem] border border-gold/20 shadow-[0_0_90px_rgba(217,188,138,.13)]"
          animate={rm?{}:{boxShadow:['0 0 30px rgba(217,188,138,.08)','0 0 90px rgba(217,188,138,.2)','0 0 30px rgba(217,188,138,.08)']}}
          transition={{duration:5,repeat:Infinity}}/>
        <Album keys={['bereal','dome','domeSelfie']} title="Наші кадри" />
      </div>
      <div className="mx-auto mt-16 max-w-md space-y-5 text-center">
        <Line cls="text-lg text-ivory/70">Ми дивилися різні фільми.</Line>
        <Line cls="font-serif text-3xl italic leading-snug">Але моя улюблена історія весь цей час була поруч зі мною.</Line>
      </div>
    </div>
  </section>;
}
function ParkScene() {
  const rm=useReducedMotion();
  return <section id="park" className="relative overflow-hidden bg-[#151b23] px-5 py-28 text-ivory sm:px-10">
    <FloatingLights/>
    <div className="relative mx-auto max-w-5xl">
      <p className="mb-5 text-xs uppercase tracking-[.35em] text-gold/70">Сцена друга · Стрийський парк</p>
      <Title>Трохи вечірнього світла. І ти.</Title>
      <Line cls="mt-6 max-w-md font-serif text-2xl italic text-ivory/75">Іноді для особливого вечора достатньо просто бути поруч.</Line>
      <div className="relative mx-auto mt-16 max-w-lg pb-20">
        <motion.div initial={rm?false:{opacity:0,x:-110,rotate:-16}} whileInView={{opacity:1,x:0,rotate:-7}} viewport={{once:true}} transition={{duration:1.1,ease}}
          className="relative w-[78%] rounded-xl border-[7px] border-ivory bg-ivory p-1 shadow-2xl">
          <Ph k="night1" ratio="3/4" cls="rounded-sm" />
        </motion.div>
        <motion.div initial={rm?false:{opacity:0,x:120,rotate:17}} whileInView={{opacity:1,x:0,rotate:8}} viewport={{once:true}} transition={{duration:1.2,delay:.3,ease}}
          className="absolute right-0 top-[28%] w-[66%] rounded-xl border-[7px] border-ivory bg-ivory p-1 shadow-2xl">
          <Ph k="night2" ratio="3/4" cls="rounded-sm"/>
        </motion.div>
      </div>
      <motion.div initial={rm?false:{opacity:0,y:70,scale:.8}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{duration:1.2}} className="mx-auto max-w-sm">
        <Ph k="night3" ratio="4/5" cls="rounded-2xl"/>
      </motion.div>
    </div>
  </section>;
}

/* ---------- табло ---------- */
function Scoreboard() {
  const ref = useRef(null); const inV = useInView(ref, { once: true, margin: '-20%' });
  return (
    <div ref={ref} className="mx-auto w-full max-w-xl rounded-sm border border-gold/50 bg-night p-5 text-center shadow-[0_0_60px_-10px_rgba(217,188,138,.35)]">
      <p className="text-sm tracking-widest text-gold/80">Повний час</p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <span className="font-serif text-2xl font-semibold sm:text-4xl">Футбол</span>
        <div className="flex items-center gap-2 font-serif text-6xl font-semibold tabular-nums sm:text-8xl">
          <span>0</span><span className="text-gold/60">:</span>
          <motion.span initial={{ y: -60, opacity: 0, scale: 1.8 }} animate={inV ? { y: 0, opacity: 1, scale: 1 } : {}} transition={{ delay: 1, duration: .9, ease }}
            className="text-rose [text-shadow:0_0_30px_rgba(216,164,178,.8)]">1</motion.span>
        </div>
        <span className="font-serif text-2xl font-semibold text-rose sm:text-4xl">Настя</span>
      </div>
    </div>
  );
}

/* ---------- фінал ---------- */
function Burst() {
  const dots = useMemo(() => Array.from({ length: 44 }, (_, i) => ({ a: (i / 44) * Math.PI * 2 + Math.random(), r: 90 + Math.random() * 260, s: 5 + Math.random() * 14, d: Math.random() * .5, h: i % 4 === 0 })), []);
  return <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
    <motion.div initial={{ opacity: 0, scale: .4 }} animate={{ opacity: [0, .9, .35], scale: [.4, 1.6, 1.2] }} transition={{ duration: 2.4, ease }} className="absolute h-[70vmin] w-[70vmin] rounded-full bg-rose/40 blur-3xl" />
    {dots.map((d, i) => <motion.span key={i} initial={{ x: 0, y: 0, opacity: 0, scale: .3 }} animate={{ x: Math.cos(d.a) * d.r, y: Math.sin(d.a) * d.r - 40, opacity: [0, 1, 0], scale: 1 }}
      transition={{ duration: 2.6, delay: d.d, ease }} style={{ width: d.s, height: d.s }}
      className={`absolute ${d.h ? 'text-rose' : 'rounded-full bg-gold/90 shadow-[0_0_14px_4px_rgba(217,188,138,.6)]'}`}>{d.h ? <span style={{ fontSize: d.s * 2 }}>♥</span> : null}</motion.span>)}
  </div>;
}


/* ---------- Запрошення: вибір середи та часу ---------- */
const HOURS = ['17:00','17:30','18:00','18:30','19:00','19:30','20:00'];
function Invitation() {
  const [opened,setOpened]=useState(false);
  const [time,setTime]=useState('18:00');
  const rm=useReducedMotion();
  return <section id="ch8" className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#180d19] px-5 py-28 text-center text-ivory">
    <FloatingLights/>
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(125,45,77,.55),transparent_70%)]"/>
    <div className="relative mx-auto w-full max-w-xl">
      <motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mb-5 text-xs uppercase tracking-[.35em] text-gold">Для тебе, Настю</motion.p>
      <Title cls="text-center">А як щодо ще одного побачення?</Title>
      <Line cls="mx-auto mt-6 max-w-md text-lg text-ivory/75">З тебе — гарний настрій і трішки часу. Решту залиш мені ♡</Line>
      {!opened ? <motion.button type="button" onClick={()=>setOpened(true)} whileTap={{scale:.96}}
        initial={rm?false:{opacity:0,y:60,rotate:-8}} whileInView={{opacity:1,y:0,rotate:0}} viewport={{once:true}} transition={{duration:1.1,ease}}
        className="group relative mx-auto mt-16 block h-52 w-full max-w-sm overflow-hidden rounded-xl border border-gold/50 bg-[#a56b79] shadow-[0_30px_100px_rgba(0,0,0,.5)]">
        <div className="absolute inset-x-0 top-0 h-28 origin-top bg-[#bd8994] [clip-path:polygon(0_0,100%_0,50%_100%)]"/>
        <span className="relative mt-12 inline-block rounded-full border border-ivory/60 px-6 py-3 font-serif text-2xl italic">Відкрити лист ♡</span>
        <span className="absolute bottom-5 left-0 right-0 text-xs tracking-widest">Торкнися конверта</span>
      </motion.button> :
      <motion.div initial={rm?false:{opacity:0,y:90,rotateX:-22,scale:.85}} animate={{opacity:1,y:0,rotateX:0,scale:1}} transition={{duration:1.2,ease}}
        className="mx-auto mt-12 rounded-[2rem] border border-gold/50 bg-[#f6f0e8] p-6 text-[#4a1728] shadow-[0_30px_100px_rgba(0,0,0,.5)] sm:p-9">
        <p className="font-hand text-3xl">Наш наступний розділ</p>
        <p className="mt-4 font-serif text-3xl italic">Побачимось у середу?</p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.25}} className="mt-8 rounded-2xl border border-wine/20 bg-white/60 px-5 py-5">
          <p className="text-xs uppercase tracking-[.3em] text-wine/60">Наш день</p>
          <p className="mt-2 font-serif text-3xl italic">Середа, 11 листопада</p>
        </motion.div>
        <fieldset className="mt-7">
          <legend className="mb-3 text-sm font-medium">О котрій годині тобі зручно?</legend>
          <div className="grid grid-cols-3 gap-2">{HOURS.map(t=><button key={t} type="button" onClick={()=>setTime(t)}
            aria-pressed={time===t} className={`min-h-12 rounded-xl border text-sm transition-colors ${time===t?'border-wine bg-wine text-ivory':'border-wine/20 bg-white/60'}`}>{t}</button>)}</div>
        </fieldset>
        <motion.div key={time} initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} className="mt-8 rounded-2xl bg-wine px-5 py-6 text-ivory">
          <p className="text-xs uppercase tracking-[.25em] text-ivory/70">Наше наступне побачення</p>
          <p className="mt-2 font-serif text-3xl italic">Середа · 11 листопада · {time}</p>
          <p className="mt-3 text-sm text-ivory/75">Я чекатиму на тебе ♡</p>
        </motion.div>
      </motion.div>}
    </div>
  </section>;
}

/* ---------- сторінка ---------- */
const L7 = ['Знаєш, Настю…', 'Я міг би ще довго згадувати всі наші моменти.', 'Але є дещо важливіше.', 'Я хочу, щоб таких моментів було ще більше.', 'І хочу проживати їх саме з тобою.'];

export default function Story() {
  const lenis = useRef<Lenis | null>(null); const rm = useReducedMotion();
  const [started, setStarted] = useState(false); const [step, setStep] = useState(0); const [finale, setFinale] = useState(false);
  const [lb, setLb] = useState<string | null>(null);
  const [music, setMusic] = useState<'off' | 'on' | 'none'>('off'); const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (rm) return;
    const l = new Lenis({ lerp: 0.1 }); lenis.current = l; let id = 0;
    const raf = (t: number) => { l.raf(t); id = requestAnimationFrame(raf); }; id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); };
  }, [rm]);
  useEffect(() => {
    document.documentElement.style.overflow = started ? '' : 'hidden';
    if (started) lenis.current?.start(); else lenis.current?.stop();
  }, [started]);

  const go = useCallback((id: string) => {
    const el = document.getElementById(id); if (!el) return;
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.8 }); else el.scrollIntoView({ behavior: 'auto' });
  }, []);
  const begin = () => { setStarted(true); setTimeout(() => go('ch1'), 60); };
  const reveal = () => { setFinale(true); setTimeout(() => go('ch8'), 120); };
  const toggleMusic = () => {
    if (!audio.current) { const a = new Audio('/music/theme.mp3'); a.loop = true; a.onerror = () => setMusic('none'); audio.current = a; }
    const a = audio.current;
    if (music === 'on') { a.pause(); setMusic('off'); } else a.play().then(() => setMusic('on')).catch(() => setMusic('none'));
  };

  return (
    <Open.Provider value={setLb}>
      <div className="grain" aria-hidden />
      {music !== 'none' && started && <button onClick={toggleMusic} aria-pressed={music === 'on'} aria-label={music === 'on' ? 'Вимкнути музику' : 'Увімкнути музику'}
        className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-50 grid h-12 w-12 place-items-center rounded-full bg-night/60 text-gold ring-1 ring-gold/40 backdrop-blur">{music === 'on' ? '♪' : '♫'}</button>}

      {/* 00 */}
      <section id="ch0" className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-night px-6 text-center">
        <div className="beam absolute inset-0" aria-hidden />
        <div className="relative max-w-2xl">
          <motion.h1 initial={{ opacity: 0, filter: 'blur(14px)', letterSpacing: '.08em' }} animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0em' }} transition={{ duration: 2.4, ease }}
            className="font-serif text-[2.5rem] font-medium italic leading-[1.1] sm:text-6xl">Настю, я хочу тобі дещо розповісти…</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1.6 }} className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ivory/75">
            Це історія, яку ми почали писати разом. І я дуже хочу, щоб вона продовжувалась.</motion.p>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 1.2 }} onClick={begin} whileTap={{ scale: .97 }}
            className="mt-12 min-h-14 rounded-full border border-gold/70 px-9 text-lg text-gold transition-colors active:bg-gold active:text-night">Почати нашу історію</motion.button>
        </div>
      </section>

      {/* 01 — перша зустріч */}
      <Sec id="ch1" bg="bg-wine">
        <p className="mb-6 text-xs uppercase tracking-[.35em] text-gold/80">Сцена перша · Перша зустріч</p>
        <Title>Все почалося з однієї зустрічі</Title>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div initial={rm?false:{opacity:0,scale:1.2,filter:'blur(15px)'}} whileInView={{opacity:1,scale:1,filter:'blur(0px)'}} viewport={{once:true}} transition={{duration:1.7,ease}}>
            <Para><Ph k="venue" ratio="3/4" pos="50% 40%" cls="rounded-t-[9rem] rounded-b-2xl" /></Para>
          </motion.div>
          <div className="space-y-8">
            <Line cls="font-serif text-2xl leading-snug sm:text-3xl">Тоді я ще не знав, скільки всього змінить одна зустріч.</Line>
            <Line cls="text-lg leading-relaxed text-ivory/80">Я просто хотів побачити тебе. А виявилося, що захочу бачити знову і знову.</Line>
            <div className="relative flex items-center justify-center gap-0 py-8">
              <motion.div initial={rm?false:{opacity:0,x:-100,rotate:-25}} whileInView={{opacity:1,x:0,rotate:-9}} viewport={{once:true}} transition={{duration:1.2,delay:.2}} className="relative z-10 w-[58%] rounded-xl border-[6px] border-ivory bg-ivory p-1 shadow-2xl"><Ph k="bq1" ratio="3/4"/></motion.div>
              <motion.div initial={rm?false:{opacity:0,x:100,rotate:25}} whileInView={{opacity:1,x:0,rotate:10}} viewport={{once:true}} transition={{duration:1.2,delay:.5}} className="relative -ml-10 mt-12 w-[58%] rounded-xl border-[6px] border-ivory bg-ivory p-1 shadow-2xl"><Ph k="bq2" ratio="3/4"/></motion.div>
            </div>
            <p className="text-center font-hand text-2xl text-gold">Перший букет ♡</p>
          </div>
        </div>
      </Sec>
      <ParkScene />

      {/* 02 */}
      <Sec id="ch2" bg="bg-ivory text-wine">
        <Title>Маленькі моменти. Великі почуття.</Title>
        <div className="mt-10 grid grid-cols-6 gap-3 sm:gap-6">
          <div className="col-span-4 -rotate-2"><Ph k="letter" /></div>
          <div className="col-span-2 mt-10 rotate-3"><Ph k="roses" /></div>
          <div className="col-span-3 -mt-4 rotate-2 sm:-mt-10"><Ph k="heart" /></div>
          <div className="col-span-3 mt-6 -rotate-3"><Ph k="cat" /></div>
        </div>
        <div className="mx-auto mt-14 max-w-md space-y-4 text-center">
          <Line cls="font-serif text-3xl leading-snug">Мені подобається робити тебе щасливою.</Line>
          <Line d={.3} cls="font-hand text-2xl text-wine/80">І ще більше — бачити твою усмішку.</Line>
        </div>
      </Sec>

      <CinemaScene />

      {/* 04 */}
      <Sec id="ch4" bg="bg-wine">
        <Title cls="text-center">Футбол 0 : 1 Настя</Title>
        <div className="mt-10"><Scoreboard /></div>
        <Line cls="mt-8 text-center text-lg text-ivory/80">Переможець був очевидний ще до початку гри.</Line>
        <div className="relative mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {['stadium', 'scarves', 'bqFoot', 'hug', 'real', 'real2'].map((k, i) => <motion.div key={k} initial={rm?false:{opacity:0,y:100,rotate:i%2?9:-9,scale:.8}} whileInView={{opacity:1,y:0,rotate:i%2?3:-3,scale:1}} viewport={{once:true,amount:.25}} transition={{duration:1.1,delay:(i%3)*.12,ease}} className={i % 2 ? 'mt-8' : ''}><Ph k={k} ratio="3/4" cls="rounded-xl ring-1 ring-gold/20" sizes="45vw" /></motion.div>)}
        </div>
        <Line cls="mx-auto mt-14 max-w-md text-center font-serif text-3xl italic leading-snug text-gold">Ти солодша за перемогу Реал Мадриду над Барселоною.</Line>
      </Sec>

      {/* 05 */}
      <Sec id="ch5" bg="bg-ivory text-wine">
        <Title>Двоє маленьких ведмедиків</Title>
        <div className="relative mt-10 grid gap-6 md:grid-cols-5">
          <motion.div initial={rm?false:{opacity:0,x:-100,rotate:-12}} whileInView={{opacity:1,x:0,rotate:-3}} viewport={{once:true}} transition={{duration:1.3,ease}} className="md:col-span-2"><Ph k="art" cls="rounded-2xl" /></motion.div>
          <div className="space-y-6 md:col-span-3"><motion.div initial={rm?false:{opacity:0,x:110,rotate:10}} whileInView={{opacity:1,x:0,rotate:2}} viewport={{once:true}} transition={{duration:1.3,delay:.2,ease}}><Ph k="bears" cls="rounded-2xl" /></motion.div><motion.div initial={rm?false:{opacity:0,y:90,scale:.7}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{duration:1.2,delay:.4,ease}} className="mx-auto w-4/5"><Ph k="mirror" cls="rounded-2xl" /></motion.div></div>
        </div>
        <div className="mx-auto mt-14 max-w-md space-y-4 text-center">
          <Line cls="font-serif text-3xl leading-snug">Маленькі ведмедики, які тепер теж мають свою історію.</Line>
          <Line d={.3} cls="font-hand text-2xl text-wine/80">Трішки фарби, трішки творчості й багато наших спогадів.</Line>
        </div>
      </Sec>

      {/* 06 */}
      <Sec id="ch6" bg="bg-night">
        <Title>Моменти, які хочеться зупинити</Title>
        <div className="mt-10 -mx-5 sm:mx-0"><Para amt={30}><div className="[&_button]:!shadow-[0_0_80px_-20px_rgba(216,164,178,.5)]"><Ph k="bw" sizes="100vw" /></div></Para></div>
        <div className="relative mt-12 grid grid-cols-6 gap-3">
          <div className="col-span-3 -rotate-2"><Ph k="glasses" /></div><div className="col-span-3 mt-12 rotate-2"><Ph k="embrace" /></div>
          
        </div>
        <div className="mx-auto mt-16 max-w-md space-y-3 text-center font-serif text-2xl leading-snug">
          {['Мені подобаються наші розмови.', 'Наші жарти.', 'Наші обійми.', 'І навіть ті фотографії, на яких ми просто дуріємо.'].map((t, i) => <Line key={t} d={i * .1}>{t}</Line>)}
          <Line cls="pt-4 text-3xl italic text-rose">Бо найкраще в усіх цих моментах — це ти.</Line>
        </div>
      </Sec>

      {/* 07 */}
      <section id="ch7" className="grid min-h-[100svh] place-items-center bg-black px-6 py-20 text-center">
        <div className="max-w-xl">
          <div className="min-h-[22rem] space-y-6 font-serif text-3xl leading-snug sm:text-4xl" aria-live="polite">
            {L7.slice(0, step + 1).map((t, i) => <motion.p key={t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: i === step ? 1 : .35, y: 0 }} transition={{ duration: 1.6, ease }}>{t}</motion.p>)}
          </div>
          {step < L7.length - 1
            ? <button onClick={() => setStep((s) => s + 1)} className="mt-10 min-h-14 rounded-full border border-ivory/30 px-8 text-ivory/80 active:bg-ivory/10">Далі</button>
            : !finale && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1.4 }} onClick={reveal} className="mt-10 min-h-14 rounded-full border border-gold/70 px-8 text-gold active:bg-gold active:text-night">Тепер головне</motion.button>}
        </div>
      </section>

      {finale && <Invitation />}

      <Lightbox k={lb} onClose={() => setLb(null)} />
    </Open.Provider>
  );
}
