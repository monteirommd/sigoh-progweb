import { useState } from "react";
import { mensagemDeErro } from "../services/api";
import { Dialogo } from "./Dialogo";

interface Props {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  rotuloConfirmar?: string;
  onFechar: () => void;
  onConfirmar: () => Promise<void>;
}

export function DialogoConfirmacao({ aberto, titulo, mensagem, rotuloConfirmar = "Excluir", onFechar, onConfirmar }: Props) {
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const fechar = () => {
    setErro(null);
    onFechar();
  };

  const confirmar = async () => {
    setProcessando(true);
    setErro(null);
    try {
      await onConfirmar();
      fechar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialogo aberto={aberto} titulo={titulo} onFechar={fechar}>
      <p>{mensagem}</p>
      {erro && (
        <p className="alerta alerta-erro" role="alert">
          {erro}
        </p>
      )}
      <div className="acoes dialogo-acoes">
        <button type="button" className="btn btn-secundario" onClick={fechar} disabled={processando}>
          Cancelar
        </button>
        <button type="button" className="btn btn-perigo" onClick={confirmar} disabled={processando}>
          {processando ? "Excluindo..." : rotuloConfirmar}
        </button>
      </div>
    </Dialogo>
  );
}
