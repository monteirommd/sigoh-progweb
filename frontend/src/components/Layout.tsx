import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/layout.css";
import { ROTULO_PAPEL, ehAdmin } from "../utils/permissoes";
import { Relogio } from "./Relogio";

const LINKS_ADMIN = [
  { para: "/gestao/blocos", rotulo: "Estrutura" },
  { para: "/gestao/usuarios", rotulo: "Usuários" },
];

export function Layout() {
  const { sessao, sair } = useAuth();
  if (!sessao) return null;

  const links = sessao.role === "TECNICO"
    ? [{ para: "/tecnico", rotulo: "Leitos" }]
    : [{ para: "/painel", rotulo: "Painel" }, { para: "/mapa", rotulo: "Mapa de leitos" }, ...(ehAdmin(sessao.role) ? LINKS_ADMIN : [])];

  return (
    <>
      <a href="#conteudo" className="pular-link">Pular para o conteúdo</a>
      <header className="cabecalho">
        <div className="cabecalho-marca">
          <strong>SiGOH</strong>
          <span>Mapa de leitos</span>
        </div>
        <nav aria-label="Navegação principal">
          <ul className="cabecalho-menu">
            {links.map((link) => (
              <li key={link.para}>
                <NavLink to={link.para}>{link.rotulo}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="cabecalho-usuario">
          <Relogio />
          <span className="cabecalho-pessoa">
            {sessao.nome}
            <small>{ROTULO_PAPEL[sessao.role]}</small>
          </span>
          <button type="button" className="btn btn-secundario" onClick={sair}>
            <LogOut size={16} aria-hidden="true" /> Sair
          </button>
        </div>
      </header>
      <main id="conteudo" className="conteudo">
        <Outlet />
      </main>
    </>
  );
}
