import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowLeft, Check, ExternalLink, LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { supabase, supabaseConfigured } from "./lib/supabase";
import "./admin.css";

type Project = { id: string; title: string; eyebrow: string; description: string; stack: string; href: string; tone: "blue" | "black" | "white"; sort_order: number; is_published: boolean };
type Profile = { id: string; full_name: string; role: string; bio: string; contact_email: string; phone: string; address: string; cnpj: string; github_url: string; linkedin_url: string; instagram_url: string };

const emptyProject: Omit<Project, "id"> = { title: "", eyebrow: "", description: "", stack: "", href: "", tone: "blue", sort_order: 10, is_published: true };
const emptyProfile: Profile = { id: "main", full_name: "Eliseu Rodrigues Guimarães Costa", role: "Engenheiro de software", bio: "", contact_email: "eliseu.guimaraes@rizzonet.com.br", phone: "", address: "", cnpj: "", github_url: "https://github.com/enpiricos", linkedin_url: "", instagram_url: "" };

function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState<"projects" | "profile">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) await verifyAdmin(data.session.user.id);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); if (!next) setAuthorized(false); });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (authorized) loadData(); }, [authorized]);

  async function verifyAdmin(userId: string) {
    if (!supabase) return false;
    const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    setAuthorized(Boolean(data));
    if (!data) setError("Este usuário ainda não foi autorizado como administrador.");
    return Boolean(data);
  }

  async function login(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!supabase) return;
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(readableAuthError(authError)); return; }
    if (data.session) await verifyAdmin(data.session.user.id);
  }

  function readableAuthError(authError: { code?: string; message?: string }) {
    if (authError.code === "invalid_credentials" || authError.message?.toLowerCase().includes("invalid login credentials")) {
      return "E-mail ou senha incorretos. Confirme também se este usuário foi criado no mesmo projeto Supabase configurado na Vercel.";
    }
    if (authError.message?.toLowerCase().includes("email not confirmed")) return "Confirme seu e-mail no Supabase antes de entrar.";
    if (authError.message?.toLowerCase().includes("rate limit")) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    return "Não foi possível entrar agora. Verifique os dados e tente novamente.";
  }

  async function loadData() {
    if (!supabase) return;
    const [projectResult, profileResult] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_profile").select("*").eq("id", "main").maybeSingle(),
    ]);
    if (projectResult.data) setProjects(projectResult.data as Project[]);
    if (profileResult.data) setProfile(profileResult.data as Profile);
  }

  async function saveProject(event: React.FormEvent) {
    event.preventDefault(); if (!supabase) return;
    setError(""); setMessage("");
    const result = editing ? await supabase.from("projects").update(form).eq("id", editing).select().single() : await supabase.from("projects").insert(form).select().single();
    if (result.error) { setError(result.error.message); return; }
    setMessage("Projeto salvo com sucesso."); setForm(emptyProject); setEditing(null); await loadData();
  }

  async function removeProject(id: string) {
    if (!supabase || !window.confirm("Excluir este projeto?")) return;
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);
    if (deleteError) setError(deleteError.message); else { setMessage("Projeto excluído."); await loadData(); }
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault(); if (!supabase) return;
    const { error: saveError } = await supabase.from("site_profile").upsert(profile);
    if (saveError) setError(saveError.message); else setMessage("Informações institucionais salvas.");
  }

  if (checking) return <div className="admin-loading">Carregando área administrativa…</div>;
  if (!supabaseConfigured) return <SetupMessage />;
  if (!session || !authorized) return <Login email={email} password={password} setEmail={setEmail} setPassword={setPassword} onSubmit={login} error={error} />;

  return <div className="admin-shell"><aside className="admin-sidebar"><a className="admin-logo" href="/"><img src="/brand/enpiricos-logo-branca.svg" alt="enpiricos" /></a><div className="admin-nav"><button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>Projetos</button><button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Dados da empresa</button></div><div className="admin-sidebar-bottom"><a href="/"><ArrowLeft size={15} /> Ver site</a><button onClick={() => supabase?.auth.signOut()}><LogOut size={15} /> Sair</button></div></aside><main className="admin-main"><header className="admin-header"><div><p className="admin-kicker">/ painel administrativo</p><h1>{tab === "projects" ? "Projetos" : "Dados da empresa"}</h1></div><span className="admin-user">{session.user.email}</span></header>{error && <div className="admin-alert error">{error}</div>}{message && <div className="admin-alert success"><Check size={16} /> {message}</div>}{tab === "projects" ? <ProjectsView projects={projects} form={form} setForm={setForm} editing={editing} setEditing={setEditing} saveProject={saveProject} removeProject={removeProject} /> : <ProfileView profile={profile} setProfile={setProfile} saveProfile={saveProfile} />}</main></div>;
}

function Login(props: { email: string; password: string; setEmail: (v: string) => void; setPassword: (v: string) => void; onSubmit: (e: React.FormEvent) => void; error: string }) {
  return <div className="login-page"><div className="login-card"><img src="/brand/enpiricos-logo.svg" alt="enpiricos" /><p className="admin-kicker">/ área restrita</p><h1>Bem-vindo de volta.</h1><p className="login-copy">Entre para gerenciar os projetos e as informações da Enpiricos.</p><form className="admin-form login-form" onSubmit={props.onSubmit}><label>E-mail<input type="email" value={props.email} onChange={(e) => props.setEmail(e.target.value)} required /></label><label>Senha<input type="password" value={props.password} onChange={(e) => props.setPassword(e.target.value)} required /></label>{props.error && <p className="form-error">{props.error}</p>}<button className="admin-primary" type="submit">Entrar</button></form><a className="back-site" href="/">← Voltar ao site</a></div></div>;
}

function SetupMessage() { return <div className="setup-page"><img src="/brand/enpiricos-logo.svg" alt="enpiricos" /><h1>Administração ainda não configurada</h1><p>Adicione <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> nas variáveis de ambiente da Vercel e execute o schema SQL incluído no projeto.</p><a href="/">Voltar ao site</a></div>; }

function ProjectsView({ projects, form, setForm, editing, setEditing, saveProject, removeProject }: { projects: Project[]; form: Omit<Project, "id">; setForm: (value: Omit<Project, "id">) => void; editing: string | null; setEditing: (value: string | null) => void; saveProject: (event: React.FormEvent) => void; removeProject: (id: string) => void }) {
  const change = (key: keyof typeof form, value: string | number | boolean) => setForm({ ...form, [key]: value });
  return <div className="admin-grid"><section className="admin-panel"><div className="panel-heading"><div><p className="admin-kicker">{editing ? "editar projeto" : "novo projeto"}</p><h2>{editing ? "Atualizar projeto" : "Adicionar projeto"}</h2></div>{editing && <button className="panel-link" onClick={() => { setEditing(null); setForm(emptyProject); }}>Cancelar</button>}</div><form className="admin-form" onSubmit={saveProject}><div className="form-row"><label>Título<input value={form.title} onChange={(e) => change("title", e.target.value)} required /></label><label>Categoria<input value={form.eyebrow} onChange={(e) => change("eyebrow", e.target.value)} required /></label></div><label>Descrição<textarea value={form.description} onChange={(e) => change("description", e.target.value)} rows={3} required /></label><div className="form-row"><label>Stack<input value={form.stack} onChange={(e) => change("stack", e.target.value)} /></label><label>Link<input type="url" value={form.href} onChange={(e) => change("href", e.target.value)} required /></label></div><div className="form-row"><label>Cor<select value={form.tone} onChange={(e) => change("tone", e.target.value)}><option value="blue">Azul</option><option value="black">Preto</option><option value="white">Branco</option></select></label><label>Ordem<input type="number" value={form.sort_order} onChange={(e) => change("sort_order", Number(e.target.value))} /></label></div><label className="check-label"><input type="checkbox" checked={form.is_published} onChange={(e) => change("is_published", e.target.checked)} /> Publicar no site</label><button className="admin-primary" type="submit"><Save size={16} /> Salvar projeto</button></form></section><section className="admin-panel"><div className="panel-heading"><div><p className="admin-kicker">{projects.length} cadastrados</p><h2>Seus projetos</h2></div><button className="icon-button" onClick={() => { setEditing(null); setForm(emptyProject); }}><Plus size={18} /></button></div><div className="project-admin-list">{projects.length === 0 ? <p className="empty-state">Nenhum projeto cadastrado ainda.</p> : projects.map((project) => <div className="project-admin-item" key={project.id}><div><strong>{project.title}</strong><span>{project.eyebrow} · {project.is_published ? "Publicado" : "Rascunho"}</span></div><div className="item-actions"><a href={project.href} target="_blank" rel="noreferrer" aria-label="Abrir projeto"><ExternalLink size={16} /></a><button onClick={() => { setEditing(project.id); setForm({ title: project.title, eyebrow: project.eyebrow, description: project.description, stack: project.stack, href: project.href, tone: project.tone, sort_order: project.sort_order, is_published: project.is_published }); }} aria-label="Editar"><Pencil size={16} /></button><button onClick={() => removeProject(project.id)} aria-label="Excluir"><Trash2 size={16} /></button></div></div>)}</div></section></div>;
}

function ProfileView({ profile, setProfile, saveProfile }: { profile: Profile; setProfile: (value: Profile) => void; saveProfile: (event: React.FormEvent) => void }) {
  const change = (key: keyof Profile, value: string) => setProfile({ ...profile, [key]: value });
  return <section className="admin-panel profile-panel"><div className="panel-heading"><div><p className="admin-kicker">informações públicas</p><h2>Dados da empresa</h2></div></div><p className="panel-description">Essas informações podem ser exibidas no site, na página de contato e nos materiais institucionais.</p><form className="admin-form" onSubmit={saveProfile}><div className="form-row"><label>Nome ou razão social<input value={profile.full_name} onChange={(e) => change("full_name", e.target.value)} /></label><label>Atuação<input value={profile.role} onChange={(e) => change("role", e.target.value)} /></label></div><label>Bio<textarea value={profile.bio} onChange={(e) => change("bio", e.target.value)} rows={4} /></label><div className="form-row"><label>E-mail de contato<input type="email" value={profile.contact_email} onChange={(e) => change("contact_email", e.target.value)} /></label><label>Telefone<input value={profile.phone} onChange={(e) => change("phone", e.target.value)} /></label></div><div className="form-row"><label>Endereço<input value={profile.address} onChange={(e) => change("address", e.target.value)} /></label><label>CNPJ<input value={profile.cnpj} onChange={(e) => change("cnpj", e.target.value)} /></label></div><div className="admin-subheading">Redes sociais</div><div className="form-row"><label>GitHub<input type="url" value={profile.github_url} onChange={(e) => change("github_url", e.target.value)} /></label><label>LinkedIn<input type="url" value={profile.linkedin_url} onChange={(e) => change("linkedin_url", e.target.value)} /></label></div><label>Instagram<input type="url" value={profile.instagram_url} onChange={(e) => change("instagram_url", e.target.value)} /></label><button className="admin-primary" type="submit"><Save size={16} /> Salvar informações</button></form></section>;
}

export default AdminApp;
