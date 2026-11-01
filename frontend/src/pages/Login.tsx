import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { mensagemDeErro } from "../services/api";
import "../styles/login.css";
import { rotaInicial } from "../utils/permissoes";

export default function Login() {
  const { sessao, entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (sessao) return <Navigate to={rotaInicial(sessao.role)} replace />;

  const handleSubmit = async (evento: FormEvent) => {
    evento.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const nova = await entrar(email, senha);
      navigate(rotaInicial(nova.role), { replace: true });
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="login">
      <div className="login-marca">
        <p className="login-titulo">SiGOH</p>
        <p className="login-subtitulo">Gestão da ocupação de leitos hospitalares em tempo real</p>
      </div>
      <div className="login-area">
        <section className="login-card card" aria-labelledby="titulo-login">
          <h1 id="titulo-login">Entrar</h1>
          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <div className="campo-senha">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secundario btn-icone"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  onClick={() => setMostrarSenha((atual) => !atual)}
                >
                  {mostrarSenha ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </div>
            {erro && (
              <p className="alerta alerta-erro" role="alert">
                {erro}
              </p>
            )}
            <button type="submit" className="btn" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
