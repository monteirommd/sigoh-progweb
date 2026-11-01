import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DialogoConfirmacao } from "../components/DialogoConfirmacao";
import { DialogoFormulario } from "../components/DialogoFormulario";
import { Trilha } from "../components/Trilha";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { useAuth } from "../hooks/useAuth";
import { usuarioService } from "../services/usuario.service";
import "../styles/gestao.css";
import type { Role, Usuario } from "../types/usuario";
import { formatarDataHora } from "../utils/data";
import { ROTULO_PAPEL } from "../utils/permissoes";

const PAPEIS = Object.keys(ROTULO_PAPEL) as Role[];
interface FormUsuario {
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

const FORM_VAZIO: FormUsuario = { nome: "", email: "", senha: "", role: "TECNICO" };

export default function GestaoUsuarios() {
  const { sessao } = useAuth();
  const { dados: usuarios, erro, carregando, recarregar } = useAtualizacaoPeriodica(usuarioService.listar);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<FormUsuario>(FORM_VAZIO);
  const [excluindo, setExcluindo] = useState<Usuario | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const abrirNovo = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setFormAberto(true);
  };

  const abrirEdicao = (usuario: Usuario) => {
    setEditando(usuario);
    setForm({ nome: usuario.nome, email: usuario.email, senha: "", role: usuario.role });
    setFormAberto(true);
  };

  const salvar = async () => {
    const dados = { ...form, senha: form.senha === "" ? null : form.senha };
    if (editando) {
      await usuarioService.atualizar(editando.id, dados);
      setMensagem(`Usuário "${form.nome}" atualizado.`);
    } else {
      await usuarioService.criar(dados);
      setMensagem(`Usuário "${form.nome}" criado.`);
    }
    await recarregar();
  };

  const excluir = async () => {
    if (!excluindo) return;
    await usuarioService.excluir(excluindo.id);
    setMensagem(`Usuário "${excluindo.nome}" excluído.`);
    await recarregar();
  };

  return (
    <>
      <Trilha itens={[{ rotulo: "Usuários" }]} />
      <div className="pagina-topo">
        <h1>Usuários</h1>
        <button type="button" className="btn" onClick={abrirNovo}>
          <Plus size={18} aria-hidden="true" /> Novo usuário
        </button>
      </div>

      <p role="status" className={mensagem ? "alerta alerta-sucesso" : "visualmente-oculto"}>
        {mensagem}
      </p>
      {erro && (
        <p className="alerta alerta-erro" role="alert">
          {erro}
        </p>
      )}
      {carregando && <p>Carregando...</p>}

      {usuarios && (
        <div className="tabela-container">
          <table className="tabela">
            <caption className="visualmente-oculto">Usuários cadastrados</caption>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">E-mail</th>
                <th scope="col">Papel</th>
                <th scope="col">Criado em</th>
                <th scope="col" className="coluna-acoes">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                const ehVoce = usuario.id === sessao?.usuarioId;
                return (
                  <tr key={usuario.id}>
                    <th scope="row">
                      {usuario.nome}
                      {ehVoce && <span className="texto-suave"> (você)</span>}
                    </th>
                    <td>{usuario.email}</td>
                    <td>
                      <span className="badge-papel">{ROTULO_PAPEL[usuario.role]}</span>
                    </td>
                    <td>{formatarDataHora(usuario.criadoEm)}</td>
                    <td className="coluna-acoes">
                      <div className="acoes">
                        <button
                          type="button"
                          className="btn btn-secundario btn-icone"
                          aria-label={`Editar ${usuario.nome}`}
                          title="Editar"
                          onClick={() => abrirEdicao(usuario)}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        {!ehVoce && (
                          <button
                            type="button"
                            className="btn btn-secundario btn-icone"
                            aria-label={`Excluir ${usuario.nome}`}
                            title="Excluir"
                            onClick={() => setExcluindo(usuario)}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DialogoFormulario
        aberto={formAberto}
        titulo={editando ? `Editar ${editando.nome}` : "Novo usuário"}
        onFechar={() => setFormAberto(false)}
        onSalvar={salvar}
      >
        <div className="campo">
          <label htmlFor="usuario-nome">Nome</label>
          <input
            id="usuario-nome"
            required
            maxLength={120}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="usuario-email">E-mail</label>
          <input
            id="usuario-email"
            type="email"
            required
            maxLength={160}
            autoComplete="off"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="usuario-senha">{editando ? "Nova senha (opcional)" : "Senha"}</label>
          <input
            id="usuario-senha"
            type="password"
            required={!editando}
            minLength={6}
            maxLength={72}
            autoComplete="new-password"
            aria-describedby="usuario-senha-dica"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
          />
          <small id="usuario-senha-dica" className="texto-suave">
            {editando ? "Deixe em branco para manter a senha atual." : "Mínimo de 6 caracteres."}
          </small>
        </div>
        <div className="campo">
          <label htmlFor="usuario-papel">Papel</label>
          <select
            id="usuario-papel"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
          >
            {PAPEIS.map((papel) => (
              <option key={papel} value={papel}>
                {ROTULO_PAPEL[papel]}
              </option>
            ))}
          </select>
        </div>
      </DialogoFormulario>

      <DialogoConfirmacao
        aberto={excluindo !== null}
        titulo="Excluir usuário"
        mensagem={`Excluir o usuário "${excluindo?.nome}"? Ele não conseguirá mais entrar no sistema.`}
        onFechar={() => setExcluindo(null)}
        onConfirmar={excluir}
      />
    </>
  );
}
