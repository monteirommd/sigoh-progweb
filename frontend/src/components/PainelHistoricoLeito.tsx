import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { leitoService } from "../services/leito.service";
import type { Leito } from "../types/leito";
import { formatarDataHora } from "../utils/data";
import { ROTULO_STATUS, classeStatus } from "../utils/leito";

interface Props {
  leito: Leito;
  onFechar: () => void;
}

function TabelaHistorico({ leitoId }: { leitoId: number }) {
  const buscar = useCallback(() => leitoService.historico(leitoId), [leitoId]);
  const { dados: historico, erro, carregando } = useAtualizacaoPeriodica(buscar);

  if (erro)
    return (
      <p className="alerta alerta-erro" role="alert">
        {erro}
      </p>
    );
  if (carregando || !historico) return <p role="status">Carregando...</p>;
  if (historico.length === 0) return <p className="texto-suave">Nenhuma mudança de status registrada.</p>;

  return (
    <div className="tabela-container">
      <table className="tabela">
        <caption className="visualmente-oculto">Mudanças de status, da mais recente para a mais antiga</caption>
        <thead>
          <tr>
            <th scope="col">Quando</th>
            <th scope="col">De</th>
            <th scope="col">Para</th>
            <th scope="col">Por</th>
          </tr>
        </thead>
        <tbody>
          {historico.map((h) => (
            <tr key={h.id}>
              <td>{formatarDataHora(h.registradoEm)}</td>
              <td>{h.statusAnterior ? ROTULO_STATUS[h.statusAnterior] : "—"}</td>
              <td>
                <span className={`badge-status ${classeStatus(h.statusNovo)}`}>{ROTULO_STATUS[h.statusNovo]}</span>
              </td>
              <td>{h.usuarioNome ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PainelHistoricoLeito({ leito, onFechar }: Props) {
  const painelRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const painel = painelRef.current;
    if (painel && !painel.open) painel.showModal();
  }, []);

  return (
    <dialog ref={painelRef} className="dialogo dialogo-lateral" aria-labelledby="titulo-historico" onClose={onFechar}>
      <div className="dialogo-lateral-topo">
        <h2 id="titulo-historico">Histórico do leito {leito.codigo}</h2>
        <button type="button" className="btn btn-secundario btn-icone" aria-label="Fechar histórico" onClick={() => painelRef.current?.close()}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="texto-suave">
        {leito.blocoNome} · {leito.enfermariaNome}
      </p>
      <TabelaHistorico leitoId={leito.id} />
    </dialog>
  );
}
