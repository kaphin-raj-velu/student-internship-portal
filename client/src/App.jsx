import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, MapPin, Search, ShieldCheck, Sparkles, Users, XCircle } from "lucide-react";
import { getApplications, getInternship, getInternships, submitApplication } from "./api";

function Header() {
  return (
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark"><BriefcaseBusiness size={19} /></span><span>intern<span className="brand-accent">connect</span></span></Link>
      <nav><NavLink to="/" end>Explore internships</NavLink><a href="#apply">How it works</a></nav>
      <a className="nav-cta" href="#apply">Apply now <ArrowUpRight size={15} /></a>
    </header>
  );
}

function Footer() {
  return <footer className="footer"><span>© {new Date().getFullYear()} InternConnect</span><span>Built for student opportunities <span className="footer-dot">●</span></span></footer>;
}

function Alert({ type, children }) {
  if (!children) return null;
  return <div className={`alert ${type}`} role="status">{type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{children}</div>;
}

function ApplicationForm({ internships, initialInternship = "", onSuccess }) {
  const [form, setForm] = useState({ studentName: "", email: "", rollNumber: "", internshipId: initialInternship });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (initialInternship) setForm((old) => ({ ...old, internshipId: initialInternship }));
  }, [initialInternship]);

  function update(event) {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
    setMessage({ type: "", text: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    if (!form.studentName.trim() || !form.email.trim() || !form.rollNumber.trim() || !form.internshipId) {
      setMessage({ type: "error", text: "Please complete every field before submitting." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setMessage({ type: "error", text: "Enter a valid email address." });
      return;
    }
    setBusy(true);
    try {
      const result = await submitApplication({
        ...form,
        studentName: form.studentName.trim(),
        email: form.email.trim(),
        rollNumber: form.rollNumber.trim().toUpperCase()
      });
      setMessage({ type: "success", text: `${result.message} Your application ID is ${result.application._id}.` });
      setForm({ studentName: "", email: "", rollNumber: "", internshipId: initialInternship || "" });
      onSuccess?.();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit} id="apply">
      <div className="form-heading"><div><span className="eyebrow">YOUR NEXT CHAPTER</span><h3>Apply for an internship</h3></div><span className="secure-label"><ShieldCheck size={15} /> Secure form</span></div>
      <div className="field-grid">
        <label>Full name<input name="studentName" value={form.studentName} onChange={update} placeholder="Enter your full name" minLength="2" maxLength="80" required /></label>
        <label>College email ID<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
        <label>Roll number<input name="rollNumber" value={form.rollNumber} onChange={update} placeholder="e.g. 24BCS001" minLength="3" maxLength="30" required /></label>
        <label>Choose internship<select name="internshipId" value={form.internshipId} onChange={update} required><option value="">Select an opportunity</option>{internships.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      </div>
      <Alert type={message.type}>{message.text}</Alert>
      <button className="button button-primary submit-button" type="submit" disabled={busy}>{busy ? "Submitting application…" : "Submit application"} <ArrowRight size={17} /></button>
      <p className="form-note">By submitting, you confirm the details above are accurate.</p>
    </form>
  );
}

function InternshipCard({ item, index }) {
  return (
    <article className="internship-card">
      <div className={`company-icon icon-${index % 3}`}><BriefcaseBusiness size={21} /></div>
      <div className="card-topline"><span className="pill">{item.type}</span><span className="card-index">0{index + 1}</span></div>
      <h3>{item.title}</h3><p className="company-name">{item.company}</p>
      <p className="card-description">{item.description}</p>
      <div className="meta-row"><span><MapPin size={14} />{item.location}</span><span><Clock3 size={14} />{item.duration}</span></div>
      <div className="skills">{item.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="card-bottom"><strong>{item.stipend}</strong><Link className="text-link" to={`/internships/${item.id}`}>View details <ArrowRight size={15} /></Link></div>
    </article>
  );
}

function Home() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [applicationCount, setApplicationCount] = useState(null);

  async function refreshCount() {
    try {
      const data = await getApplications();
      setApplicationCount(data.count);
    } catch {
      setApplicationCount(null);
    }
  }

  useEffect(() => {
    getInternships().then((data) => setInternships(data.internships)).catch((err) => setError(err.message)).finally(() => setLoading(false));
    refreshCount();
  }, []);

  const filtered = internships.filter((item) => `${item.title} ${item.company} ${item.skills.join(" ")}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-copy"><div className="hero-tag"><Sparkles size={14} /> FIND YOUR STARTING POINT</div><h1>Your next opportunity<br />starts <span>right here.</span></h1><p>Discover internships that turn what you’re learning into what you can do. Find your fit, apply, and take the next step.</p><div className="hero-actions"><a className="button button-light" href="#opportunities">Explore opportunities <ArrowRight size={17} /></a><a className="hero-secondary" href="#apply">How to apply <ArrowUpRight size={16} /></a></div><div className="hero-proof"><div className="proof-icon"><Users size={18} /></div><div><strong>{internships.length || "—"} opportunities</strong><span>Curated for student growth</span></div><div className="proof-divider" /><div><strong>{applicationCount === null ? "Live portal" : `${applicationCount} applications`}</strong><span>Application tracker</span></div></div></div>
        <div className="hero-visual"><div className="visual-window"><div className="window-bar"><span /><span /><span /><small>opportunities / for you</small></div><div className="visual-content"><div className="visual-kicker">YOUR CAREER, IN MOTION</div><div className="visual-title">Small steps.<br /><b>Big futures.</b></div><div className="visual-line" /><div className="visual-job"><div className="visual-job-icon"><BriefcaseBusiness size={18} /></div><div><b>Frontend Developer</b><span>Remote · 3 months</span></div><span className="visual-status">Open</span></div><div className="visual-job faded"><div className="visual-job-icon purple"><Sparkles size={18} /></div><div><b>Full Stack Intern</b><span>Remote · 6 months</span></div><span className="visual-status">Open</span></div><div className="visual-progress"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="visual-footer"><span>KEEP BUILDING</span><span>01 — 03</span></div></div></div><div className="floating-note"><span className="floating-check"><CheckCircle2 size={17} /></span><div><b>One step closer</b><small>Your journey begins here</small></div></div><div className="floating-star">✳</div></div>
      </section>

      <section className="stats-strip"><div><strong>01</strong><span>Discover roles</span></div><div><strong>02</strong><span>Explore the details</span></div><div><strong>03</strong><span>Submit your application</span></div><div className="stats-end">YOUR FUTURE ISN’T ON HOLD.</div></section>

      <section className="section opportunities" id="opportunities">
        <div className="section-top"><div><span className="eyebrow">THE OPPORTUNITY BOARD</span><h2>Find your kind of work.</h2><p>Real-world experience begins with the right first step.</p></div><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles or skills" aria-label="Search roles or skills" /></div></div>
        {loading ? <div className="state-message">Loading internships…</div> : error ? <Alert type="error">{error}</Alert> : filtered.length ? <div className="internship-grid">{filtered.map((item, index) => <InternshipCard key={item.id} item={item} index={index} />)}</div> : <div className="state-message">No internships match that search. Try another role or skill.</div>}
      </section>

      <section className="apply-section section" id="apply-section"><div className="apply-intro"><span className="eyebrow">MAKE IT OFFICIAL</span><h2>Ready to take<br />the <span>first step?</span></h2><p>Fill in your details, choose an opportunity, and send your application. It only takes a minute.</p><div className="apply-check"><CheckCircle2 size={18} /><span>Clear, simple application process</span></div><div className="apply-check"><CheckCircle2 size={18} /><span>Confirmation when your details are saved</span></div></div><ApplicationForm internships={internships} onSuccess={refreshCount} /></section>
    </>
  );
}

function Details() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    Promise.all([getInternship(id), getInternships()])
      .then(([one, all]) => { setItem(one.internship); setInternships(all.internships); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="section details-state">Loading internship details…</main>;
  if (error || !item) return <main className="section details-state"><Alert type="error">{error || "Internship not found."}</Alert><Link className="text-link" to="/">Back to opportunities</Link></main>;

  return <main className="details-page"><Link className="back-link" to="/">← Back to all opportunities</Link><section className="details-hero"><div className="company-icon icon-1"><BriefcaseBusiness size={22} /></div><span className="pill">{item.type}</span><h1>{item.title}</h1><p>{item.company} <span>·</span> {item.location}</p><div className="details-tags"><span><Clock3 size={15} />{item.duration}</span><span><MapPin size={15} />{item.location}</span><span>{item.stipend}</span></div></section><div className="details-layout"><div className="details-copy"><div className="detail-panel"><span className="eyebrow">THE ROLE</span><h2>What you’ll work on</h2><p>{item.about}</p><ul>{item.responsibilities.map((task) => <li key={task}>{task}</li>)}</ul></div><div className="detail-panel"><span className="eyebrow">WHAT HELPS</span><h2>Skills to bring</h2><div className="skills detail-skills">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></div><aside className="detail-apply"><span className="eyebrow">YOUR NEXT STEP</span><h3>Interested in this role?</h3><p>Submit your details to apply. Make sure your email and roll number are correct.</p><a className="button button-primary" href="#apply">Apply for this internship <ArrowRight size={16} /></a><div className="detail-divider" /><div className="detail-mini"><ShieldCheck size={18} /><span><b>Simple application</b><small>Submit and receive confirmation</small></span></div></aside></div><section className="details-form-wrap" id="apply"><ApplicationForm internships={internships} initialInternship={item.id} /></section></main>;
}

function Applications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications().then((data) => setItems(data.applications)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  return <main className="section records-page"><span className="eyebrow">PORTAL RECORDS</span><h1>Submitted applications</h1><p className="records-intro">Applications retrieved from the backend database.</p>{loading ? <p>Loading saved applications…</p> : error ? <Alert type="error">{error}</Alert> : items.length === 0 ? <p className="state-message">No applications have been submitted yet.</p> : <div className="table-wrap"><table><thead><tr><th>Student</th><th>Roll number</th><th>Email</th><th>Internship</th><th>Submitted</th></tr></thead><tbody>{items.map((item) => <tr key={item._id}><td>{item.studentName}</td><td>{item.rollNumber}</td><td>{item.email}</td><td>{item.internshipTitle}</td><td>{new Date(item.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}<Link className="text-link records-back" to="/">← Back to portal</Link></main>;
}

export default function App() {
  return <div className="app-shell"><Header /><Routes><Route path="/" element={<Home />} /><Route path="/internships/:id" element={<Details />} /><Route path="/applications" element={<Applications />} /><Route path="*" element={<main className="section"><h1>Page not found</h1><Link to="/">Return to internships</Link></main>} /></Routes><Footer /></div>;
}
