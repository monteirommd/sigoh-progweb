import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DialogoConfirmacao } from "../components/DialogoConfirmacao";
import { DialogoFormulario } from "../components/DialogoFormulario";
import { Trilha } from "../components/Trilha";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { blocoService } from "../services/estrutura.service";
import "../styles/gestao.css";
import type { Bloco, BlocoRequest } from "../types/bloco";

const FORM_VAZIO: BlocoRequest = { nome: "", descricao: "" };

export default function GestaoBlocos() {
  const { dados: blocos, erro, carregando, recarregar } = useAtualizacaoPeriodica(blocoService.listar);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Bloco | null>(null);
  const [form, setForm] = useState<BlocoRequest>(FORM_VAZIO);
  const [excluindo, setExcluindo] = useState<Bloco | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const abrirNovo = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setFormAberto(true);
  };

  const abrirEdicao = (bloco: Bloco) => {
    setEditando(bloco);
    setForm({ nome: bloco.nome, descricao: bloco.descricao ?? "" });
    setFormAberto(true);
  };

  const salvar = async () => {
    if (editando) {
      await blocoService.atualizar(editando.id, form);
      setMensagem(`Bloco "${form.nome}" atualizado.`);
    } else {
      await blocoService.criar(form);
      setMensagem(`Bloco "${form.nome}" criado.`);
    }
    await recarregar();
  };

  const excluir = async () => {
    if (!excluindo) return;
    await blocoService.excluir(excluindo.id);
    setMensagem(`Bloco "${excluindo.nome}" excluído.`);
    await recarregar();
  };

  return (
    <>
      <Trilha itens={[{ rotulo: "Blocos" }]} />
      <div className="pagina-topo">
        <h1>Blocos</h1>
        <button type="button" className="btn" onClick={abrirNovo}>
          <Plus size={18} aria-hidden="true" /> Novo bloco
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

      {blocos && (
        <div className="tabela-container">
          <table className="tabela">
            <caption className="visualmente-oculto">Blocos cadastrados</caption>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Descrição</th>
                <th scope="col" className="coluna-acoes">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {blocos.length === 0 && (
                <tr>
                  <td colSpan={3} className="texto-suave">
                    Nenhum bloco cadastrado.
                  </td>
                </tr>
              )}
              {blocos.map((bloco) => (
                <tr key={bloco.id}>
                  <th scope="row">{bloco.nome}</th>
                  <td>{bloco.descricao ?? "—"}</td>
                  <td className="coluna-acoes">
                    <div className="acoes">
                      <Link to={`/gestao/blocos/${bloco.id}/enfermarias`} className="btn btn-secundario">
                        Enfermarias <ChevronRight size={16} aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-secundario btn-icone"
                        aria-label={`Editar ${bloco.nome}`}
                        title="Editar"
                        onClick={() => abrirEdicao(bloco)}
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secundario btn-icone"
                        aria-label={`Excluir ${bloco.nome}`}
                        title="Excluir"
                        onClick={() => setExcluindo(bloco)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DialogoFormulario
        aberto={formAberto}
        titulo={editando ? `Editar ${editando.nome}` : "Novo bloco"}
        onFechar={() => setFormAberto(false)}
        onSalvar={salvar}
      >
        <div className="campo">
          <label htmlFor="bloco-nome">Nome</label>
          <input
            id="bloco-nome"
            required
            maxLength={120}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="bloco-descricao">Descrição (opcional)</label>
          <input
            id="bloco-descricao"
            maxLength={255}
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>
      </DialogoFormulario>

      <DialogoConfirmacao
        aberto={excluindo !== null}
        titulo="Excluir bloco"
        mensagem={`Excluir o bloco "${excluindo?.nome}"? Esta ação não pode ser desfeita.`}
        onFechar={() => setExcluindo(null)}
        onConfirmar={excluir}
      />
    </>
  );
}
