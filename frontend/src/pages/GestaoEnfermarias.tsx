import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DialogoConfirmacao } from "../components/DialogoConfirmacao";
import { DialogoFormulario } from "../components/DialogoFormulario";
import { Trilha } from "../components/Trilha";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { blocoService, enfermariaService } from "../services/estrutura.service";
import "../styles/gestao.css";
import type { Bloco } from "../types/bloco";
import type { Enfermaria } from "../types/enfermaria";

interface FormEnfermaria {
  nome: string;
  descricao: string;
}

const FORM_VAZIO: FormEnfermaria = { nome: "", descricao: "" };

export default function GestaoEnfermarias() {
  const blocoId = Number(useParams().blocoId);
  const [bloco, setBloco] = useState<Bloco | null>(null);
  const listar = useCallback(() => enfermariaService.listar(blocoId), [blocoId]);
  const { dados: enfermarias, erro, carregando, recarregar } = useAtualizacaoPeriodica(listar);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Enfermaria | null>(null);
  const [form, setForm] = useState<FormEnfermaria>(FORM_VAZIO);
  const [excluindo, setExcluindo] = useState<Enfermaria | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    blocoService.buscar(blocoId).then(setBloco).catch(() => setBloco(null));
  }, [blocoId]);

  const abrirNovo = () => {
    setEditando(null);
    setForm(FORM_VAZIO);
    setFormAberto(true);
  };

  const abrirEdicao = (enfermaria: Enfermaria) => {
    setEditando(enfermaria);
    setForm({ nome: enfermaria.nome, descricao: enfermaria.descricao ?? "" });
    setFormAberto(true);
  };

  const salvar = async () => {
    const dados = { ...form, blocoId };
    if (editando) {
      await enfermariaService.atualizar(editando.id, dados);
      setMensagem(`Enfermaria "${form.nome}" atualizada.`);
    } else {
      await enfermariaService.criar(dados);
      setMensagem(`Enfermaria "${form.nome}" criada.`);
    }
    await recarregar();
  };

  const excluir = async () => {
    if (!excluindo) return;
    await enfermariaService.excluir(excluindo.id);
    setMensagem(`Enfermaria "${excluindo.nome}" excluída.`);
    await recarregar();
  };

  const nomeBloco = bloco?.nome ?? "...";

  return (
    <>
      <Trilha itens={[{ rotulo: "Blocos", para: "/gestao/blocos" }, { rotulo: nomeBloco }]} />
      <div className="pagina-topo">
        <h1>Enfermarias · {nomeBloco}</h1>
        <button type="button" className="btn" onClick={abrirNovo}>
          <Plus size={18} aria-hidden="true" /> Nova enfermaria
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

      {enfermarias && (
        <div className="tabela-container">
          <table className="tabela">
            <caption className="visualmente-oculto">Enfermarias do {nomeBloco}</caption>
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
              {enfermarias.length === 0 && (
                <tr>
                  <td colSpan={3} className="texto-suave">
                    Nenhuma enfermaria cadastrada neste bloco.
                  </td>
                </tr>
              )}
              {enfermarias.map((enfermaria) => (
                <tr key={enfermaria.id}>
                  <th scope="row">{enfermaria.nome}</th>
                  <td>{enfermaria.descricao ?? "—"}</td>
                  <td className="coluna-acoes">
                    <div className="acoes">
                      <Link
                        to={`/gestao/blocos/${blocoId}/enfermarias/${enfermaria.id}/leitos`}
                        className="btn btn-secundario"
                      >
                        Leitos <ChevronRight size={16} aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-secundario btn-icone"
                        aria-label={`Editar ${enfermaria.nome}`}
                        title="Editar"
                        onClick={() => abrirEdicao(enfermaria)}
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secundario btn-icone"
                        aria-label={`Excluir ${enfermaria.nome}`}
                        title="Excluir"
                        onClick={() => setExcluindo(enfermaria)}
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
        titulo={editando ? `Editar ${editando.nome}` : `Nova enfermaria no ${nomeBloco}`}
        onFechar={() => setFormAberto(false)}
        onSalvar={salvar}
      >
        <div className="campo">
          <label htmlFor="enfermaria-nome">Nome</label>
          <input
            id="enfermaria-nome"
            required
            maxLength={120}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>
        <div className="campo">
          <label htmlFor="enfermaria-descricao">Descrição (opcional)</label>
          <input
            id="enfermaria-descricao"
            maxLength={255}
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>
      </DialogoFormulario>

      <DialogoConfirmacao
        aberto={excluindo !== null}
        titulo="Excluir enfermaria"
        mensagem={`Excluir a enfermaria "${excluindo?.nome}"? Esta ação não pode ser desfeita.`}
        onFechar={() => setExcluindo(null)}
        onConfirmar={excluir}
      />
    </>
  );
}
