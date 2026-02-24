import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0A0F1A", bgCard: "#111827", bgHover: "#1A2235", bgInput: "#1A2235",
  accent: "#FF7438", accentSoft: "rgba(255,116,56,0.12)", accentText: "#FF8F5E",
  cyan: "#90E0EF", cyanSoft: "rgba(144,224,239,0.1)", cyanText: "#90E0EF",
  text: "#E8ECF1", textSec: "#8793A6", textMuted: "#5A6478",
  border: "#1E293B", borderLight: "#2A3550",
  green: "#34D399", greenSoft: "rgba(52,211,153,0.12)",
  red: "#F87171", redSoft: "rgba(248,113,113,0.12)",
  yellow: "#FBBF24", yellowSoft: "rgba(251,191,36,0.12)",
  blue: "#60A5FA", blueSoft: "rgba(96,165,250,0.12)",
};

const CATS = ["All","Babysitting","Tutoring","Handyman","Cleaning","Landscaping","Pet Care","Other"];

const BADGES = {
  NONE: { l: "", c: C.textMuted, ic: "" },
  ID_VERIFIED: { l: "ID Verified", c: C.cyan, ic: "◈" },
  SKILL_CHECKED: { l: "Skill Checked", c: C.green, ic: "◆" },
  FULLY_CERTIFIED: { l: "Certified", c: C.accent, ic: "★" },
};

const W = [
  { id:1,n:"Maria Santos",cat:"Cleaning",nb:"Roxbury",r:30,b:"FULLY_CERTIFIED",bio:"Been cleaning homes in the Roxbury area for 8 years. I bring my own supplies and I'm thorough—baseboards, ovens, you name it.",av:"MS",d:0.8,avl:"Mon–Fri, 9am–5pm" },
  { id:2,n:"David Chen",cat:"Tutoring",nb:"Brookline",r:45,b:"ID_VERIFIED",bio:"MIT grad tutoring math and physics for high school and college students. Patient approach, flexible scheduling.",av:"DC",d:1.2,avl:"Evenings & weekends" },
  { id:3,n:"Angela Washington",cat:"Babysitting",nb:"Dorchester",r:22,b:"FULLY_CERTIFIED",bio:"Mother of three, CPR certified, 10+ years watching kids in the neighborhood. Your little ones are safe with me.",av:"AW",d:2.1,avl:"Flexible, prefer weekdays" },
  { id:4,n:"Mike O'Brien",cat:"Handyman",nb:"South Boston",r:40,b:"SKILL_CHECKED",bio:"I fix things. Plumbing, drywall, furniture assembly, minor electrical. No job too small.",av:"MO",d:1.5,avl:"Mon–Sat, 8am–6pm" },
  { id:5,n:"Fatima Al-Hassan",cat:"Tutoring",nb:"Cambridge",r:50,b:"FULLY_CERTIFIED",bio:"PhD candidate at Harvard. I tutor ESL, writing, and Arabic. I love helping people find their voice.",av:"FA",d:3.0,avl:"Tue/Thu afternoons, weekends" },
  { id:6,n:"Carlos Rivera",cat:"Landscaping",nb:"Jamaica Plain",r:35,b:"ID_VERIFIED",bio:"Lawn care, garden design, snow removal in winter. Born and raised in JP.",av:"CR",d:2.4,avl:"Daily, weather permitting" },
  { id:7,n:"Jenny Park",cat:"Pet Care",nb:"Beacon Hill",r:25,b:"NONE",bio:"Vet tech student who loves animals. Dog walking, cat sitting, happy to handle medication schedules.",av:"JP",d:0.5,avl:"Mornings & late afternoons" },
  { id:8,n:"Robert Williams",cat:"Handyman",nb:"Mattapan",r:35,b:"FULLY_CERTIFIED",bio:"Licensed contractor, 15 years experience. Kitchens, bathrooms, decks. Free estimates.",av:"RW",d:4.2,avl:"Mon–Fri by appointment" },
  { id:9,n:"Lisa Nguyen",cat:"Cleaning",nb:"Chinatown",r:28,b:"SKILL_CHECKED",bio:"Detail-oriented house and apartment cleaning. I specialize in move-in/move-out deep cleans.",av:"LN",d:0.9,avl:"Mon–Sat, flexible hours" },
  { id:10,n:"Tom Jackson",cat:"Landscaping",nb:"Roslindale",r:30,b:"NONE",bio:"Mowing, trimming, leaf cleanup. Just starting out but I work hard and show up on time.",av:"TJ",d:3.8,avl:"Weekends, some weekday mornings" },
  { id:11,n:"Aisha Brown",cat:"Babysitting",nb:"Mission Hill",r:20,b:"ID_VERIFIED",bio:"Education major at Northeastern. Experienced with kids ages 2–10. Can help with homework too.",av:"AB",d:1.1,avl:"Afternoons & evenings" },
  { id:12,n:"Greg Murphy",cat:"Other",nb:"Charlestown",r:0,b:"SKILL_CHECKED",bio:"Odd jobs and errands—grocery runs, furniture moving, airport rides. Text me what you need.",av:"GM",d:2.0,avl:"Anytime, just reach out" },
];

const SR = [
  {wId:1,rv:"Sarah M.",rt:5,cm:"Maria cleaned our apartment before move-out and we got our full deposit back. Highly recommend.",dt:"Feb 10"},
  {wId:1,rv:"James R.",rt:5,cm:"Always thorough and on time. Been using her monthly for 6 months.",dt:"Jan 22"},
  {wId:1,rv:"Priya P.",rt:4,cm:"Great job overall. Missed a couple spots in the bathroom but otherwise perfect.",dt:"Jan 5"},
  {wId:2,rv:"Sarah M.",rt:5,cm:"David helped my son go from a C to an A- in calculus. Worth every penny.",dt:"Feb 15"},
  {wId:2,rv:"Priya P.",rt:4,cm:"Very knowledgeable. Sometimes runs a bit over the scheduled time.",dt:"Jan 18"},
  {wId:3,rv:"James R.",rt:5,cm:"Angela is amazing with our kids. They actually ask for her by name now.",dt:"Feb 8"},
  {wId:3,rv:"Sarah M.",rt:5,cm:"So reliable. Never had to worry once.",dt:"Jan 30"},
  {wId:4,rv:"Priya P.",rt:5,cm:"Mike showed up on time and fixed our leaky faucet in 20 minutes. Fair price too.",dt:"Feb 12"},
  {wId:4,rv:"James R.",rt:4,cm:"Good work on the drywall patch. Took a bit longer than estimated.",dt:"Jan 15"},
  {wId:5,rv:"Sarah M.",rt:5,cm:"Fatima is an incredible writing tutor. My essays improved dramatically.",dt:"Feb 1"},
  {wId:6,rv:"James R.",rt:4,cm:"Carlos did a great job on our front yard. Will hire again in spring.",dt:"Nov 10"},
  {wId:7,rv:"Priya P.",rt:3,cm:"Jenny was great with our dog but forgot to lock the back gate once. Otherwise solid.",dt:"Feb 5"},
  {wId:8,rv:"Sarah M.",rt:5,cm:"Robert rebuilt our deck and it looks brand new. True craftsman.",dt:"Jan 20"},
  {wId:9,rv:"James R.",rt:5,cm:"Lisa did an amazing deep clean before we moved in. Spotless.",dt:"Feb 18"},
  {wId:9,rv:"Priya P.",rt:4,cm:"Very detail-oriented. Apartment smelled great after.",dt:"Jan 28"},
  {wId:11,rv:"Sarah M.",rt:5,cm:"Aisha is wonderful. My daughter loves her and she even helped with math homework.",dt:"Feb 14"},
  {wId:12,rv:"James R.",rt:4,cm:"Greg helped us move furniture to our new place. Strong and careful.",dt:"Jan 10"},
];

const inputBase = {
  width:"100%",padding:"14px 16px",borderRadius:8,border:`1.5px solid ${C.borderLight}`,background:C.bgInput,
  color:C.text,fontSize:15,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color 0.2s, box-shadow 0.2s",
  WebkitAppearance:"none",colorScheme:"dark"
};
const focusStyle = { borderColor: C.accent, boxShadow: `0 0 0 3px ${C.accent}25` };

function Stars({v,sz=14,interactive,onChange}) {
  return (
    <span style={{display:"inline-flex",gap:1,cursor:interactive?"pointer":"default"}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} onClick={()=>interactive&&onChange?.(i)} style={{fontSize:sz,color:i<=v?C.yellow:C.borderLight,transition:"color 0.15s"}}>★</span>
      ))}
    </span>
  );
}

function Badge({b}) {
  const x = BADGES[b]; if(b==="NONE") return null;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:x.c,letterSpacing:"0.03em",textTransform:"uppercase"}}>{x.ic} {x.l}</span>;
}

function Btn({children,onClick,variant="primary",full,style:s={}}) {
  const base = {padding:"14px 24px",borderRadius:8,border:"none",cursor:"pointer",fontSize:15,fontWeight:600,letterSpacing:"0.02em",transition:"all 0.2s",width:full?"100%":"auto",fontFamily:"inherit",...s};
  const styles = {
    primary:{...base,background:C.accent,color:"#fff"},
    outline:{...base,background:"transparent",border:`1.5px solid ${C.borderLight}`,color:C.text},
    danger:{...base,background:C.redSoft,color:C.red,border:`1px solid ${C.red}30`},
    success:{...base,background:C.greenSoft,color:C.green,border:`1px solid ${C.green}30`},
    ghost:{...base,background:"none",color:C.accentText,padding:"8px 0"},
  };
  return <button onClick={onClick} style={styles[variant]||styles.primary}>{children}</button>;
}

function Input({autoFocus,...props}) {
  const ref = useRef(null);
  useEffect(()=>{ if(autoFocus && ref.current) ref.current.focus(); },[]);
  return <input ref={ref} {...props} style={{...inputBase,...(props.style||{})}}
    onFocus={e=>{Object.assign(e.target.style,focusStyle);props.onFocus?.(e);}}
    onBlur={e=>{e.target.style.borderColor=C.borderLight;e.target.style.boxShadow="none";props.onBlur?.(e);}}
  />;
}

function TextArea({autoFocus,...props}) {
  const ref = useRef(null);
  useEffect(()=>{ if(autoFocus && ref.current) ref.current.focus(); },[]);
  return <textarea ref={ref} {...props} style={{...inputBase,resize:"vertical",...(props.style||{})}}
    onFocus={e=>{Object.assign(e.target.style,focusStyle);props.onFocus?.(e);}}
    onBlur={e=>{e.target.style.borderColor=C.borderLight;e.target.style.boxShadow="none";props.onBlur?.(e);}}
  />;
}

function Label({children}) {
  return <div style={{fontSize:12,fontWeight:600,color:C.textSec,marginBottom:6,marginTop:18,letterSpacing:"0.05em",textTransform:"uppercase"}}>{children}</div>;
}

function NavBar({tab,setTab,role,setSw,setAb}) {
  return (
    <div style={{display:"flex",borderTop:`1px solid ${C.border}`,background:C.bgCard,position:"sticky",bottom:0}}>
      {[{id:"home",l:role==="customer"?"Discover":"Dashboard",ic:role==="customer"?"◎":"▣"},
        {id:"bookings",l:"Bookings",ic:"▤"},
        {id:"profile",l:"Profile",ic:"◉"}
      ].map(t=>(
        <button key={t.id} onClick={()=>{setTab(t.id);setSw(null);setAb(null);}} style={{
          flex:1,padding:"12px 0 10px",border:"none",background:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
          color:tab===t.id?C.accent:C.textMuted,fontWeight:tab===t.id?700:500,fontSize:10,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"inherit",transition:"color 0.2s"
        }}>
          <span style={{fontSize:18,lineHeight:1}}>{t.ic}</span>{t.l}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [scr,setScr]=useState("welcome");
  const [role,setRole]=useState(null);
  const [user,setUser]=useState(null);
  const [cat,setCat]=useState("All");
  const [q,setQ]=useState("");
  const [vo,setVo]=useState(false);
  const [sw,setSw]=useState(null);
  const [bks,setBks]=useState([]);
  const [bf,setBf]=useState({msg:"",date:"",time:""});
  const [rf,setRf]=useState({rt:0,cm:""});
  const [ab,setAb]=useState(null);
  const [allRevs,setAllRevs]=useState([...SR]);
  const [msgs,setMsgs]=useState({});
  const [mi,setMi]=useState("");
  const [tab,setTab]=useState("home");
  const [toast,setToast]=useState("");
  const [wp,setWp]=useState({name:"",bio:"",cat:"Babysitting",rate:"",nb:"",avl:""});
  const [wc,setWc]=useState(false);
  const [bt,setBt]=useState("PENDING");
  const [rn,setRn]=useState("");
  const [re,setRe]=useState("");

  const show=(m)=>{setToast(m);setTimeout(()=>setToast(""),2500);};

  const wRevs=(id)=>allRevs.filter(r=>r.wId===id);
  const wAvg=(id)=>{const r=wRevs(id);return r.length?r.reduce((a,x)=>a+x.rt,0)/r.length:0;};

  const fw=W.filter(w=>{
    if(cat!=="All"&&w.cat!==cat)return false;
    if(vo&&w.b==="NONE")return false;
    if(q&&!w.n.toLowerCase().includes(q.toLowerCase())&&!w.nb.toLowerCase().includes(q.toLowerCase()))return false;
    return true;
  }).sort((a,b)=>a.d-b.d);

  const font = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  // Toast overlay
  const toastEl = toast ? <div style={{position:"fixed",bottom:64,left:"50%",transform:"translateX(-50%)",background:C.bgCard,border:`1px solid ${C.borderLight}`,color:C.text,padding:"10px 22px",borderRadius:8,fontSize:13,fontWeight:600,zIndex:100,letterSpacing:"0.02em"}}>{toast}</div> : null;

  // WELCOME
  if(scr==="welcome") return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 32px",fontFamily:font}}>
      <div style={{marginBottom:48}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:16}}>LocalLink</div>
        <h1 style={{color:C.text,fontSize:36,fontWeight:300,margin:0,lineHeight:1.2,letterSpacing:"-0.01em"}}>Find trusted help<br/><span style={{fontWeight:700}}>in your neighborhood</span></h1>
        <p style={{color:C.textSec,fontSize:14,marginTop:14,lineHeight:1.6,maxWidth:300}}>Connecting communities with verified local service providers. Built on trust, not algorithms.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Btn onClick={()=>{setRole("customer");setScr("register");}} full>Find Services</Btn>
        <Btn variant="outline" onClick={()=>{setRole("worker");setScr("register");}} full>Offer Services</Btn>
      </div>
      <div style={{marginTop:48,display:"flex",gap:24}}>
        {[{n:"200+",l:"Local Pros"},{n:"4.8",l:"Avg Rating"},{n:"12",l:"Neighborhoods"}].map(s=>(
          <div key={s.l}><div style={{fontSize:22,fontWeight:700,color:C.text}}>{s.n}</div><div style={{fontSize:11,color:C.textMuted,letterSpacing:"0.05em",textTransform:"uppercase",marginTop:2}}>{s.l}</div></div>
        ))}
      </div>
    </div>
  );

  // REGISTER
  if(scr==="register") return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,padding:"40px 32px",fontFamily:font}}>
      <Btn variant="ghost" onClick={()=>setScr("welcome")}>← Back</Btn>
      <div style={{marginTop:24,marginBottom:32}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>{role==="customer"?"Customer":"Service Provider"}</div>
        <h2 style={{color:C.text,fontSize:28,fontWeight:300,margin:0}}>Create your <span style={{fontWeight:700}}>account</span></h2>
      </div>
      <Label>Full Name</Label>
      <Input autoFocus value={rn} onChange={e=>setRn(e.target.value)} placeholder="Your name" />
      <Label>Email</Label>
      <Input value={re} onChange={e=>setRe(e.target.value)} placeholder="you@email.com" />
      <Label>Password</Label>
      <Input type="password" placeholder="••••••••" />
      <div style={{marginTop:24}}><Btn onClick={()=>{if(rn&&re){setUser({name:rn,email:re});setScr("app");setTab(role==="worker"&&!wc?"profile":"home");}}} full>Continue</Btn></div>
      {toastEl}
    </div>
  );

  if(scr!=="app"&&scr!=="booking"&&scr!=="review") return null;

  // WORKER PROFILE DETAIL
  if(sw){
    const w=sw;const wr=wRevs(w.id);const wa=wAvg(w.id);
    return(
      <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:font,color:C.text}}>
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
          <Btn variant="ghost" onClick={()=>setSw(null)}>← Back</Btn>
          <div style={{marginTop:16,marginBottom:24}}>
            <div style={{width:64,height:64,borderRadius:8,background:`linear-gradient(135deg,${C.accent}30,${C.cyan}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:C.accent,marginBottom:16,letterSpacing:"0.05em"}}>{w.av}</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <h2 style={{margin:0,fontSize:24,fontWeight:700,color:C.text}}>{w.n}</h2>
              <Badge b={w.b}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,color:C.textSec,fontSize:13}}>
              <span>{w.cat}</span><span style={{color:C.borderLight}}>·</span><span>{w.nb}</span><span style={{color:C.borderLight}}>·</span><span>{w.d} mi</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <Stars v={Math.round(wa)} sz={15}/>
              <span style={{color:C.textSec,fontSize:13}}>{wa.toFixed(1)} ({wr.length})</span>
              <span style={{marginLeft:"auto",fontSize:20,fontWeight:700,color:C.accent}}>{w.r>0?`$${w.r}`:""}<span style={{fontSize:13,fontWeight:400,color:C.textMuted}}>{w.r>0?"/hr":"Quote"}</span></span>
            </div>
          </div>
          <div style={{background:C.bgCard,borderRadius:8,padding:16,border:`1px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase",marginBottom:8}}>About</div>
            <div style={{color:C.textSec,fontSize:14,lineHeight:1.6}}>{w.bio}</div>
          </div>
          <div style={{background:C.bgCard,borderRadius:8,padding:16,border:`1px solid ${C.border}`,marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase",marginBottom:8}}>Availability</div>
            <div style={{color:C.textSec,fontSize:14}}>{w.avl}</div>
          </div>
          {role==="customer"&&<Btn onClick={()=>setScr("booking")} full>Request Booking</Btn>}
          <div style={{marginTop:28,marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase"}}>Reviews ({wr.length})</div>
          </div>
          {wr.length===0?<p style={{color:C.textMuted,fontSize:14}}>No reviews yet.</p>:wr.map((r,i)=>(
            <div key={i} style={{borderBottom:i<wr.length-1?`1px solid ${C.border}`:"none",padding:"14px 0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:600,fontSize:13,color:C.text}}>{r.rv}</span>
                <Stars v={r.rt} sz={12}/>
              </div>
              <div style={{color:C.textSec,fontSize:13,marginTop:6,lineHeight:1.5}}>{r.cm}</div>
              <div style={{color:C.textMuted,fontSize:11,marginTop:6}}>{r.dt}</div>
            </div>
          ))}
        </div>
        <NavBar tab={tab} setTab={setTab} role={role} setSw={setSw} setAb={setAb}/>
        {toastEl}
      </div>
    );
  }

  // BOOKING FORM
  if(scr==="booking"){
    const w=sw||W[0];
    return(
      <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:font,color:C.text}}>
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
          <Btn variant="ghost" onClick={()=>setScr("app")}>← Back</Btn>
          <div style={{marginTop:24,marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>New Booking</div>
            <h2 style={{color:C.text,fontSize:22,fontWeight:300,margin:0}}>Request <span style={{fontWeight:700}}>{w.n}</span></h2>
            <div style={{color:C.textSec,fontSize:13,marginTop:4}}>{w.cat} · {w.nb}</div>
          </div>
          <Label>Message</Label>
          <TextArea autoFocus value={bf.msg} onChange={e=>setBf(p=>({...p,msg:e.target.value}))} rows={3} placeholder="Describe what you need..." />
          <Label>Date</Label>
          <Input type="date" value={bf.date} onChange={e=>setBf(p=>({...p,date:e.target.value}))} />
          <Label>Time</Label>
          <Input type="time" value={bf.time} onChange={e=>setBf(p=>({...p,time:e.target.value}))} />
          <div style={{marginTop:24}}>
            <Btn onClick={()=>{
              if(!bf.date||!bf.time){show("Please fill in date and time");return;}
              setBks(p=>[{id:Date.now(),wId:w.id,wN:w.n,wAv:w.av,cat:w.cat,...bf,st:"PENDING",cN:user?.name||"You"},...p]);
              setBf({msg:"",date:"",time:""});setSw(null);setScr("app");setTab("bookings");show("Request sent");
            }} full>Send Request</Btn>
          </div>
        </div>
        <NavBar tab={tab} setTab={setTab} role={role} setSw={setSw} setAb={setAb}/>
        {toastEl}
      </div>
    );
  }

  // BOOKING DETAIL
  if(ab){
    const b=ab;const cm=msgs[b.id]||[];
    const stC={PENDING:{bg:C.yellowSoft,c:C.yellow},ACCEPTED:{bg:C.greenSoft,c:C.green},COMPLETED:{bg:C.blueSoft,c:C.blue},DECLINED:{bg:C.redSoft,c:C.red},CANCELLED:{bg:C.bgInput,c:C.textMuted}};
    const sc=stC[b.st]||stC.PENDING;
    return(
      <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:font,color:C.text}}>
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
          <Btn variant="ghost" onClick={()=>{setAb(null);setMi("");}}>← Back</Btn>
          <div style={{background:C.bgCard,borderRadius:8,padding:18,border:`1px solid ${C.border}`,marginTop:12,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:8,background:`linear-gradient(135deg,${C.accent}30,${C.cyan}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.accent}}>{b.wAv}</div>
                <div><div style={{fontWeight:700,fontSize:15,color:C.text}}>{role==="customer"?b.wN:b.cN}</div><div style={{fontSize:12,color:C.textSec}}>{b.cat}</div></div>
              </div>
              <span style={{padding:"4px 10px",borderRadius:4,fontSize:11,fontWeight:700,background:sc.bg,color:sc.c,letterSpacing:"0.05em",textTransform:"uppercase"}}>{b.st}</span>
            </div>
            <div style={{fontSize:13,color:C.textSec}}>{b.date} at {b.time}</div>
            {b.msg&&<div style={{fontSize:13,color:C.textSec,marginTop:8,padding:"10px 12px",background:C.bg,borderRadius:6,fontStyle:"italic"}}>"{b.msg}"</div>}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {role==="worker"&&b.st==="PENDING"&&<>
              <Btn variant="success" onClick={()=>{const u={...b,st:"ACCEPTED"};setBks(p=>p.map(x=>x.id===b.id?u:x));setAb(u);show("Accepted");}}>Accept</Btn>
              <Btn variant="danger" onClick={()=>{const u={...b,st:"DECLINED"};setBks(p=>p.map(x=>x.id===b.id?u:x));setAb(u);show("Declined");}}>Decline</Btn>
            </>}
            {role==="worker"&&b.st==="ACCEPTED"&&<Btn onClick={()=>{const u={...b,st:"COMPLETED"};setBks(p=>p.map(x=>x.id===b.id?u:x));setAb(u);show("Completed");}}>Mark Completed</Btn>}
            {role==="customer"&&(b.st==="PENDING"||b.st==="ACCEPTED")&&<Btn variant="danger" onClick={()=>{const u={...b,st:"CANCELLED"};setBks(p=>p.map(x=>x.id===b.id?u:x));setAb(u);show("Cancelled");}}>Cancel</Btn>}
            {role==="customer"&&b.st==="COMPLETED"&&!b.rvd&&<Btn onClick={()=>setScr("review")}>Leave Review</Btn>}
          </div>
          {(b.st==="ACCEPTED"||b.st==="COMPLETED")&&<>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase",marginBottom:10}}>Messages</div>
            <div style={{background:C.bgCard,borderRadius:8,border:`1px solid ${C.border}`,padding:14,minHeight:100,maxHeight:220,overflowY:"auto",marginBottom:10}}>
              {cm.length===0?<div style={{color:C.textMuted,fontSize:13,textAlign:"center",padding:20}}>No messages yet</div>:
                cm.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.s==="you"?"flex-end":"flex-start",marginBottom:6}}>
                    <div style={{background:m.s==="you"?C.accent+"20":C.bgInput,color:m.s==="you"?C.accentText:C.textSec,padding:"8px 14px",borderRadius:8,maxWidth:"75%",fontSize:13,lineHeight:1.4}}>{m.t}</div>
                  </div>
                ))
              }
            </div>
            <div style={{display:"flex",gap:8}}>
              <Input value={mi} onChange={e=>setMi(e.target.value)} placeholder="Type a message..." style={{flex:1}} onKeyDown={e=>{if(e.key==="Enter"&&mi.trim()){setMsgs(p=>({...p,[b.id]:[...(p[b.id]||[]),{s:"you",t:mi.trim()}]}));setMi("");}}}/>
              <Btn onClick={()=>{if(mi.trim()){setMsgs(p=>({...p,[b.id]:[...(p[b.id]||[]),{s:"you",t:mi.trim()}]}));setMi("");}}} style={{padding:"14px 18px"}}>Send</Btn>
            </div>
          </>}
        </div>
        <NavBar tab={tab} setTab={setTab} role={role} setSw={setSw} setAb={setAb}/>
        {toastEl}
      </div>
    );
  }

  // REVIEW
  if(scr==="review"&&ab){
    const b=ab;
    return(
      <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:font,color:C.text}}>
        <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>
          <Btn variant="ghost" onClick={()=>setScr("app")}>← Back</Btn>
          <div style={{marginTop:24,marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>Review</div>
            <h2 style={{color:C.text,fontSize:22,fontWeight:300,margin:0}}>Rate <span style={{fontWeight:700}}>{b.wN}</span></h2>
          </div>
          <Label>Rating</Label>
          <div style={{marginBottom:8}}><Stars v={rf.rt} sz={32} interactive onChange={r=>setRf(p=>({...p,rt:r}))}/></div>
          <Label>Comment</Label>
          <TextArea autoFocus value={rf.cm} onChange={e=>setRf(p=>({...p,cm:e.target.value}))} rows={3} placeholder="How was your experience?" />
          <div style={{marginTop:24}}>
            <Btn onClick={()=>{
              if(!rf.rt){show("Select a rating");return;}
              setAllRevs(p=>[{wId:b.wId,rv:user?.name||"You",rt:rf.rt,cm:rf.cm,dt:"Just now"},...p]);
              const u={...b,rvd:true};setBks(p=>p.map(x=>x.id===b.id?u:x));setAb(u);
              setRf({rt:0,cm:""});setScr("app");setTab("bookings");show("Review submitted");
            }} full>Submit Review</Btn>
          </div>
        </div>
        <NavBar tab={tab} setTab={setTab} role={role} setSw={setSw} setAb={setAb}/>
        {toastEl}
      </div>
    );
  }

  // MAIN TABS
  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:font,color:C.text}}>
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 20px"}}>

        {tab==="home"&&role==="customer"&&(
          <div style={{paddingTop:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>LocalLink</div>
            <h2 style={{color:C.text,fontSize:26,fontWeight:300,margin:"0 0 4px"}}>Discover <span style={{fontWeight:700}}>Local Help</span></h2>
            <div style={{color:C.textMuted,fontSize:13,marginBottom:16}}>Boston area · {fw.length} providers</div>
            <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or neighborhood..." />
            <div style={{display:"flex",gap:6,overflowX:"auto",padding:"12px 0",flexWrap:"wrap"}}>
              {CATS.map(c=>(
                <button key={c} onClick={()=>setCat(c)} style={{
                  padding:"7px 16px",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap",fontFamily:"inherit",transition:"all 0.15s",letterSpacing:"0.02em",
                  background:cat===c?C.accent:C.bgCard,color:cat===c?"#fff":C.textSec,border:cat===c?"none":`1px solid ${C.border}`
                }}>{c}</button>
              ))}
            </div>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:C.textMuted,marginBottom:16,cursor:"pointer"}}>
              <input type="checkbox" checked={vo} onChange={e=>setVo(e.target.checked)} style={{accentColor:C.accent,width:16,height:16}} /> Verified only
            </label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {fw.length===0?<div style={{color:C.textMuted,textAlign:"center",padding:40,fontSize:14}}>No providers found</div>:
                fw.map(w=>{
                  const wa=wAvg(w.id);const wr=wRevs(w.id).length;
                  return(
                    <div key={w.id} onClick={()=>setSw(w)} style={{background:C.bgCard,borderRadius:8,padding:16,cursor:"pointer",border:`1px solid ${C.border}`,display:"flex",gap:14,transition:"border-color 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderLight}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div style={{width:48,height:48,borderRadius:8,background:`linear-gradient(135deg,${C.accent}20,${C.cyan}15)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:C.accent,flexShrink:0,letterSpacing:"0.05em"}}>{w.av}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                          <span style={{fontWeight:700,fontSize:15,color:C.text}}>{w.n}</span>
                          <Badge b={w.b}/>
                        </div>
                        <div style={{color:C.textMuted,fontSize:12,marginTop:3}}>{w.cat} · {w.nb} · {w.d} mi</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                          <Stars v={Math.round(wa)} sz={12}/><span style={{color:C.textMuted,fontSize:12}}>{wa.toFixed(1)} ({wr})</span>
                          <span style={{marginLeft:"auto",fontWeight:700,fontSize:14,color:C.accent}}>{w.r>0?`$${w.r}/hr`:"Quote"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {tab==="home"&&role==="worker"&&(
          <div style={{paddingTop:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>Dashboard</div>
            {wc?<>
              <div style={{background:C.bgCard,borderRadius:8,padding:20,border:`1px solid ${C.border}`,marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:52,height:52,borderRadius:8,background:`linear-gradient(135deg,${C.accent}30,${C.cyan}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:C.accent}}>{(wp.name||user?.name||"").split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:18,color:C.text}}>{wp.name||user?.name}</div>
                    <div style={{color:C.textSec,fontSize:13}}>{wp.cat} · {wp.nb}</div>
                    <Badge b="ID_VERIFIED"/>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:24}}>
                {[{n:bks.filter(b=>b.st==="COMPLETED").length,l:"Done"},{n:bks.filter(b=>b.st==="PENDING").length,l:"Pending"},{n:bks.filter(b=>b.st==="ACCEPTED").length,l:"Active"}].map(s=>(
                  <div key={s.l} style={{flex:1,background:C.bgCard,borderRadius:8,padding:14,border:`1px solid ${C.border}`,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:700,color:C.accent}}>{s.n}</div>
                    <div style={{fontSize:11,color:C.textMuted,letterSpacing:"0.05em",textTransform:"uppercase",marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase",marginBottom:10}}>Incoming</div>
              {bks.filter(b=>b.st==="PENDING").length===0?<div style={{color:C.textMuted,fontSize:14,padding:20,textAlign:"center"}}>No pending requests</div>:
                bks.filter(b=>b.st==="PENDING").map(b=>(
                  <div key={b.id} onClick={()=>setAb(b)} style={{background:C.bgCard,borderRadius:8,padding:14,border:`1px solid ${C.border}`,cursor:"pointer",marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div style={{fontWeight:600,color:C.text,fontSize:14}}>{b.cN}</div>
                      <span style={{fontSize:11,color:C.yellow,fontWeight:600}}>PENDING</span>
                    </div>
                    <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>{b.cat} · {b.date}</div>
                  </div>
                ))
              }
            </>:<div style={{color:C.textSec,fontSize:14,padding:40,textAlign:"center"}}>Set up your profile in the Profile tab to get started.</div>}
          </div>
        )}

        {tab==="bookings"&&(
          <div style={{paddingTop:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>Bookings</div>
            <div style={{display:"flex",gap:4,marginBottom:16}}>
              {[{k:"PENDING",l:"Pending"},{k:"ACCEPTED",l:"Active"},{k:"COMPLETED",l:"Done"}].map(s=>(
                <button key={s.k} onClick={()=>setBt(s.k)} style={{flex:1,padding:"9px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",letterSpacing:"0.03em",
                  background:bt===s.k?C.accent+"20":"transparent",color:bt===s.k?C.accent:C.textMuted,transition:"all 0.15s"
                }}>{s.l}</button>
              ))}
            </div>
            {bks.filter(b=>b.st===bt).length===0?<div style={{color:C.textMuted,fontSize:14,textAlign:"center",padding:40}}>No {bt.toLowerCase()} bookings</div>:
              bks.filter(b=>b.st===bt).map(b=>{
                const sc2={PENDING:{bg:C.yellowSoft,c:C.yellow},ACCEPTED:{bg:C.greenSoft,c:C.green},COMPLETED:{bg:C.blueSoft,c:C.blue}}[b.st];
                return(
                  <div key={b.id} onClick={()=>setAb(b)} style={{background:C.bgCard,borderRadius:8,padding:14,border:`1px solid ${C.border}`,cursor:"pointer",marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div><div style={{fontWeight:600,color:C.text,fontSize:14}}>{role==="customer"?b.wN:b.cN}</div><div style={{fontSize:12,color:C.textMuted,marginTop:2}}>{b.cat} · {b.date} at {b.time}</div></div>
                      <span style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:sc2?.bg,color:sc2?.c,letterSpacing:"0.05em"}}>{b.st}</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}

        {tab==="profile"&&role==="customer"&&(
          <div style={{paddingTop:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>Profile</div>
            <div style={{background:C.bgCard,borderRadius:8,padding:24,border:`1px solid ${C.border}`,marginBottom:16}}>
              <div style={{width:56,height:56,borderRadius:8,background:`linear-gradient(135deg,${C.accent}30,${C.cyan}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:C.accent,marginBottom:14}}>{(user?.name||"").split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
              <div style={{fontWeight:700,fontSize:18,color:C.text}}>{user?.name}</div>
              <div style={{color:C.textSec,fontSize:13,marginTop:2}}>{user?.email}</div>
              <div style={{color:C.textMuted,fontSize:11,letterSpacing:"0.05em",textTransform:"uppercase",marginTop:6}}>Customer</div>
            </div>
            <Btn variant="danger" onClick={()=>{setScr("welcome");setUser(null);setRole(null);setBks([]);setMsgs({});}} full>Log Out</Btn>
          </div>
        )}

        {tab==="profile"&&role==="worker"&&(
          <div style={{paddingTop:24}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",color:C.accent,textTransform:"uppercase",marginBottom:8}}>{wc?"Edit Profile":"Setup"}</div>
            <h2 style={{color:C.text,fontSize:22,fontWeight:300,margin:"0 0 8px"}}>{wc?"Update your":"Create your"} <span style={{fontWeight:700}}>profile</span></h2>
            <Label>Display Name</Label>
            <Input autoFocus value={wp.name} onChange={e=>setWp(p=>({...p,name:e.target.value}))} placeholder="Your name" />
            <Label>Category</Label>
            <select value={wp.cat} onChange={e=>setWp(p=>({...p,cat:e.target.value}))} style={{...inputBase,cursor:"pointer"}}>
              {CATS.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <Label>Bio</Label>
            <TextArea value={wp.bio} onChange={e=>setWp(p=>({...p,bio:e.target.value}))} rows={3} placeholder="Tell customers about yourself..." />
            <Label>Rate ($/hr)</Label>
            <Input type="number" value={wp.rate} onChange={e=>setWp(p=>({...p,rate:e.target.value}))} placeholder="e.g. 25" />
            <Label>Neighborhood</Label>
            <Input value={wp.nb} onChange={e=>setWp(p=>({...p,nb:e.target.value}))} placeholder="e.g. Dorchester" />
            <Label>Availability</Label>
            <Input value={wp.avl} onChange={e=>setWp(p=>({...p,avl:e.target.value}))} placeholder="e.g. Mon-Fri, 9am-5pm" />
            <div style={{marginTop:24}}><Btn onClick={()=>{setWc(true);setTab("home");show(wc?"Profile updated":"Profile created");}} full>{wc?"Save Changes":"Create Profile"}</Btn></div>
            <div style={{marginTop:12}}><Btn variant="danger" onClick={()=>{setScr("welcome");setUser(null);setRole(null);setBks([]);setMsgs({});setWc(false);}} full>Log Out</Btn></div>
          </div>
        )}

      </div>
      <NavBar tab={tab} setTab={setTab} role={role} setSw={setSw} setAb={setAb}/>
      {toastEl}
    </div>
  );
}