import { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import './ShowcasePage.css';

/* ============================================
   Data
   ============================================ */

const weeklyData = [
  { day: 'Mon', bookings: 38 },
  { day: 'Tue', bookings: 52 },
  { day: 'Wed', bookings: 61 },
  { day: 'Thu', bookings: 47 },
  { day: 'Fri', bookings: 79 },
  { day: 'Sat', bookings: 94 },
  { day: 'Sun', bookings: 83 },
];

const categoryData = [
  { name: 'Cleaning',    value: 31, fill: '#046588' },
  { name: 'Babysitting', value: 24, fill: '#CFE87B' },
  { name: 'Tutoring',    value: 18, fill: '#2A9ABF' },
  { name: 'Handyman',    value: 15, fill: '#7AC4D4' },
  { name: 'Other',       value: 12, fill: '#B8D4DC' },
];

const workersData = [
  { name: "Maria Santos",      initials: "MS", neighborhood: "Roxbury",       category: "Cleaning",    rating: 4.9, badge: "Fully Certified", bio: "8 years of spotless homes. I bring my own supplies." },
  { name: "David Chen",        initials: "DC", neighborhood: "Brookline",     category: "Tutoring",    rating: 4.8, badge: "ID Verified",     bio: "MIT grad. Patient math & physics tutor for all levels." },
  { name: "Angela Washington", initials: "AW", neighborhood: "Dorchester",    category: "Babysitting", rating: 5.0, badge: "Fully Certified", bio: "CPR certified, mother of 3. Trusted by the community." },
  { name: "Mike O'Brien",      initials: "MO", neighborhood: "South Boston",  category: "Handyman",    rating: 4.7, badge: "Skill Checked",   bio: "No job too small. Plumbing, drywall, assembly." },
  { name: "Priya Nair",        initials: "PN", neighborhood: "Cambridge",     category: "Tutoring",    rating: 4.9, badge: "ID Verified",     bio: "Harvard grad, SAT/ACT specialist. 200+ students coached." },
  { name: "James Okafor",      initials: "JO", neighborhood: "Jamaica Plain", category: "Landscaping", rating: 4.6, badge: "Skill Checked",   bio: "Seasonal yard work, pruning, and garden design." },
];

const reviewsData = [
  { reviewer: "Jasmine T.",  initial: "J", text: "Maria left my apartment cleaner than when I moved in. Absolutely worth every penny. Already booked her again for next month." },
  { reviewer: "Ryan M.",     initial: "R", text: "David helped my son go from a C+ to an A- in Calc BC in just 6 weeks. His explanations are so clear. Wish I'd found him sooner." },
  { reviewer: "Keisha B.",   initial: "K", text: "Angela is like a second grandmother to my kids. They were upset when she had to leave. We've been using her every Friday since." },
  { reviewer: "Tom F.",      initial: "T", text: "Mike fixed a leak I'd been ignoring for months, patched the ceiling, and even tightened a doorknob on his way out. Genuinely great." },
  { reviewer: "Ling C.",     initial: "L", text: "Priya is incredible. My daughter's SAT score went up 180 points. She knows exactly how the test works and how to beat it." },
  { reviewer: "Sofia R.",    initial: "S", text: "James completely transformed our backyard. He came with ideas, didn't just follow instructions. Honestly felt like we hired a designer." },
];

const BADGE_COLORS = {
  'ID Verified':     '#2A9ABF',
  'Skill Checked':   '#CFE87B',
  'Fully Certified': '#046588',
};

/* ============================================
   SVG Icons
   ============================================ */

function StarFilled({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#CFE87B" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#046588" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#046588" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}

function StarOutlineIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#046588" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="M22 4 12 14.01l-3-3"/>
    </svg>
  );
}

function StarTrustIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

/* ============================================
   Section: Hero — Three.js + GSAP
   ============================================ */

function Hero({ onGetStarted, onSeeHowItWorks }) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);

  // Three.js particle field
  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create 600 particles
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const blue = new THREE.Color('#046588');
    const green = new THREE.Color('#CFE87B');

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      // 70% blue, 30% green
      const c = Math.random() < 0.7 ? blue : green;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      points.rotation.y += 0.0005;
      points.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !contentRef.current) return;

    const els = contentRef.current.querySelectorAll('.hero-animate');
    gsap.fromTo(els,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' }
    );
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div ref={contentRef} className="hero-content">
        <p className="hero-animate hero-tag">YOUR NEIGHBORHOOD. VERIFIED.</p>
        <h1 className="hero-animate hero-title">
          Find trusted help,<br />
          <span className="hero-title-accent">right next door.</span>
        </h1>
        <p className="hero-animate hero-subtitle">
          LocalLink connects you with verified babysitters, tutors, handymen,
          and more — all from your own community.
        </p>
        <div className="hero-animate hero-buttons">
          <button className="btn-primary" onClick={onGetStarted}>Get Started</button>
          <button className="btn-outline" onClick={onSeeHowItWorks}>See How It Works</button>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section: Stats Bar — Animated Counters
   ============================================ */

function StatsBar() {
  const ref = useRef(null);
  const countRefs = useRef([]);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST || !ref.current) return;

    const stats = [
      { target: 2400, format: v => Math.round(v).toLocaleString() + '+' },
      { target: 8900, format: v => Math.round(v).toLocaleString() + '+' },
      { target: 4.8,  format: v => v.toFixed(1) + ' / 5' },
      { target: 34,   format: v => String(Math.round(v)) },
    ];

    ST.create({
      trigger: ref.current,
      start: 'top 85%',
      once: true,
      onEnter() {
        stats.forEach((s, i) => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: s.target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() {
              if (countRefs.current[i]) {
                countRefs.current[i].textContent = s.format(obj.val);
              }
            },
          });
        });
      },
    });
  }, []);

  const labels = [
    'Verified Workers',
    'Bookings Completed',
    'Average Rating',
    'Neighborhoods Covered',
  ];

  return (
    <section className="stats-bar" ref={ref}>
      <div className="stats-grid">
        {labels.map((label, i) => (
          <div key={label} className="stat-item">
            <div
              className="stat-number"
              ref={el => { countRefs.current[i] = el; }}
            >
              0
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Section: How It Works
   ============================================ */

function HowItWorks() {
  const ref = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST || !ref.current) return;

    const cards = ref.current.querySelectorAll('.step-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
  }, []);

  const steps = [
    {
      icon: <SearchIcon />,
      title: 'Search',
      text: 'Browse verified service providers in your neighborhood, filtered by category, rating, and distance.',
    },
    {
      icon: <CalendarIcon />,
      title: 'Book',
      text: 'Send a booking request directly. Chat with your provider before they arrive.',
    },
    {
      icon: <StarOutlineIcon />,
      title: 'Review',
      text: 'After the job, leave a review that helps your whole community.',
    },
  ];

  return (
    <section className="how-it-works" ref={ref}>
      <h2 className="section-heading">How It Works</h2>
      <div className="steps-grid">
        {steps.map(s => (
          <div key={s.title} className="step-card">
            <div className="step-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Section: Live Data Dashboard (Recharts)
   ============================================ */

function Dashboard() {
  const [activeBar, setActiveBar] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST || !ref.current) return;

    const cards = ref.current.querySelectorAll('.chart-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
  }, []);

  return (
    <section className="dashboard" ref={ref}>
      <h2 className="section-heading">Platform Activity</h2>
      <div className="charts-grid">
        {/* Chart A — Weekly Bookings */}
        <div className="chart-card">
          <h3>Weekly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyData}
              onMouseMove={state => {
                if (state?.activeTooltipIndex != null) {
                  setActiveBar(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveBar(-1)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#021C28', fontSize: 14 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#021C28', fontSize: 14 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#021C28',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  padding: '8px 14px',
                }}
                cursor={{ fill: 'rgba(4,101,136,0.06)' }}
              />
              <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                {weeklyData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={activeBar === i ? '#CFE87B' : '#046588'}
                    style={{ transition: 'fill 0.2s ease' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart B — Category Breakdown */}
        <div className="chart-card">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#021C28',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  padding: '8px 14px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {categoryData.map((entry, i) => (
              <div key={i} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: entry.fill }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section: Worker Showcase Cards
   ============================================ */

function WorkerShowcase({ onBook }) {
  const ref = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST || !ref.current) return;

    const cards = ref.current.querySelectorAll('.worker-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
  }, []);

  return (
    <section className="workers" ref={ref}>
      <h2 className="section-heading">Meet Your Neighbors</h2>
      <div className="workers-grid">
        {workersData.map(w => (
          <div key={w.name} className="worker-card">
            <div className="worker-avatar">{w.initials}</div>
            <div className="worker-name">{w.name}</div>
            <span className="worker-neighborhood">{w.neighborhood}</span>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="worker-category">{w.category}</span>
            </div>
            <div className="worker-rating">
              {Array.from({ length: 5 }, (_, i) => (
                <StarFilled key={i} />
              ))}
              <span className="worker-rating-number">{w.rating}</span>
            </div>
            <p className="worker-bio">{w.bio}</p>
            <div className="worker-badge">
              <span
                className="badge-dot"
                style={{ backgroundColor: BADGE_COLORS[w.badge] }}
              />
              {w.badge}
            </div>
            <button className="btn-book" onClick={() => onBook(w.name)}>Book Now</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Section: Reviews
   ============================================ */

function ReviewsSection() {
  const ref = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST || !ref.current) return;

    const cards = ref.current.querySelectorAll('.review-card');
    gsap.fromTo(cards,
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
  }, []);

  return (
    <section className="reviews" ref={ref}>
      <h2 className="section-heading">What the Community Says</h2>
      <div className="reviews-grid">
        {reviewsData.map(r => (
          <div key={r.reviewer} className="review-card">
            <span className="review-quote-mark">&ldquo;</span>
            <p className="review-text">{r.text}</p>
            <div className="review-footer">
              <div className="review-avatar">{r.initial}</div>
              <div className="review-info">
                <div className="review-name">{r.reviewer}</div>
                <div className="review-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarFilled key={i} size={14} />
                  ))}
                </div>
              </div>
              <span className="review-verified">Verified Booking</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Section: Trust & Safety Bar
   ============================================ */

function TrustSafety() {
  const trustItems = [
    {
      icon: <ShieldIcon />,
      title: 'ID Verification',
      desc: 'Every worker submits government-issued ID',
    },
    {
      icon: <CheckCircleIcon />,
      title: 'Skill Checks',
      desc: 'Category-specific skills are tested before approval',
    },
    {
      icon: <StarTrustIcon />,
      title: 'Community Reviews',
      desc: 'Real reviews from real neighbors',
    },
    {
      icon: <LockIcon />,
      title: 'Secure Messaging',
      desc: 'All communication stays in-app',
    },
  ];

  return (
    <section className="trust-bar">
      <div className="trust-grid">
        {trustItems.map(item => (
          <div key={item.title} className="trust-item">
            <div className="trust-icon">{item.icon}</div>
            <div className="trust-title">{item.title}</div>
            <div className="trust-desc">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   Section: Provider Sign-Up
   ============================================ */

const CATEGORIES = ['Cleaning', 'Babysitting', 'Tutoring', 'Handyman', 'Landscaping', 'Pet Care', 'Other'];

function ProviderSignup({ onSubmit }) {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', neighborhood: '', category: '', bio: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (!gsap || !ST || !ref.current) return;

    const els = ref.current.querySelectorAll('.provider-animate');
    gsap.fromTo(els,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
  }, []);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.category) return;
    setSubmitted(true);
    onSubmit(form.name);
  };

  return (
    <section className="provider-signup" ref={ref}>
      <div className="provider-grid">
        <div className="provider-pitch provider-animate">
          <span className="provider-label">FOR SERVICE PROVIDERS</span>
          <h2 className="provider-heading">Turn your skills into income</h2>
          <p className="provider-desc">
            Join a growing network of trusted local professionals. Set your own hours,
            build your reputation, and get booked by neighbors who need your help.
          </p>
          <ul className="provider-benefits">
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
              Free to join -- no monthly fees or commissions
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
              Get verified and earn trust badges
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
              Build a reputation with community reviews
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CFE87B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
              Set your own rates and availability
            </li>
          </ul>
          <div className="provider-stat">
            <span className="provider-stat-number">2,400+</span>
            <span className="provider-stat-text">providers already earning on LocalLink</span>
          </div>
        </div>

        <div className="provider-form-card provider-animate">
          {submitted ? (
            <div className="provider-success">
              <div className="provider-success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#046588" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="M22 4 12 14.01l-3-3"/>
                </svg>
              </div>
              <h3>Application received!</h3>
              <p>Thanks, {form.name}. We'll review your application and get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h3 className="provider-form-title">Apply to join</h3>
              <form onSubmit={handleSubmit} className="provider-form">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input type="text" value={form.name} onChange={update('name')} placeholder="e.g. Maria Santos" required />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" required />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Neighborhood</label>
                    <input type="text" value={form.neighborhood} onChange={update('neighborhood')} placeholder="e.g. Roxbury" />
                  </div>
                  <div className="form-field">
                    <label>Category *</label>
                    <select value={form.category} onChange={update('category')} required>
                      <option value="" disabled>Select...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label>Brief Bio</label>
                  <textarea value={form.bio} onChange={update('bio')} placeholder="Tell us about your experience and skills..." rows={3} />
                </div>
                <button type="submit" className="btn-apply">Submit Application</button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Section: Footer CTA
   ============================================ */

function FooterCTA({ onGetStarted }) {
  return (
    <>
      <section className="footer-cta">
        <h2>Ready to meet your neighborhood?</h2>
        <p className="footer-cta-sub">
          Join 2,400+ verified workers and 8,900+ happy customers already on LocalLink.
        </p>
        <button className="btn-cta" onClick={onGetStarted}>Get Started for Free</button>
      </section>
      <footer className="footer">
        &copy; 2025 LocalLink &middot; Built for communities
      </footer>
    </>
  );
}

/* ============================================
   Main Showcase Page
   ============================================ */

export default function ShowcasePage({ onEnterApp }) {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    if (gsap && ST) {
      gsap.registerPlugin(ST);
    }
    return () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(t => t.kill());
      }
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const scrollTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="showcase">
      <Hero
        onGetStarted={onEnterApp}
        onSeeHowItWorks={() => scrollTo('.how-it-works')}
      />
      <StatsBar />
      <HowItWorks />
      <Dashboard />
      <WorkerShowcase onBook={(name) => showToast(`Booking request sent to ${name}!`)} />
      <ReviewsSection />
      <TrustSafety />
      <ProviderSignup onSubmit={(name) => showToast(`Application submitted for ${name}!`)} />
      <FooterCTA onGetStarted={onEnterApp} />
      {toast && (
        <div className="toast-notification">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#046588" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="M22 4 12 14.01l-3-3"/>
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
