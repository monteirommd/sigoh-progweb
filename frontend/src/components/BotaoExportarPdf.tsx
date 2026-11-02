import { FileDown } from "lucide-react";
import { useState } from "react";
import { mensagemDeErro } from "../services/api";
import { relatorioService } from "../services/relatorio.service";

export function BotaoExportarPdf() {
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const exportar = async () => {
    setGerando(true);
    setErro(null);
    try {
      await relatorioService.baixarOcupacao();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setGerando(false);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-secundario" onClick={exportar} disabled={gerando}>
        <FileDown size={18} aria-hidden="true" /> {gerando ? "Gerando PDF..." : "Exportar PDF"}
      </button>
      {erro && (
        <p className="alerta alerta-erro" role="alert">
          {erro}
        </p>
      )}
    </>
  );
}
