import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Mail,
  Menu,
  X,
} from "lucide-react";
import "./styles.css";
import AdminApp from "./admin";
import { supabase } from "./lib/supabase";

const projects = [
  { number: "01", title: "ItaZoo", eyebrow: "Patrimônio & ciência", description: "Portal científico e repositório paleontológico 3D da Bacia de São José de Itaboraí.", stack: "React · TanStack Start · Three.js", href: "https://itazoo.enpiricos.com.br", tone: "blue" },
  { number: "02", title: "Monetos", eyebrow: "Produto financeiro", description: "Uma experiência digital para transformar dados financeiros em decisões melhores.", stack: "React · TypeScript · Supabase", href: "https://monetos.enpiricos.com.br", tone: "black" },
  { number: "03", title: "Sob medida", eyebrow: "Consultoria & produto", description: "Sistemas digitais pensados para simplificar operações e gerar resultado.", stack: "Arquitetura · APIs · Cloud", href: "mailto:eliseu.guimaraes@rizzonet.com.br?subject=Vamos conversar", tone: "white" },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("projects").select("title, eyebrow, description, stack, href, tone, sort_order").eq("is_published", true).order("sort_order", { ascending: true }).then(({ data }) => {
      if (data?.length) setVisibleProjects(data.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })) as typeof projects);
    });
  }, []);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Enpiricos — início"><img src="/brand/enpiricos-logo.svg" alt="enpiricos" /></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#sobre" onClick={closeMenu}>Sobre</a><a href="#projetos" onClick={closeMenu}>Projetos</a><a href="#processo" onClick={closeMenu}>Processo</a>
          <a className="nav-cta" href="#contato" onClick={closeMenu}>Vamos conversar <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow"><span className="pulse" /> Engenheiro de software · Rio de Janeiro</p><h1>Ideias fortes<br /><span>merecem</span><br />tecnologia.</h1><p className="hero-lede">Eu construo produtos digitais que conectam estratégia, engenharia e pessoas.</p><div className="hero-actions"><a className="button button-blue" href="#projetos">Conheça meus projetos <ArrowUpRight size={17} /></a><a className="quiet-link" href="#sobre">Sobre mim <ArrowDownRight size={17} /></a></div></div>
          <div className="hero-panel" aria-label="Enpiricos — tecnologia com propósito"><img src="/brand/enpiricos-logo-branca.svg" alt="enpiricos" className="hero-logo" /><div className="panel-grid" /><div className="panel-symbol"><img src="/brand/enpiricos-simbolo.svg" alt="" /></div><div className="panel-caption"><span>01</span><span>ideia → impacto</span></div></div>
        </section>

        <div className="brand-line"><span>enpiricos</span><span className="line" /><span>software com propósito</span><span className="brand-dot">✳</span><span>tecnologia que resolve</span></div>

        <section id="sobre" className="about page-section"><div className="section-kicker">/ 01 — sobre</div><div className="about-content"><h2>Engenharia com<br /><span>visão de produto.</span></h2><div className="about-body"><p>Sou Eliseu, engenheiro de software. Trabalho na interseção entre tecnologia, produto e pessoas para transformar problemas complexos em experiências simples.</p><p>Do primeiro esboço ao deploy, penso em sistemas que fazem sentido para quem usa e para quem mantém. Código é ferramenta; impacto é o objetivo.</p></div><div className="skill-list"><span><Check size={15} /> Produto digital</span><span><Check size={15} /> Arquitetura</span><span><Check size={15} /> Experiências web</span></div></div></section>

        <section id="projetos" className="projects page-section"><div className="section-kicker">/ 02 — projetos</div><div className="projects-content"><div className="section-intro"><h2>Feito para<br /><span>funcionar.</span></h2><p>Alguns projetos que mostram como penso, construo e entrego.</p></div><div className="project-list">{visibleProjects.map((project) => <a className={`project-card ${project.tone}`} href={project.href} key={project.number} target={project.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><div className="project-top"><span>{project.number}</span><span>{project.eyebrow}</span></div><div className="project-title"><h3>{project.title}</h3><ArrowUpRight size={26} /></div><p>{project.description}</p><span className="project-stack">{project.stack}</span></a>)}</div></div></section>

        <section id="processo" className="process page-section"><div className="section-kicker">/ 03 — processo</div><div className="process-content"><h2>Clareza antes<br /><span>do código.</span></h2><div className="process-steps"><div><b>01</b><h3>Entender</h3><p>O problema, o contexto e as pessoas envolvidas.</p></div><div><b>02</b><h3>Construir</h3><p>Uma solução sólida, bonita e possível de evoluir.</p></div><div><b>03</b><h3>Entregar</h3><p>Produto no mundo, aprendendo com quem usa.</p></div></div></div></section>

        <section id="contato" className="contact page-section"><div className="section-kicker">/ 04 — contato</div><div className="contact-content"><img src="/brand/enpiricos-logo-branca.svg" alt="enpiricos" className="contact-logo" /><h2>Tem uma ideia?<br /><span>Vamos tirar do papel.</span></h2><a className="contact-email" href="mailto:eliseu.guimaraes@rizzonet.com.br">eliseu.guimaraes@rizzonet.com.br <ArrowUpRight size={21} /></a></div></section>
      </main>

      <footer className="footer"><span>© 2026 enpiricos</span><span>Feito com curiosidade e código.</span><div className="socials"><a href="https://github.com/enpiricos" aria-label="GitHub"><Code2 size={18} /></a><a href="https://www.linkedin.com" aria-label="LinkedIn"><BriefcaseBusiness size={18} /></a><a href="mailto:eliseu.guimaraes@rizzonet.com.br" aria-label="E-mail"><Mail size={18} /></a></div></footer>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
if (window.location.pathname === "/admin") root.render(<AdminApp />);
else root.render(<App />);
