import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Mail,
  Menu,
  X,
} from "lucide-react";
import "./styles.css";

const projects = [
  {
    number: "01",
    title: "ItaZoo",
    type: "Patrimônio & ciência",
    description:
      "Portal científico e repositório paleontológico 3D da Bacia de São José de Itaboraí.",
    stack: "React · TanStack Start · Three.js",
    href: "https://itazoo.enpiricos.com.br",
    accent: "coral",
  },
  {
    number: "02",
    title: "Monetos",
    type: "Finanças pessoais",
    description:
      "Plataforma para transformar dados financeiros em decisões mais claras e melhores hábitos.",
    stack: "React · TypeScript · Supabase",
    href: "https://monetos.enpiricos.com.br",
    accent: "lime",
  },
  {
    number: "03",
    title: "Soluções sob medida",
    type: "Consultoria & produto",
    description:
      "Sistemas digitais pensados para simplificar operações, conectar pessoas e gerar resultado.",
    stack: "Arquitetura · APIs · Cloud",
    href: "mailto:eliseu.guimaraes@rizzonet.com.br?subject=Vamos conversar",
    accent: "blue",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Voltar ao início">
          <span className="brand-mark">e.</span>
          <span>enpiricos</span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          <a className="nav-cta" href="mailto:eliseu.guimaraes@rizzonet.com.br">Vamos conversar <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Engenheiro de software · Rio de Janeiro</p>
            <h1>Eu transformo<br /><em>complexidade</em><br />em produto.</h1>
            <p className="hero-text">Construo experiências digitais sólidas, humanas e bonitas para negócios que querem sair do lugar.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#projetos">Ver projetos <ArrowUpRight size={17} /></a>
              <a className="text-link" href="#sobre">Conheça meu trabalho <span>↓</span></a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="art-core">e<span>×</span></div>
            <p>ideia<br />→ impacto</p>
          </div>
        </section>

        <section className="ticker"><span>software com propósito</span><span>✳</span><span>interfaces que aproximam</span><span>✳</span><span>tecnologia que resolve</span></section>

        <section id="sobre" className="about section-grid">
          <div className="section-label">/ sobre mim</div>
          <div className="about-content">
            <h2>Olá, eu sou Eliseu.<br /><span>Gosto de construir coisas.</span></h2>
            <div className="about-columns">
              <p>Sou engenheiro de software e trabalho na interseção entre tecnologia, produto e pessoas. Meu foco é entender o problema antes de escrever a primeira linha de código.</p>
              <p>Do protótipo ao deploy, crio sistemas que fazem sentido para quem usa e para quem mantém. Cada projeto aqui é uma história de colaboração.</p>
            </div>
            <div className="capabilities"><span><Check size={15} /> Produto digital</span><span><Check size={15} /> Arquitetura de software</span><span><Check size={15} /> Experiências web</span></div>
          </div>
        </section>

        <section id="projetos" className="projects section-grid">
          <div className="section-label">/ projetos selecionados</div>
          <div className="project-list">
            {projects.map((project) => (
              <a className={`project-card ${project.accent}`} href={project.href} key={project.number} target={project.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <div className="project-meta"><span>{project.number}</span><span>{project.type}</span></div>
                <div className="project-main"><h3>{project.title}</h3><ArrowUpRight className="project-arrow" size={26} /></div>
                <p>{project.description}</p><span className="project-stack">{project.stack}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="contato" className="contact section-grid">
          <div className="section-label">/ vamos trabalhar juntos</div>
          <div className="contact-content"><h2>Tem uma ideia?<br /><em>Vamos tirar do papel.</em></h2><a className="contact-email" href="mailto:eliseu.guimaraes@rizzonet.com.br">eliseu.guimaraes@rizzonet.com.br <ArrowUpRight size={22} /></a></div>
        </section>
      </main>

      <footer className="footer"><span>© 2026 enpiricos</span><span>Feito com curiosidade e código.</span><div className="socials"><a href="https://github.com/enpiricos" aria-label="GitHub"><Code2 size={18} /></a><a href="https://www.linkedin.com" aria-label="LinkedIn"><BriefcaseBusiness size={18} /></a><a href="mailto:eliseu.guimaraes@rizzonet.com.br" aria-label="E-mail"><Mail size={18} /></a></div></footer>
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")!).render(<App />);
