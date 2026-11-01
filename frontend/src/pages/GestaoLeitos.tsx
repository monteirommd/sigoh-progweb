import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DialogoConfirmacao } from "../components/DialogoConfirmacao";
import { DialogoFormulario } from "../components/DialogoFormulario";
import { Trilha } from "../components/Trilha";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { enfermariaService } from "../services/estrutura.service";
import { leitoService } from "../services/leito.service";
import "../styles/gestao.css";
import type { Enfermaria } from "../types/enfermaria";
import type { Leito } from "../types/leito";
import { ROTULO_STATUS, classeStatus } from "../utils/leito";

export default function GestaoLeitos() {
  const params = useParams();
  const blocoId = Number(params.blocoId);
  const enfermariaId = Number(params.enfermariaId);
  const [enfermaria, setEnfermaria] = useState<Enfermaria | null>(null);
  const listar = useCallback(() => leitoService.listar({ enfermariaId }), [enfermariaId]);
  const { dados: leitos, erro, carregando, recarregar } = useAtualizacaoPeriodica(listar);
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Leito | null>(null);
  const [codigo, setCodigo] = useState("");
  const [excluindo, setExcluindo] = useState<Leito | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    enfermariaService.buscar(enfermariaId).then(setEnfermaria).catch(() => setEnfermaria(null));
  }, [enfermariaId]);

  const abrirNovo = () => {
    setEditando(null);
    setCodigo("");
    setFormAberto(true);
  };

  const abrirEdicao = (leito: Leito) => {
    setEditando(leito);
    setCodigo(leito.codigo);
    setFormAberto(true);
  };

  const salvar = async () => {
    const dados = { codigo, enfermariaId };
    if (editando) {
      await leitoService.atualizar(editando.id, dados);
      setMensagem(`Leito ${codigo} atualizado.`);
    } else {
      await leitoService.criar(dados);
      setMensagem(`Leito ${codigo} criado.`);
    }
    await recarregar();
  };

  const excluir = async () => {
    if (!excluindo) return;
    await leitoService.excluir(excluindo.id);
    setMensagem(`Leito ${excluindo.codigo} excluído.`);
    await recarregar();
  };

  const nomeBloco = enfermaria?.blocoNome ?? "...";
  const nomeEnfermaria = enfermaria?.nome ?? "...";

  return (
    <>
      <Trilha
        itens={[
          { rotulo: "Blocos", para: "/gestao/blocos" },
          { rotulo: nomeBloco, para: `/gestao/blocos/${blocoId}/enfermarias` },
          { rotulo: nomeEnfermaria },
        ]}
      />
      <div className="pagina-topo">
        <h1>Leitos · {nomeEnfermaria}</h1>
        <button type="button" className="btn" onClick={abrirNovo}>
          <Plus size={18} aria-hidden="true" /> Novo leito
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

      {leitos && (
        <div className="tabela-container">
          <table className="tabela">
            <caption className="visualmente-oculto">Leitos da enfermaria {nomeEnfermaria}</caption>
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Status</th>
                <th scope="col" className="coluna-acoes">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {leitos.length === 0 && (
                <tr>
                  <td colSpan={3} className="texto-suave">
                    Nenhum leito cadastrado nesta enfermaria.
                  </td>
                </tr>
              )}
              {leitos.map((leito) => (
                <tr key={leito.id}>
                  <th scope="row">{leito.codigo}</th>
                  <td>
                    <span className={`badge-status ${classeStatus(leito.status)}`}>{ROTULO_STATUS[leito.status]}</span>
                  </td>
                  <td className="coluna-acoes">
                    <div className="acoes">
                      <button
                        type="button"
                        className="btn btn-secundario btn-icone"
                        aria-label={`Editar leito ${leito.codigo}`}
                        title="Editar"
                        onClick={() => abrirEdicao(leito)}
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secundario btn-icone"
                        aria-label={`Excluir leito ${leito.codigo}`}
                        title="Excluir"
                        onClick={() => setExcluindo(leito)}
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
        titulo={editando ? `Editar leito ${editando.codigo}` : `Novo leito em ${nomeEnfermaria}`}
        onFechar={() => setFormAberto(false)}
        onSalvar={salvar}
      >
        <div className="campo">
          <label htmlFor="leito-codigo">Código</label>
          <input id="leito-codigo" required maxLength={20} value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        </div>
      </DialogoFormulario>

      <DialogoConfirmacao
        aberto={excluindo !== null}
        titulo="Excluir leito"
        mensagem={
          excluindo?.status === "OCUPADO"
            ? `O leito ${excluindo.codigo} está OCUPADO. Excluir mesmo assim? Ele sairá do mapa, mas o histórico é mantido.`
            : `Excluir o leito ${excluindo?.codigo}? Ele sairá do mapa, mas o histórico é mantido.`
        }
        onFechar={() => setExcluindo(null)}
        onConfirmar={excluir}
      />
    </>
  );
}
