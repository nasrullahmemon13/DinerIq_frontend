import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowDown, UtensilsCrossed, Menu, X, Play, Pause, BarChart3, Users, Leaf, Check, Plus, Minus, Layers, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const views = {
  Menu: { eyebrow: 'MENU INTELLIGENCE', title: 'Find your next best seller.', text: 'See which dishes bring guests back and which ones bring the margin. Give every item on your menu a clear purpose.', metric: 'Menu performance', value: 'Profit drivers', rows: [['Grilled salmon', 88], ['Signature burger', 72], ['Garden bowl', 56]], image: '/images/dish_salmon.jpg', tag: 'Understand every dish' },
  Customers: { eyebrow: 'CUSTOMER INTELLIGENCE', title: 'Know the people at your tables.', text: 'Understand visit patterns, discover your most loyal guests, and spot customers who may need a reason to return.', metric: 'Customer segments', value: 'A clearer picture', rows: [['Loyal guests', 84], ['Returning guests', 64], ['New discoveries', 45]], image: '/images/auth_register_bg.jpg', tag: 'Make every visit count' },
  Operations: { eyebrow: 'OPERATIONAL INTELLIGENCE', title: 'Less guesswork. Less waste.', text: 'Compare locations, understand food waste, and use demand forecasts to plan your next service with confidence.', metric: 'Operational focus', value: 'Better preparation', rows: [['Demand planning', 91], ['Stock visibility', 76], ['Waste tracking', 60]], image: '/images/auth_login_bg.jpg', tag: 'Keep your team in sync' }
};
const faqs = [
  ['What is DineIQ?', 'DineIQ is a restaurant analytics workspace that brings menu performance, customer insights, demand forecasting, and operational reporting together.'],
  ['Can I explore before creating an account?', 'Yes. Choose Explore demo to open the sign-in page, select a demo role, and sign in to explore the workspace.'],
  ['Does it work for more than one location?', 'Yes. The workspace includes location comparisons and location filters so teams can review individual restaurants and compare performance.'],
  ['Who can use the workspace?', 'DineIQ provides role-based access for administrators, regional managers, store managers, and analysts. Each role has access to the tools relevant to its responsibilities.']
];
export default function LandingPage() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('Menu');
  const [openFaq, setOpenFaq] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const video = useRef(null);
  const view = views[activeView];
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'DineIQ — Restaurant intelligence, served simply.';
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => { if (motion.matches) video.current?.pause(); else video.current?.play().catch(() => {}); };
    apply(); motion.addEventListener('change', apply);
    return () => { document.title = previousTitle; motion.removeEventListener('change', apply); };
  }, []);
  const toggleVideo = () => { if (playing) video.current?.pause(); else video.current?.play().catch(() => setVideoError(true)); };
  return <div className="landing">
    <a className="lp-skip" href="#platform">Skip to content</a>
    <section className="lp-hero" aria-label="Restaurant intelligence">
      <video ref={video} className="lp-video" muted loop playsInline preload="metadata" poster="/videos/restaurant-poster.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setVideoError(true)} aria-hidden="true"><source src="/videos/restaurant-hero.mp4" type="video/mp4" /></video>
      <div className="lp-hero-shade" />
      <header className="lp-header">
        <Link className="lp-brand" to="/" aria-label="DineIQ home"><UtensilsCrossed size={26} /><span>DineIQ<span className="lp-brand-dot">.</span></span></Link>
        <nav id="landing-navigation" className={`lp-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#platform" onClick={() => setMenuOpen(false)}>The platform</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#who-its-for" onClick={() => setMenuOpen(false)}>Built for you</a>
          <Link className="lp-mobile-login" to={user ? '/dashboard' : '/login'}>{user ? 'Open dashboard' : 'Sign in'}</Link>
        </nav>
        <div className="lp-header-actions"><Link className="lp-signin" to={user ? '/dashboard' : '/login'}>{user ? 'Dashboard' : 'Sign in'} <ArrowUpRight size={15} /></Link><Link className="lp-button lp-button-small" to="/register">Get started <ArrowUpRight size={15} /></Link><button className="lp-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="landing-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>
      <div className="lp-hero-copy"><div className="lp-kicker"><span /> BUILT FOR BETTER RESTAURANTS</div><h1>Great food.<br />Better decisions.<br /><em>That’s DineIQ.</em></h1><p>You bring the hospitality. We bring the clarity.<br className="lp-desktop-break" /> Turn your restaurant data into your next great move.</p><div className="lp-hero-ctas"><Link className="lp-button" to="/register">Start your next chapter <ArrowUpRight size={18} /></Link><Link className="lp-demo-link" to="/login"><span><Play size={12} fill="currentColor" /></span> Explore demo</Link></div></div>
      <div className="lp-hero-aside"><span className="lp-aside-icon"><Sparkles size={20} /></span><p>A little more insight.<br />A lot more possibility.</p><span>FROM FIRST ORDER TO NEXT LOCATION</span></div>
      <div className="lp-hero-bottom"><a href="#platform"><span className="lp-scroll-icon"><ArrowDown size={16} /></span> Discover what’s possible</a><span className="lp-hero-caption">THE ART OF HOSPITALITY. THE SCIENCE OF GROWTH.</span><button onClick={toggleVideo} disabled={videoError} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <Pause size={13} /> : <Play size={13} />} {videoError ? 'Still view' : playing ? 'Pause film' : 'Play film'}</button></div>
    </section>
    <div className="lp-capabilities"><span>ONE WORKSPACE.<br /><strong>EVERY PERSPECTIVE.</strong></span><div><UtensilsCrossed size={19} /> Menu intelligence</div><div><Users size={19} /> Customer insights</div><div><BarChart3 size={19} /> Demand forecasting</div><div><Leaf size={19} /> Waste reduction</div></div>
    <main>
      <section id="platform" className="lp-section lp-platform">
        <div className="lp-section-heading"><div><span className="lp-label">01 / THE BIGGER PICTURE</span><h2>Behind every great restaurant,<br /><em>there’s a smarter decision.</em></h2></div><p>Less time piecing numbers together.<br />More time doing what you do best.<br />Meet your new perspective on the business.</p></div>
        <div className="lp-tabs" role="tablist" aria-label="Explore platform capabilities">{Object.keys(views).map((name, i) => <button id={`tab-${name}`} role="tab" aria-selected={name === activeView} aria-controls="platform-preview" key={name} onClick={() => setActiveView(name)} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const names = Object.keys(views); const index = e.key === 'Home' ? 0 : e.key === 'End' ? names.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + names.length) % names.length; setActiveView(names[index]); document.getElementById(`tab-${names[index]}`)?.focus(); } }} tabIndex={name === activeView ? 0 : -1}><span>0{i + 1}</span>{name}<ArrowUpRight size={17} /></button>)}</div>
        <div className="lp-showcase" id="platform-preview" role="tabpanel" aria-labelledby={`tab-${activeView}`}>
          <div className="lp-showcase-copy"><span className="lp-label">{view.eyebrow}</span><h3>{view.title}</h3><p>{view.text}</p><Link to="/login">Explore the workspace <ArrowUpRight size={18} /></Link><div className="lp-showcase-note"><Check size={15} /> {view.tag}</div></div>
          <div className="lp-product-scene"><img className="lp-product-photo" src={view.image} alt="" loading="lazy" /><div className="lp-preview-card"><div className="lp-preview-top"><span><BarChart3 size={16} /> DineIQ insights</span><span>ILLUSTRATIVE PREVIEW</span></div><p>{view.metric}</p><h4>{view.value}</h4><div className="lp-preview-bars">{view.rows.map(([label, value]) => <div key={label}><span>{label}</span><div><i style={{ width: `${value}%` }} /></div></div>)}</div><div className="lp-preview-foot"><span /> A clearer view of what comes next <ArrowUpRight size={14} /></div></div></div>
        </div>
      </section>
      <section className="lp-process lp-section" id="how-it-works"><div className="lp-section-heading"><div><span className="lp-label">02 / FROM DATA TO DIRECTION</span><h2>Big-picture thinking.<br /><em>Three simple steps.</em></h2></div><Link to="/login" className="lp-text-link">See it for yourself <ArrowUpRight size={18} /></Link></div><div className="lp-steps">{[{icon: Layers,title:'Bring it together.',text:'Upload your restaurant data and bring orders, menu items, customers, and locations into one workspace.'},{icon: BarChart3,title:'See the story.',text:'Explore clear dashboards to understand performance, discover patterns, and compare what matters.'},{icon: Sparkles,title:'Make your move.',text:'Use forecasts and recommendations to plan your next service, refine your menu, and focus your team.'}].map(({icon: Icon,title,text},i)=><article key={title}><div className="lp-step-top"><span>0{i+1}</span><Icon size={24} strokeWidth={1.4}/></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="lp-team lp-section" id="who-its-for"><div className="lp-team-image"><img src="/images/auth_login_bg.jpg" loading="lazy" alt="Warm restaurant interior ready for service"/><span>GOOD HOSPITALITY STARTS WITH A CONNECTED TEAM.</span></div><div className="lp-team-copy"><span className="lp-label">03 / A SEAT FOR EVERYONE</span><h2>One team.<br /><em>A shared perspective.</em></h2><p>From the dining room to the bigger picture, give everyone the insight they need.</p><div className="lp-team-roles">{[['Store managers','A clearer view of day-to-day operations.'],['Regional managers','The full picture across your locations.'],['Analysts & administrators','Deeper insights. The right controls.']].map(([title,text])=><div key={title}><Check size={17}/><span><strong>{title}</strong><small>{text}</small></span></div>)}</div><Link className="lp-text-link" to="/login">Find your perspective <ArrowUpRight size={18}/></Link></div></section>
      <section className="lp-faq lp-section" id="questions"><div><span className="lp-label">A FEW THINGS TO KNOW</span><h2>Glad you<br /><em>asked.</em></h2></div><div>{faqs.map(([question,answer],i)=><div className="lp-faq-item" key={question}><h3><button aria-expanded={openFaq===i} aria-controls={`faq-${i}`} onClick={()=>setOpenFaq(openFaq===i?null:i)}>{question}{openFaq===i?<Minus size={18}/>:<Plus size={18}/>}</button></h3><p id={`faq-${i}`} hidden={openFaq!==i}>{answer}</p></div>)}</div></section>
      <section className="lp-final-cta"><span className="lp-label">YOUR NEXT CHAPTER STARTS HERE</span><h2>More clarity.<br /><em>More room to grow.</em></h2><Link className="lp-button" to="/register">Let’s get started <ArrowUpRight size={18}/></Link><Link className="lp-final-demo" to="/login">Or explore the demo first <ArrowRight size={14}/></Link></section>
    </main>
    <footer className="lp-footer"><Link className="lp-brand" to="/"><UtensilsCrossed size={23}/><span>DineIQ.</span></Link><span>Restaurant intelligence, served simply.</span><nav aria-label="Footer navigation"><a href="#platform">Platform</a><a href="#questions">FAQs</a><Link to="/login">Sign in <ArrowUpRight size={12}/></Link></nav><small>© {new Date().getFullYear()} DineIQ Analytics</small></footer>
  </div>;
}
