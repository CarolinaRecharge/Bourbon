import { useState, useEffect, useRef, useCallback } from 'react'

// ─── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  :root {
    --amber: #C8820A;
    --amber-light: #E8A020;
    --amber-pale: #F5C842;
    --dark: #0D0A07;
    --dark-2: #1A1208;
    --dark-3: #221A0E;
    --dark-4: #2E2214;
    --bark: #3D2B10;
    --oak: #5C4020;
    --cream: #F2E8D5;
    --cream-2: #E8D9BE;
    --muted: #8A7660;
    --red: #8B2E2E;
    --green: #2D5A27;
    --green-light: #5cb85c;
    --font-display: 'Playfair Display', serif;
    --font-body: 'Libre Baskerville', serif;
    --font-mono: 'DM Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    width: 100%;
    background: var(--dark);
    color: var(--cream);
    font-family: var(--font-body);
    overflow: hidden;
  }

  .app-shell {
    position: relative;
    max-width: 420px;
    width: 100%;
    height: 100dvh;
    margin: 0 auto;
    background: var(--dark-2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .app-shell::before {
    content: '';
    position: fixed;
    inset: 0;
    max-width: 420px;
    margin: 0 auto;
    pointer-events: none;
    z-index: 1000;
    opacity: 0.4;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* ── Scrollable content area ── */
  .tab-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }

  .tab-content::-webkit-scrollbar { width: 0; }

  /* ── Bottom Nav ── */
  .bottom-nav {
    display: flex;
    align-items: stretch;
    background: var(--dark);
    border-top: 1px solid var(--bark);
    height: 62px;
    flex-shrink: 0;
    z-index: 100;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    padding: 6px 2px;
    position: relative;
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item.active { color: var(--amber-light); }
  .nav-item .nav-icon { font-size: 18px; line-height: 1; }
  .nav-item .nav-label {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .nav-dot {
    position: absolute;
    top: 6px;
    right: calc(50% - 12px);
    width: 7px;
    height: 7px;
    background: var(--red);
    border-radius: 50%;
    border: 1.5px solid var(--dark);
  }

  .nav-badge {
    position: absolute;
    top: 4px;
    right: calc(50% - 16px);
    background: var(--amber);
    color: var(--dark);
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 8px;
    min-width: 14px;
    text-align: center;
  }

  /* ── Section label ── */
  .section-label {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--amber);
    letter-spacing: 3px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--bark), transparent);
  }

  /* ── Cards ── */
  .card {
    background: var(--dark-3);
    border: 1px solid var(--bark);
    border-radius: 14px;
    padding: 16px;
    transition: border-color 0.2s;
  }

  .card:hover { border-color: var(--amber); }

  /* ── Chip ── */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.04em;
    padding: 3px 8px;
    border-radius: 20px;
    white-space: nowrap;
  }

  .chip-amber { background: var(--amber); color: var(--dark); }
  .chip-outline { background: var(--dark-4); color: var(--cream); border: 1px solid var(--amber); }
  .chip-muted { background: var(--dark-4); color: var(--muted); border: 1px solid var(--bark); }
  .chip-green { background: var(--green); color: var(--cream); }
  .chip-filter { background: var(--dark-4); color: var(--muted); border: 1px solid var(--bark); cursor: pointer; transition: all 0.15s; padding: 5px 12px; font-size: 11px; }
  .chip-filter.active { background: var(--amber); color: var(--dark); border-color: var(--amber); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    padding: 10px 16px;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--amber), var(--amber-light));
    color: var(--dark);
    font-weight: 700;
  }

  .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }

  .btn-secondary {
    background: var(--dark-4);
    color: var(--cream);
    border: 1px solid var(--bark);
  }

  .btn-secondary:hover { border-color: var(--amber); color: var(--amber); }

  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--bark);
    padding: 6px 12px;
    font-size: 11px;
  }

  .btn-ghost:hover { color: var(--amber); border-color: var(--amber); }
  .btn-ghost.active { color: var(--amber); border-color: var(--amber); background: rgba(200,130,10,0.08); }

  /* ── FAB ── */
  .fab {
    position: fixed;
    bottom: 78px;
    right: calc(50% - 210px + 16px);
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--amber), var(--amber-light));
    color: var(--dark);
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(200,130,10,0.4);
    z-index: 50;
    transition: transform 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .fab:hover { transform: scale(1.08); }

  @media (max-width: 420px) {
    .fab { right: 16px; }
  }

  /* ── Bottom Sheet ── */
  .sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    max-width: 420px;
    margin: 0 auto;
  }

  .sheet {
    background: var(--dark-3);
    border-radius: 20px 20px 0 0;
    padding: 12px 20px 32px;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .sheet-handle {
    width: 40px;
    height: 4px;
    background: var(--bark);
    border-radius: 2px;
    margin: 0 auto 20px;
  }

  /* ── Progress bar ── */
  .progress-bar {
    height: 6px;
    background: var(--dark-4);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(to right, var(--amber), var(--amber-light));
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  /* ── Stars ── */
  .stars { color: var(--amber); font-size: 14px; letter-spacing: 1px; }

  /* ── Avatar circle ── */
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: var(--font-mono);
    font-weight: 400;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  /* ── Pulse animation (You Are Here) ── */
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(200,130,10,0.7); }
    70% { box-shadow: 0 0 0 12px rgba(200,130,10,0); }
    100% { box-shadow: 0 0 0 0 rgba(200,130,10,0); }
  }

  /* ── Blink dot ── */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .blink { animation: blink 1.2s ease-in-out infinite; }

  /* ── Map styles ── */
  .leaflet-container { background: #0D0A07 !important; }
  .leaflet-popup-content-wrapper {
    background: var(--dark-3) !important;
    color: var(--cream) !important;
    border: 1px solid var(--bark) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
  }
  .leaflet-popup-tip { background: var(--dark-3) !important; }
  .leaflet-popup-close-button { color: var(--muted) !important; font-size: 18px !important; }
  .leaflet-control-zoom {
    border: 1px solid var(--bark) !important;
    border-radius: 8px !important;
    overflow: hidden;
  }
  .leaflet-control-zoom a {
    background: var(--dark-3) !important;
    color: var(--cream) !important;
    border-bottom: 1px solid var(--bark) !important;
  }
  .leaflet-control-zoom a:hover { background: var(--dark-4) !important; }

  /* ── Input ── */
  .input {
    width: 100%;
    background: var(--dark-4);
    border: 1px solid var(--bark);
    border-radius: 10px;
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .input:focus { border-color: var(--amber); }
  .input::placeholder { color: var(--muted); }

  /* ── Match bar ── */
  .match-bar {
    height: 4px;
    background: var(--dark-4);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 6px;
  }

  .match-fill {
    height: 100%;
    background: linear-gradient(to right, var(--amber), var(--amber-pale));
    border-radius: 2px;
  }

  /* ── Live pill ── */
  .live-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(45,90,39,0.3);
    border: 1px solid var(--green-light);
    border-radius: 20px;
    padding: 3px 10px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--green-light);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ── Intel feed ── */
  .intel-msg {
    padding: 10px 0;
    border-bottom: 1px solid rgba(61,43,16,0.5);
  }

  .intel-msg:last-child { border-bottom: none; }

  /* ── Cellar barrel watermark ── */
  .barrel-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 120px;
    opacity: 0.04;
    pointer-events: none;
    user-select: none;
  }

  /* ── Line position card ── */
  .position-card {
    background: transparent;
    border: 2px solid transparent;
    border-radius: 14px;
    padding: 16px;
    background-clip: padding-box;
    position: relative;
  }

  .position-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--amber), var(--amber-pale));
    z-index: -1;
  }

  .position-card-inner {
    background: var(--dark-3);
    border-radius: 12px;
    padding: 16px;
  }

  /* ── Trending card ── */
  .trend-rank {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 900;
    color: var(--bark);
    line-height: 1;
  }
`

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const SIGHTINGS = [
  { id:1, store:"Sandy Forks ABC #01", city:"Raleigh", lat:35.8691, lng:-78.6282, bottles:["Blanton's Original","Eagle Rare"], reporter:"bourbonhunter_nc", daysAgo:0.2 },
  { id:2, store:"Village District ABC #08", city:"Raleigh", lat:35.8050, lng:-78.6621, bottles:["Weller Special Reserve"], reporter:"tarheel_pour", daysAgo:1.5 },
  { id:3, store:"North Hills ABC #12", city:"Raleigh", lat:35.8509, lng:-78.6438, bottles:["E.H. Taylor Small Batch"], reporter:"ncwhiskey", daysAgo:3 },
  { id:4, store:"Cary Crossroads ABC", city:"Cary", lat:35.7915, lng:-78.7811, bottles:["Four Roses Limited","Blanton's Straight"], reporter:"cary_sipper", daysAgo:5 },
  { id:5, store:"Apex ABC", city:"Apex", lat:35.7321, lng:-78.8503, bottles:["Eagle Rare"], reporter:"apexbourbon", daysAgo:7 },
  { id:6, store:"Durham Central ABC", city:"Durham", lat:35.9940, lng:-78.8986, bottles:["Blanton's Original"], reporter:"bullcity_wax", daysAgo:9 },
  { id:7, store:"Morrisville Parkway ABC", city:"Morrisville", lat:35.8326, lng:-78.8255, bottles:["Weller 12","Weller Full Proof"], reporter:"triangle_hunter", daysAgo:2 },
  { id:8, store:"Holly Springs ABC", city:"Holly Springs", lat:35.6513, lng:-78.8340, bottles:["Four Roses Single Barrel"], reporter:"hs_pours", daysAgo:4 },
  { id:9, store:"Garner ABC #2", city:"Garner", lat:35.7113, lng:-78.6141, bottles:["E.H. Taylor Warehouse C"], reporter:"garner_gold", daysAgo:11 },
  { id:10, store:"Wake Forest ABC", city:"Wake Forest", lat:35.9799, lng:-78.5096, bottles:["Blanton's Gold"], reporter:"wf_barrels", daysAgo:6 },
]

const FILTER_OPTIONS = ['All', "Blanton's", 'Weller', 'E.H. Taylor', 'Four Roses', 'Eagle Rare']
const STYLE_FILTERS = ['All', 'BT Allocated', 'Wheaters', 'High Rye', 'Bottled in Bond', 'Single Barrel']

const LINE_USERS = [
  { pos:1, initials:'JD', name:'jake_durham', bg:'#5C4020', camping:true, since:'11:00 PM', following:true },
  { pos:2, initials:'KP', name:'kpours', bg:'#3D2B10', camping:false, following:false },
  { pos:3, initials:'TR', name:'tarheel_pour', bg:'#2D5A27', camping:false, following:true },
  { pos:4, initials:'MB', name:'morebourbon', bg:'#5C4020', camping:false, following:false },
  { pos:5, initials:'NC', name:'ncwhiskey', bg:'#3D2B10', camping:false, following:false },
  { pos:6, initials:'RD', name:'rdwhisky', bg:'#5C4020', camping:false, following:false },
  { pos:7, initials:'BH', name:'bourbonhunter_nc', bg:'#2D5A27', camping:false, following:false },
  { pos:8, initials:'WF', name:'wf_barrels', bg:'#3D2B10', camping:false, following:false },
]

const INTEL_MSGS_INIT = [
  { id:1, handle:'bourbonhunter_nc', initials:'BH', bg:'#5C4020', time:'6:42 AM', text:"Manager just confirmed 6 Blanton's, 4 Eagle Rare. FIFO, no raffle.", following:false },
  { id:2, handle:'jake_durham', initials:'JD', bg:'#3D2B10', time:'6:51 AM', text:'Line moving fast, been here 20 min already got through 8 people', following:true },
  { id:3, handle:'tarheel_pour', initials:'TR', bg:'#2D5A27', time:'7:03 AM', text:'Store manager said they open sharp at 9. No early sales.', following:true },
  { id:4, handle:'ncwhiskey', initials:'NC', bg:'#5C4020', time:'7:18 AM', text:'Anyone know if they got Weller SR confirmed? Rumor was maybe 2 cases.', following:false },
  { id:5, handle:'kpours', initials:'KP', bg:'#3D2B10', time:'7:22 AM', text:'I called yesterday — they said WSR is unconfirmed, possibly coming on the truck', following:false },
  { id:6, handle:'triangle_hunter', initials:'TH', bg:'#2D5A27', time:'7:45 AM', text:'Parking lot is filling up. At least 15 people now. Estimate wait time ~45 min after open.', following:false },
  { id:7, handle:'jake_durham', initials:'JD', bg:'#3D2B10', time:'8:01 AM', text:'EH Taylor just got confirmed by assistant manager! Small batch, 4 bottles.', following:true },
]

const UPCOMING_EVENTS = [
  { id:1, store:"North Hills ABC #12", city:"Raleigh", date:"Sat Mar 21", bottles:["Blanton's Gold","Eagle Rare 17"], rsvp:23 },
  { id:2, store:"Cary Crossroads ABC", city:"Cary", date:"Tue Mar 25", bottles:["Weller Full Proof","Weller 12"], rsvp:41 },
  { id:3, store:"Durham Central ABC", city:"Durham", date:"Fri Mar 28", bottles:["Four Roses Limited","E.H. Taylor Barrel Proof"], rsvp:17 },
]

const REVIEWS = [
  {
    id:1, name:"Jake Durham", handle:"jake_durham", initials:"JD", bg:"#5C4020",
    bottle:"Blanton's Original", rating:4,
    text:"Classic for a reason. The nose is all corn sweetness and orange peel, palate delivers that signature caramel-oak combo. Finish is medium and dry with a pleasant burn.",
    notes:["cherry","vanilla","caramel","oak"],
    likes:47, replies:8, time:"2h ago",
  },
  {
    id:2, name:"Tarheel Pour", handle:"tarheel_pour", initials:"TR", bg:"#2D5A27",
    bottle:"Eagle Rare 10yr", rating:5,
    text:"One of the best value bottles in bourbon. Complex tannins, dried fruit richness, and a finish that goes on forever. Worth every minute in line.",
    notes:["dried fruit","leather","vanilla","dark chocolate","tobacco"],
    likes:92, replies:14, time:"5h ago",
  },
  {
    id:3, name:"NC Whiskey", handle:"ncwhiskey", initials:"NC", bg:"#3D2B10",
    bottle:"Weller Special Reserve", rating:3,
    text:"Entry-level wheater that still outperforms its price. Soft and approachable. More honey and baking spice than I expected. Not complex but very drinkable.",
    notes:["honey","baking spice","vanilla","floral"],
    likes:31, replies:5, time:"1d ago",
  },
  {
    id:4, name:"Triangle Hunter", handle:"triangle_hunter", initials:"TH", bg:"#5C4020",
    bottle:"Four Roses Single Barrel", rating:5,
    text:"OESQ recipe from the Lawrenceburg rickhouse. This one was a banger — massive rye spice, dried cherry, and a finish like burning cinnamon candy. Outstanding barrel.",
    notes:["cinnamon","cherry","baking spice","leather","floral"],
    likes:118, replies:21, time:"2d ago",
  },
  {
    id:5, name:"K Pours", handle:"kpours", initials:"KP", bg:"#3D2B10",
    bottle:"E.H. Taylor Small Batch", rating:4,
    text:"Bonded, bottled at 100 proof, and tasting every bit of it. Corn mash sweetness up front with an herbal rye undertone. Beautiful old-school label too.",
    notes:["caramel","oak","vanilla","baking spice"],
    likes:55, replies:9, time:"3d ago",
  },
]

const TRENDING = [
  { bottle:"Blanton's Original", sightings:34, stores:12, notes:["caramel","vanilla"] },
  { bottle:"Eagle Rare 10yr", sightings:19, stores:7, notes:["dried fruit","leather"] },
  { bottle:"Weller Special Reserve", sightings:14, stores:5, notes:["honey","vanilla"] },
]

const COMMUNITY_USERS = [
  { id:1, name:"Jake Durham", handle:"jake_durham", initials:"JD", bg:"#5C4020", styles:["BT Allocated","Wheaters"], match:94 },
  { id:2, name:"Tarheel Pour", handle:"tarheel_pour", initials:"TR", bg:"#2D5A27", styles:["High Rye","Single Barrel"], match:87 },
  { id:3, name:"NC Whiskey", handle:"ncwhiskey", initials:"NC", bg:"#3D2B10", styles:["Bottled in Bond","BT Allocated"], match:83 },
  { id:4, name:"Triangle Hunter", handle:"triangle_hunter", initials:"TH", bg:"#5C4020", styles:["Wheaters","Single Barrel"], match:79 },
  { id:5, name:"Apex Bourbon", handle:"apexbourbon", initials:"AB", bg:"#2D5A27", styles:["High Rye","BT Allocated"], match:71 },
  { id:6, name:"Bull City Wax", handle:"bullcity_wax", initials:"BC", bg:"#3D2B10", styles:["Single Barrel","Bottled in Bond"], match:68 },
]

const CELLAR_BOTTLES = [
  { id:1, name:"Blanton's Original", distillery:"Buffalo Trace", proof:"93", price:"$69", date:"Jan 15, 2025", store:"Sandy Forks ABC #01", rating:4 },
  { id:2, name:"Eagle Rare 10yr", distillery:"Buffalo Trace", proof:"90", price:"$39", date:"Feb 2, 2025", store:"North Hills ABC #12", rating:5 },
  { id:3, name:"Weller Full Proof", distillery:"Buffalo Trace", proof:"114", price:"$49", date:"Jan 28, 2025", store:"Cary Crossroads ABC", rating:4 },
  { id:4, name:"Four Roses Single Barrel", distillery:"Four Roses", proof:"100", price:"$55", date:"Mar 1, 2025", store:"Village District ABC #08", rating:5 },
  { id:5, name:"E.H. Taylor Small Batch", distillery:"Buffalo Trace", proof:"100", price:"$45", date:"Feb 18, 2025", store:"Morrisville Parkway ABC", rating:4 },
  { id:6, name:"Michter's Toasted Barrel Rye", distillery:"Michter's", proof:"109", price:"$180", date:"Dec 10, 2024", store:"Durham Central ABC", rating:5 },
  { id:7, name:"Russell's Reserve 13yr", distillery:"Wild Turkey", proof:"104.8", price:"$90", date:"Nov 22, 2024", store:"Wake Forest ABC", rating:4 },
  { id:8, name:"Stagg Jr. Batch 18", distillery:"Buffalo Trace", proof:"131.1", price:"$59", date:"Oct 5, 2024", store:"Holly Springs ABC", rating:5 },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function timeAgo(daysAgo) {
  if (daysAgo < 0.083) return 'Just now'
  if (daysAgo < 1) return `${Math.round(daysAgo * 24)}h ago`
  if (daysAgo < 2) return '1 day ago'
  return `${Math.floor(daysAgo)} days ago`
}

function initials(str) {
  return str.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function Stars({ count, max = 5 }) {
  return (
    <span className="stars">
      {'★'.repeat(count)}{'☆'.repeat(max - count)}
    </span>
  )
}

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

// ─── TAB 1: EVENTS ───────────────────────────────────────────────────────────
function EventsTab() {
  const [inLine, setInLine] = useState(true)
  const [camping, setCamping] = useState(false)
  const [myPosition] = useState(9)
  const [rsvps, setRsvps] = useState({ 1: false, 2: true, 3: false })
  const [watched, setWatched] = useState(false)
  const [msgs, setMsgs] = useState(INTEL_MSGS_INIT)
  const [draft, setDraft] = useState('')
  const msgEndRef = useRef(null)

  function sendMsg() {
    if (!draft.trim()) return
    setMsgs(prev => [...prev, {
      id: Date.now(), handle: 'you', initials: 'ME', bg: '#C8820A',
      time: 'Now', text: draft.trim(), following: false
    }])
    setDraft('')
    setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Hero Card */}
      <div className="card" style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div className="live-pill" style={{ marginBottom: 8 }}>
              <span className="blink" style={{ width: 6, height: 6, background: 'var(--green-light)', borderRadius: '50%', display: 'inline-block' }} />
              LIVE DROP
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--cream)', lineHeight: 1.3 }}>
              Fox &amp; Kin Spirits
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
              Sandy Forks ABC #01 · Raleigh
            </div>
          </div>
          <div style={{ background: 'rgba(200,130,10,0.15)', border: '1px solid var(--amber)', borderRadius: 20, padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', whiteSpace: 'nowrap' }}>
            ⏱ ~2 hours
          </div>
        </div>

        {/* Bottles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          <span className="chip chip-amber">Blanton's Original ✓</span>
          <span className="chip chip-amber">Eagle Rare ✓</span>
          <span className="chip chip-outline">Weller Special Reserve ?</span>
          <span className="chip chip-outline">E.H. Taylor SB ?</span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase' }}>Anticipation</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)' }}>85%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '85%' }} /></div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {[['47', 'Going'], ['12', 'In Line'], ['3', 'Camping']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--amber-light)' }}>{v}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setInLine(v => !v)}>
            {inLine ? '✓ In Line' : 'Check In / Join Line'}
          </button>
          <button className={`btn btn-secondary ${watched ? 'active' : ''}`} style={{ padding: '10px 14px' }} onClick={() => setWatched(v => !v)}>
            {watched ? '🔔' : '🔕'}
          </button>
        </div>
      </div>

      {/* Virtual Line Panel */}
      {inLine && (
        <div className="card" style={{ marginBottom: 16 }}>
          <SectionLabel>Virtual Line</SectionLabel>

          {/* My Position Card */}
          <div className="position-card" style={{ marginBottom: 14 }}>
            <div className="position-card-inner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Your Position</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48, color: 'var(--amber-light)', lineHeight: 1 }}>#{myPosition}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>Checked in at 7:31 AM</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <button className={`btn ${camping ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: 11 }} onClick={() => setCamping(v => !v)}>
                    {camping ? '⛺ Camping' : "I'm Camping"}
                  </button>
                  <button className="btn btn-ghost" style={{ fontSize: 11, color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => setInLine(false)}>
                    Leave Line
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Line list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LINE_USERS.map(u => (
              <div key={u.pos} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10,
                background: u.pos <= 3 ? 'rgba(200,130,10,0.08)' : 'transparent',
                border: u.pos <= 3 ? '1px solid rgba(200,130,10,0.2)' : '1px solid transparent'
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: u.pos <= 3 ? 'var(--amber-light)' : 'var(--muted)', width: 24, textAlign: 'center' }}>
                  {u.pos}
                </div>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 11, background: u.bg, color: 'var(--cream)' }}>{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cream)' }}>@{u.name}</span>
                    {u.camping && <span style={{ fontSize: 10 }}>⛺</span>}
                    {u.following && <span className="chip chip-muted" style={{ fontSize: 8, padding: '1px 6px' }}>Following</span>}
                  </div>
                  {u.camping && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>Since {u.since} last night</div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', textAlign: 'center', padding: '6px 0' }}>
              + 4 more in line
            </div>
          </div>
        </div>
      )}

      {/* Drop Intel Thread */}
      <div className="card" style={{ marginBottom: 16 }}>
        <SectionLabel>Drop Intel</SectionLabel>
        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
          {msgs.map(m => (
            <div key={m.id} className="intel-msg">
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 9, background: m.bg, color: 'var(--cream)', flexShrink: 0, marginTop: 2 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>@{m.handle}</span>
                    {m.following && <span className="chip chip-muted" style={{ fontSize: 8, padding: '1px 5px' }}>Following</span>}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>{m.time}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cream-2)', lineHeight: 1.5 }}>{m.text}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={msgEndRef} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Add intel..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button className="btn btn-primary" style={{ padding: '10px 14px', flexShrink: 0 }} onClick={sendMsg}>
            ➤
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <SectionLabel>Upcoming Drops</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {UPCOMING_EVENTS.map(ev => (
          <div key={ev.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2 }}>{ev.store}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{ev.city} · {ev.date}</div>
              </div>
              <button
                className={`btn ${rsvps[ev.id] ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 11, padding: '6px 12px' }}
                onClick={() => setRsvps(prev => ({ ...prev, [ev.id]: !prev[ev.id] }))}
              >
                {rsvps[ev.id] ? '✓ RSVP' : 'RSVP'}
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
              {ev.bottles.map(b => <span key={b} className="chip chip-outline">{b}</span>)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>
              {ev.rsvp + (rsvps[ev.id] ? 1 : 0)} going
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TAB 2: MAP ───────────────────────────────────────────────────────────────
function MapTab() {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [mapFilter, setMapFilter] = useState('All')
  const [confirmedMap, setConfirmedMap] = useState({})
  const [leafletReady, setLeafletReady] = useState(!!window.L)

  // Load Leaflet if not already loaded
  useEffect(() => {
    if (window.L) { setLeafletReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV/XN/WLs='
    script.crossOrigin = ''
    script.onload = () => setLeafletReady(true)
    document.head.appendChild(script)
  }, [])

  // Build SVG DivIcon with opacity decay
  function buildPinIcon(daysAgo, bottle) {
    const opacity = Math.max(0, 1 - daysAgo / 14)
    const hex = (v) => Math.round(v).toString(16).padStart(2, '0')
    const toHex = (r, g, b) => `#${hex(r)}${hex(g)}${hex(b)}`
    const amber = [200, 130, 10]
    const amberLight = [232, 160, 32]
    const dark = [13, 10, 7]

    const svgStr = `
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46" opacity="${opacity}">
        <defs>
          <radialGradient id="pg${Date.now()}" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stop-color="${toHex(...amberLight)}"/>
            <stop offset="100%" stop-color="${toHex(...amber)}"/>
          </radialGradient>
          <filter id="sh">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${toHex(...amber)}" flood-opacity="0.5"/>
          </filter>
        </defs>
        <path d="M19 1C9.6 1 2 8.6 2 18c0 12 17 27 17 27S36 30 36 18C36 8.6 28.4 1 19 1z"
              fill="url(#pg${Date.now()})" filter="url(#sh)" stroke="${toHex(...amber)}" stroke-width="1"/>
        <circle cx="19" cy="18" r="7" fill="${toHex(...dark)}" opacity="0.85"/>
        <text x="19" y="22" text-anchor="middle" font-size="9">🥃</text>
      </svg>`
    return window.L.divIcon({
      className: '',
      html: svgStr,
      iconSize: [38, 46],
      iconAnchor: [19, 46],
      popupAnchor: [0, -46],
    })
  }

  // Build popup HTML
  function buildPopup(s, confirmed) {
    const isConf = confirmed[s.id]
    return `
      <div style="font-family:'DM Mono',monospace;min-width:200px;max-width:240px">
        <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:15px;color:#F2E8D5;margin-bottom:4px">${s.store}</div>
        <div style="font-size:9px;color:#8A7660;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">${s.city} · ${timeAgo(s.daysAgo)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">
          ${s.bottles.map(b => `<span style="background:#C8820A;color:#0D0A07;border-radius:20px;padding:2px 8px;font-size:10px">${b}</span>`).join('')}
        </div>
        <div style="font-size:10px;color:#8A7660;margin-bottom:10px">Reported by <span style="color:#E8A020">@${s.reporter}</span></div>
        <button
          id="conf-btn-${s.id}"
          onclick="window.__bmConfirm(${s.id})"
          style="background:${isConf ? '#C8820A' : '#2E2214'};color:${isConf ? '#0D0A07' : '#F2E8D5'};border:1px solid #C8820A;border-radius:8px;padding:8px 14px;font-family:'DM Mono',monospace;font-size:11px;text-transform:uppercase;cursor:pointer;width:100%">
          ${isConf ? '✓ Confirmed' : 'I Saw This'}
        </button>
      </div>`
  }

  // Draw / redraw markers
  const drawMarkers = useCallback((filter, confirmed) => {
    if (!window.L || !mapInstanceRef.current) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const filtered = filter === 'All'
      ? SIGHTINGS
      : SIGHTINGS.filter(s => s.bottles.some(b => b.toLowerCase().includes(filter.toLowerCase())))

    filtered.forEach(s => {
      const icon = buildPinIcon(s.daysAgo, s.bottles[0])
      const marker = window.L.marker([s.lat, s.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(buildPopup(s, confirmed), { maxWidth: 260 })
      marker._sightingId = s.id
      markersRef.current.push(marker)
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapInstanceRef.current) return

    const L = window.L
    mapInstanceRef.current = L.map(mapContainerRef.current, {
      center: [35.82, -78.72],
      zoom: 11,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current)

    // You Are Here marker
    const youAreHere = document.createElement('div')
    youAreHere.style.cssText = `
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--amber-light); border: 3px solid var(--amber-pale);
      animation: pulse 2s infinite;
    `
    L.marker([35.7796, -78.6382], {
      icon: L.divIcon({ className: '', html: youAreHere.outerHTML, iconSize: [16, 16], iconAnchor: [8, 8] })
    }).addTo(mapInstanceRef.current).bindPopup('📍 You Are Here')

    // Expose confirm callback for popup buttons
    window.__bmConfirm = (id) => {
      setConfirmedMap(prev => {
        const next = { ...prev, [id]: !prev[id] }
        // Update popup content after state change
        markersRef.current.forEach(m => {
          if (m._sightingId === id) {
            const s = SIGHTINGS.find(x => x.id === id)
            m.setPopupContent(buildPopup(s, next))
          }
        })
        return next
      })
    }

    drawMarkers('All', {})
  }, [leafletReady, drawMarkers])

  // Redraw on filter change
  useEffect(() => {
    drawMarkers(mapFilter, confirmedMap)
  }, [mapFilter, confirmedMap, drawMarkers])

  const activeCount = mapFilter === 'All'
    ? SIGHTINGS.length
    : SIGHTINGS.filter(s => s.bottles.some(b => b.toLowerCase().includes(mapFilter.toLowerCase()))).length

  return (
    <div style={{ position: 'relative', height: 'calc(100dvh - 130px)', width: '100%', overflow: 'hidden' }}>
      {/* Map container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Filter chips */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 60, zIndex: 10,
        display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
      }}>
        {FILTER_OPTIONS.map(f => (
          <button key={f} className={`chip chip-filter ${mapFilter === f ? 'active' : ''}`}
            onClick={() => setMapFilter(f)} style={{ flexShrink: 0 }}>
            {f}
          </button>
        ))}
      </div>

      {/* Active count badge */}
      <div style={{
        position: 'absolute', top: 14, right: 12, zIndex: 10,
        background: 'var(--amber)', color: 'var(--dark)',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        borderRadius: 20, padding: '4px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
      }}>
        📍 {activeCount}
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 12, zIndex: 10,
        background: 'rgba(13,10,7,0.85)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--bark)', borderRadius: 10, padding: '10px 14px'
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--amber)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Pin Age</div>
        {[['Today', 1], ['1-3 days', 0.8], ['4-7 days', 0.55], ['8-14 days', 0.3]].map(([label, op]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', opacity: op }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {!leafletReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark-2)', zIndex: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontSize: 13 }}>Loading map...</div>
        </div>
      )}
    </div>
  )
}

// ─── TAB 3: FIND ─────────────────────────────────────────────────────────────
function FindTab() {
  const [search, setSearch] = useState('')
  const [styleFilter, setStyleFilter] = useState('All')
  const [confirmed, setConfirmed] = useState({})

  const filtered = SIGHTINGS.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.store.toLowerCase().includes(q) || s.bottles.some(b => b.toLowerCase().includes(q))
    return matchSearch
  })

  return (
    <div style={{ padding: '16px' }}>
      <input
        className="input"
        placeholder="Search stores or bottles..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 4 }}>
        {STYLE_FILTERS.map(f => (
          <button key={f} className={`chip chip-filter ${styleFilter === f ? 'active' : ''}`}
            onClick={() => setStyleFilter(f)} style={{ flexShrink: 0 }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
        {filtered.length} sightings
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {filtered.map(s => (
          <div key={s.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cream)', marginBottom: 2 }}>{s.store}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{s.city} · {timeAgo(s.daysAgo)}</div>
              </div>
              <button
                className={`btn ${confirmed[s.id] ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 10, padding: '6px 10px', flexShrink: 0 }}
                onClick={() => setConfirmed(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
              >
                {confirmed[s.id] ? '✓ Confirmed' : 'I Saw This'}
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {s.bottles.map(b => <span key={b} className="chip chip-amber">{b}</span>)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="avatar" style={{ width: 24, height: 24, fontSize: 9, background: 'var(--oak)', color: 'var(--cream)' }}>
                  {s.reporter.slice(0, 2).toUpperCase()}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>@{s.reporter}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>
                {confirmed[s.id] ? '✓ ' : ''}{confirmed[s.id] ? 2 : 1} confirmed
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TAB 4: REVIEWS ──────────────────────────────────────────────────────────
function ReviewsTab() {
  const [liked, setLiked] = useState({})

  return (
    <div style={{ padding: '16px' }}>
      <SectionLabel>Recent Reviews</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {REVIEWS.map(r => (
          <div key={r.id} className="card">
            {/* Header */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div className="avatar" style={{ width: 38, height: 38, fontSize: 13, background: r.bg, color: 'var(--cream)', flexShrink: 0 }}>{r.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>{r.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>@{r.handle}</div>
                  </div>
                  <span className="chip chip-amber" style={{ fontSize: 9 }}>{r.bottle}</span>
                </div>
              </div>
            </div>

            <Stars count={r.rating} />

            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'var(--cream-2)', lineHeight: 1.6, margin: '8px 0 10px' }}>
              "{r.text}"
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {r.notes.map(n => <span key={n} className="chip chip-muted">{n}</span>)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: liked[r.id] ? 'var(--amber)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}
                  onClick={() => setLiked(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                >
                  {liked[r.id] ? '♥' : '♡'} {r.likes + (liked[r.id] ? 1 : 0)}
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  💬 {r.replies}
                </button>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>{r.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trending */}
      <SectionLabel>Trending This Week</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {TRENDING.map((t, i) => (
          <div key={t.bottle} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div className="trend-rank">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream)', marginBottom: 4 }}>{t.bottle}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginBottom: 6 }}>
                {t.sightings} sightings · {t.stores} stores
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {t.notes.map(n => <span key={n} className="chip chip-muted" style={{ fontSize: 9 }}>{n}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TAB 5: COMMUNITY ─────────────────────────────────────────────────────────
function CommunityTab() {
  const [following, setFollowing] = useState({ 1: true, 3: true })

  return (
    <div style={{ padding: '16px' }}>
      {/* Stats banner */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        {[['2,847', 'Members'], ['14,203', 'Sightings'], ['8,901', 'Reviews']].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--amber-light)' }}>{v}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <SectionLabel>Suggested for You</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {COMMUNITY_USERS.map(u => (
          <div key={u.id} className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 15, background: u.bg, color: 'var(--cream)', flexShrink: 0 }}>{u.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>{u.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>@{u.handle}</div>
                  </div>
                  <button
                    className={`btn ${following[u.id] ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: 10, padding: '5px 12px' }}
                    onClick={() => setFollowing(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                  >
                    {following[u.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                  {u.styles.map(s => <span key={s} className="chip chip-muted" style={{ fontSize: 9 }}>{s}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>Palate match</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--amber-light)' }}>{u.match}%</div>
                </div>
                <div className="match-bar">
                  <div className="match-fill" style={{ width: `${u.match}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TAB 6: CELLAR ───────────────────────────────────────────────────────────
function CellarTab({ openModal }) {
  return (
    <div style={{ padding: '16px', position: 'relative' }}>
      <div className="barrel-watermark">🛢</div>

      {/* Stats banner */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        {[['24', 'Bottles'], ['11', 'Distilleries'], ['$1,847', 'Invested']].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--amber-light)' }}>{v}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <SectionLabel>My Collection</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 80 }}>
        {CELLAR_BOTTLES.map(b => (
          <div key={b.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cream)', flex: 1, marginRight: 8 }}>{b.name}</div>
              <Stars count={b.rating} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginBottom: 8 }}>
              {b.distillery} · {b.proof}°
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[['Price Paid', b.price], ['Added', b.date]].map(([lbl, val]) => (
                <div key={lbl}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{lbl}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--amber-light)' }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green-light)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>{b.store}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CELLAR MODAL ─────────────────────────────────────────────────────────────
function CellarModal({ onClose }) {
  const [form, setForm] = useState({ bottle: '', store: '', city: '', price: '' })

  function handleChange(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--cream)', marginBottom: 4 }}>Log a Bottle</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginBottom: 20, letterSpacing: 1 }}>
          This sighting will also be shared with the community map
        </div>

        {[
          ['bottle', 'Bottle Name', 'e.g. Blanton\'s Original'],
          ['store', 'Store', 'e.g. Sandy Forks ABC #01'],
          ['city', 'City / State', 'e.g. Raleigh, NC'],
          ['price', 'Price Paid', 'e.g. $69'],
        ].map(([field, label, placeholder]) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 5 }}>{label}</div>
            <input
              className="input"
              placeholder={placeholder}
              value={form[field]}
              onChange={e => handleChange(field, e.target.value)}
            />
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={onClose}>
            Save Bottle
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'events', label: 'Events', icon: '🔔' },
  { id: 'map', label: 'Map', icon: '🗺' },
  { id: 'find', label: 'Find', icon: '🔍' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'community', label: 'Community', icon: '👥' },
  { id: 'cellar', label: 'Cellar', icon: '🛢' },
]

export default function App() {
  const [tab, setTab] = useState('map')
  const [cellarModal, setCellarModal] = useState(false)

  // Inject CSS once
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  return (
    <div className="app-shell">
      {/* Content area */}
      <div className="tab-content">
        {tab === 'events' && <EventsTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'find' && <FindTab />}
        {tab === 'reviews' && <ReviewsTab />}
        {tab === 'community' && <CommunityTab />}
        {tab === 'cellar' && <CellarTab openModal={() => setCellarModal(true)} />}
      </div>

      {/* FAB (Cellar only) */}
      {tab === 'cellar' && (
        <button className="fab" onClick={() => setCellarModal(true)}>+</button>
      )}

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
            {t.id === 'events' && <span className="nav-dot" />}
            {t.id === 'map' && <span className="nav-badge">{SIGHTINGS.length}</span>}
          </button>
        ))}
      </nav>

      {/* Cellar modal */}
      {cellarModal && <CellarModal onClose={() => setCellarModal(false)} />}
    </div>
  )
}
