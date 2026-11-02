import { baixarArquivo } from "./api";

export const relatorioService = {
  baixarOcupacao: () => baixarArquivo("/api/relatorios/ocupacao", "relatorio-ocupacao.pdf"),
};
