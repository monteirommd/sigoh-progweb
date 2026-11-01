import { useState, type FormEvent, type ReactNode } from "react";
import { mensagemDeErro } from "../services/api";
import { Dialogo } from "./Dialogo";

interface Props {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  onSalvar: () => Promise<void>;
  children: ReactNode;
}

export function DialogoFormulario({ aberto, titulo, onFechar, onSalvar, children }: Props) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const fechar = () => {
    setErro(null);
    onFechar();
  };

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await onSalvar();
      fechar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialogo aberto={aberto} titulo={titulo} onFechar={fechar}>
      <form onSubmit={enviar}>
        {children}
        {erro && (
          <p className="alerta alerta-erro" role="alert">
            {erro}
          </p>
        )}
        <div className="acoes dialogo-acoes">
          <button type="button" className="btn btn-secundario" onClick={fechar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}
