import { createContext, useContext, useEffect, useState } from "react";
import AR from "./ar.js";
import { WEBSITE, PHONE, PHONE_TEL, WA, HERO, CATS, AREAS, PKG_IMG, SEASONS, TIPS, CHIPS, NIGHTS, COMPANY, LICENSE } from "./data.js";
import "./styles.css";

const Ctx = createContext((s) => s);
const useT = () => useContext(Ctx);

// A block with a background photo (src may be missing -> plain colour)
function Photo({ src, pos, as: Tag = "div", style, ...rest }) {
  return <Tag {...rest} style={{ ...style, "--img": src ? `url("${src}")` : "none", "--pos": pos || "center" }} />;
}

function Nav({ lang, setLang }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [["things", "Things to do"], ["packages", "Packages"], ["areas", "Where to go"], ["season", "When to visit"], ["tips", "Travel tips"], ["plan", "Contact"]];
  return (
    <header className={"nav" + (solid || open ? " solid" : "")}>
      <div className="wrap">
        <a className="logo" href="#top"><img src="/images/logo.jpg" alt="" />SFM <span>Travels</span></a>
        <nav className={"links" + (open ? " open" : "")} aria-label="Main">
          {links.map(([id, l]) => <a key={id} href={"#" + id} onClick={() => setOpen(false)}>{t(l)}</a>)}
        </nav>
        <div className="navr">
          <div className="langs" role="group" aria-label="Language">
            {[["en", "English"], ["ar", "العربية"]].map(([k, n]) =>
              <button key={k} type="button" className="lb" aria-pressed={lang === k} onClick={() => setLang(k)}>{n}</button>)}
          </div>
          <a className="btn sm" href="#plan">{t("Plan my trip")}</a>
          <button className="burger" aria-label={t("Menu")} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  );
}

function Hero({ f, setF }) {
  const t = useT();
  const [i, setI] = useState(0);
  const [vid, setVid] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % HERO.length), 7000);
    return () => clearInterval(id);
  }, []);
  const sel = (label, key, opts, show = (o) => o) => (
    <div><label>{t(label)}</label>
      <select value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
        {opts.map((o) => <option key={o} value={o}>{t(show(o))}</option>)}
      </select></div>
  );
  return (
    <div className="hero" id="top">
      <div className="slides" aria-hidden="true">
        {HERO.map(([src, pos], k) => <div key={k} className={"slide" + (k === i ? " on" : "")} style={{ backgroundImage: `url("${src}")`, backgroundPosition: pos }} />)}
      </div>
      {/* Optional HD video: save your file as frontend/public/media/hero.mp4 */}
      <video className={"hv" + (vid ? " ready" : "")} autoPlay muted loop playsInline preload="auto" onCanPlay={() => setVid(true)} aria-hidden="true">
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      <div className="wrap">
        <h1>{t("Discover Dubai with SFM Travels")}</h1>
        <p>{t("Desert safaris, skyline views, souks and beaches. Tailor-made holiday packages from SFM Travels, with hotels, transfers and tours all booked for you.")}</p>
        <form className="search" onSubmit={(e) => { e.preventDefault(); document.getElementById("packages").scrollIntoView({ behavior: "smooth" }); }}>
          {sel("Trip type", "cat", CHIPS, (o) => (o === "All" ? "Any trip" : o))}
          {sel("Nights", "nights", Object.keys(NIGHTS))}
          <button className="btn" type="submit" style={{ alignSelf: "end" }}>{t("Find packages")}</button>
        </form>
      </div>
    </div>
  );
}

function Things({ setF, f }) {
  const t = useT();
  return (
    <section id="things"><div className="wrap">
      <div className="head"><div><h2>{t("Things to do in Dubai")}</h2><p>{t("Pick what you love and we will build the trip around it.")}</p></div></div>
      <div className="cats">
        {CATS.map(([name, src, pos, cat]) =>
          <Photo key={name} as="a" href="#packages" className="cat" src={src} pos={pos} onClick={() => setF({ ...f, cat })}>
            <span>{t(name)}</span>
          </Photo>)}
      </div>
    </div></section>
  );
}

function Packages({ f, setF, pickPackage }) {
  const t = useT();
  const [all, setAll] = useState(null);
  useEffect(() => { fetch("/api/packages").then((r) => r.json()).then(setAll).catch(() => setAll([])); }, []);
  const [lo, hi] = NIGHTS[f.nights];
  const list = (all || []).filter((p) => (f.cat === "All" || p.category === f.cat) && p.nights >= lo && p.nights <= hi);
  return (
    <section id="packages" className="areas"><div className="wrap">
      <div className="head"><div><h2>{t("Recommended packages")}</h2><p>{t("Contact us for prices and availability.")}</p></div>
        <a className="link" href="#plan" onClick={() => pickPackage("")}>{t("Custom package")}</a></div>
      <div className="chips">
        {CHIPS.map((c) => <button key={c} type="button" aria-pressed={f.cat === c} onClick={() => setF({ ...f, cat: c })}>{t(c)}</button>)}
      </div>
      {!all && <p className="empty">{t("Loading packages…")}</p>}
      {all && list.length === 0 && <p className="empty">{t("No packages match these filters.")}</p>}
      <div className="grid">
        {list.map((p) => {
          const [src, pos] = PKG_IMG[p.img] || [];
          return (
            <article className="pkg" key={p.id}>
              <Photo className="pic" src={src} pos={pos}>{t(p.tag)}<i>{t(`${p.nights} nights`)}</i></Photo>
              <div className="body"><h3>{t(p.name)}</h3><p>{t(p.desc)}</p>
                <div className="foot"><span />
                  <a className="link" href="#plan" onClick={() => pickPackage(p.name)}>{t("Get a quote")}</a></div></div>
            </article>
          );
        })}
      </div>
    </div></section>
  );
}

function Areas() {
  const t = useT();
  return (
    <section id="areas"><div className="wrap">
      <div className="head"><div><h2>{t("Where to go")}</h2><p>{t("Dubai is a city of very different neighbourhoods. We help you choose where to stay.")}</p></div></div>
      <div className="area-grid">
        {AREAS.map(([n, d, src, pos]) => <Photo key={n} className="area" src={src} pos={pos}><h3>{t(n)}</h3><p>{t(d)}</p></Photo>)}
      </div>
    </div></section>
  );
}

function Cards({ id, title, sub, items, soft }) {
  const t = useT();
  return (
    <section id={id} className={soft ? "areas" : ""}><div className="wrap">
      <div className="head"><div><h2>{t(title)}</h2>{sub && <p>{t(sub)}</p>}</div></div>
      <div className="season">{items.map(([h, p]) => <div key={h}><h3>{t(h)}</h3><p>{t(p)}</p></div>)}</div>
    </div></section>
  );
}

function Plan({ interest, setInterest, lang, names }) {
  const t = useT();
  const [state, setState] = useState("idle");
  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const pk = fd.get("pk");
    setState("sending");
    try {
      const r = await fetch("/api/enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), phone: fd.get("phone"), email: fd.get("email"), travel_date: fd.get("date") || null,
          travellers: parseInt(fd.get("guests")) || 1, language: lang,
          message: (pk ? `[Package: ${pk}] ` : "") + (fd.get("message") || ""),
        }),
      });
      if (!r.ok) throw new Error(r.status);
      form.reset(); setInterest(""); setState("ok");
    } catch { setState("err"); }
  }
  const wa = `${WA}?text=${encodeURIComponent(t("Hello SFM Travels, I would like to plan a Dubai trip."))}`;
  return (
    <section id="plan" className="plan"><div className="wrap cols">
      <div><h2>{t("Tell us about your trip")}</h2>
        <p>{t("Share your dates and interests. An SFM travel expert will get back to you with a package and a quote.")}</p>
        <p>{t("Phone")}: <a href={PHONE_TEL} dir="ltr" style={{ unicodeBidi: "isolate" }}><u>{PHONE}</u></a><br />
          {t("Our website")}: <a href={WEBSITE} target="_blank" rel="noreferrer"><u>www.sfmtravels.co.in</u></a></p>
        <p><a className="btn wa" href={wa} target="_blank" rel="noreferrer">{t("WhatsApp")}</a>{" "}
          <a className="btn ghost" href={PHONE_TEL}>{t("Call us")}</a></p></div>
      <form onSubmit={submit}>
        <div><label htmlFor="n">{t("Full name")}</label><input id="n" name="name" required minLength={2} /></div>
        <div><label htmlFor="p">{t("Phone / WhatsApp")}</label><input id="p" name="phone" required minLength={5} /></div>
        <div className="full"><label htmlFor="e">{t("Email")}</label><input id="e" name="email" type="email" required /></div>
        <div className="full"><label htmlFor="pk">{t("Interested in")}</label>
          <select id="pk" name="pk" value={interest} onChange={(e) => setInterest(e.target.value)}>
            <option value="">{t("General enquiry")}</option>{names.map((n) => <option key={n} value={n}>{t(n)}</option>)}
          </select></div>
        <div><label htmlFor="d">{t("Travel date")}</label><input id="d" name="date" type="date" /></div>
        <div><label htmlFor="g">{t("Travellers")}</label><input id="g" name="guests" type="number" min="1" defaultValue="2" /></div>
        <div className="full"><label htmlFor="m">{t("What would you like to do?")}</label><textarea id="m" name="message" rows="3" /></div>
        <div className="full"><button className="btn" type="submit" disabled={state === "sending"}>{t(state === "sending" ? "Sending…" : "Send enquiry")}</button>{" "}
          {state === "ok" && <span role="status" style={{ color: "var(--teal)", fontWeight: 700 }}>{t("Thank you. We will contact you soon.")}</span>}
          {state === "err" && <span role="alert" style={{ color: "var(--coral)", fontWeight: 700 }}>{t("Something went wrong. Please try again.")}</span>}</div>
      </form>
    </div></section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer><div className="wrap">
      <div className="cols">
        <div><img className="flogo" src="/images/logo.jpg" alt="SFM Travels" /><h4>SFM Travels</h4>{t("Holiday packages and tours for Dubai and the UAE.")}</div>
        <div><h4>{t("Explore")}</h4><a href="#things">{t("Things to do")}</a><a href="#packages">{t("Packages")}</a><a href="#areas">{t("Where to go")}</a></div>
        <div><h4>{t("Services")}</h4><a href="#plan">{t("Hotels")}</a><a href="#plan">{t("Tours")}</a></div>
        <div><h4>{t("Contact")}</h4><a href={PHONE_TEL} dir="ltr" style={{ unicodeBidi: "isolate" }}>{PHONE}</a>
          <a href={WA} target="_blank" rel="noreferrer">{t("WhatsApp")}</a>
          <a href={WEBSITE} target="_blank" rel="noreferrer">www.sfmtravels.co.in</a></div>
      </div>
      <div className="copy">
        <div>{t("© 2026 SFM Travels. All rights reserved.")}</div>
        <div>{t(COMPANY)}{LICENSE && <> · {t("Trade licence no.")}: <span dir="ltr">{LICENSE}</span></>}</div>
      </div>
    </div></footer>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => {
    let s = null; try { s = localStorage.getItem("sfm-lang"); } catch {}
    return s || ((navigator.language || "").startsWith("ar") ? "ar" : "en");
  });
  const [f, setF] = useState({ cat: "All", nights: "Any nights" });
  const [interest, setInterest] = useState("");
  const [names, setNames] = useState([]);
  useEffect(() => { fetch("/api/packages").then((r) => r.json()).then((l) => setNames(l.map((p) => p.name))).catch(() => {}); }, []);
  useEffect(() => {
    document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = lang === "ar" ? "SFM Travels – باقات عطلات دبي" : "SFM Travels – Dubai Holiday Packages";
    try { localStorage.setItem("sfm-lang", lang); } catch {}
  }, [lang]);
  const t = (s) => (lang === "ar" && AR[s]) || s;
  return (
    <Ctx.Provider value={t}>
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero f={f} setF={setF} />
        <Things f={f} setF={setF} />
        <Packages f={f} setF={setF} pickPackage={setInterest} />
        <Areas />
        <Cards id="season" soft title="When to visit" sub="The best weather runs from November to March." items={SEASONS} />
        <Cards id="tips" title="Travel tips" sub="Practical advice before you fly." items={TIPS} />
        <Plan interest={interest} setInterest={setInterest} lang={lang} names={names} />
      </main>
      <Footer />
    </Ctx.Provider>
  );
}
