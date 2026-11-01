import { History } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { leitoService } from "../services/leito.service";
import { mensagemDeErro } from "../services/api";
import type { Leito, StatusLeito } from "../types/leito";
import { ROTULO_STATUS, STATUS_LEITO, classeStatus } from "../utils/leito";
import { PainelHistoricoLeito } from "./PainelHistoricoLeito";

interface Props {
  leito: Leito | null;
  podeAlterar: boolean;
  onFechar: () => void;
  onAlterado: () => void;
}

export function DialogoStatusLeito({ leito, podeAlterar, onFechar, onAlterado }: Props) {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const [salvando, setSalvando] = useState<StatusLeito | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (leito && !dialogo.open) dialogo.showModal();
    if (!leito && dialogo.open) dialogo.close();
  }, [leito]);

  const fechar = () => {
    setErro(null);
    setHistoricoAberto(false);
    onFechar();
  };

  const alterar = async (status: StatusLeito) => {
    if (!leito) return;
    setSalvando(status);
    setErro(null);
    try {
      await leitoService.alterarStatus(leito.id, status);
      onAlterado();
      fechar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(null);
    }
  };

  return (
    <dialog ref={dialogoRef} className="dialogo" aria-labelledby="titulo-status" onClose={fechar}>
      {leito && (
        <>
          <h2 id="titulo-status">Leito {leito.codigo}</h2>
          <p className="texto-suave">
            {leito.blocoNome} · {leito.enfermariaNome} · atual: <strong>{ROTULO_STATUS[leito.status]}</strong>
          </p>

          {podeAlterar && (
            <>
              <p>Selecione o novo status:</p>
              <div className="opcoes-status">
                {STATUS_LEITO.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`opcao-status ${classeStatus(status)}`}
                    disabled={salvando !== null || status === leito.status}
                    onClick={() => alterar(status)}
                  >
                    {salvando === status ? "Salvando..." : ROTULO_STATUS[status]}
                    {status === leito.status && " (atual)"}
                  </button>
                ))}
              </div>
            </>
          )}

          {erro && (
            <p className="alerta alerta-erro" role="alert">
              {erro}
            </p>
          )}

          <div className="acoes dialogo-acoes">
            <button type="button" className="btn btn-secundario" onClick={() => setHistoricoAberto(true)}>
              <History size={18} aria-hidden="true" /> Ver histórico
            </button>
            <button type="button" className="btn btn-secundario" onClick={fechar} disabled={salvando !== null}>
              {podeAlterar ? "Cancelar" : "Fechar"}
            </button>
          </div>

          {historicoAberto && <PainelHistoricoLeito leito={leito} onFechar={() => setHistoricoAberto(false)} />}
        </>
      )}
    </dialog>
  );
}
