export interface ClassificacaoTaxa {
  rotulo: string;
  classe: string;
}

interface Faixa {
  limite: number;
  rotulo: string;
}

function classificar(taxa: number, faixas: Faixa[], ultima: string): ClassificacaoTaxa {
  const indice = faixas.findIndex((f) => taxa < f.limite);
  const nivel = indice === -1 ? faixas.length : indice;
  return { rotulo: indice === -1 ? ultima : faixas[indice].rotulo, classe: `nivel-${nivel}` };
}

export function classificarTaxaGeral(taxa: number): ClassificacaoTaxa {
  return classificar(
    taxa,
    [
      { limite: 75, rotulo: "Normalidade" },
      { limite: 85, rotulo: "Alerta" },
      { limite: 95, rotulo: "Crítico" },
    ],
    "Colapso",
  );
}

export function classificarTaxaBloco(taxa: number): ClassificacaoTaxa {
  return classificar(
    taxa,
    [
      { limite: 80, rotulo: "Seguro" },
      { limite: 90, rotulo: "Atenção" },
      { limite: 95, rotulo: "Risco" },
    ],
    "Crítico",
  );
}

export function calcularTaxa(ocupados: number, total: number, bloqueados: number): number {
  const operacionais = total - bloqueados;
  return operacionais > 0 ? Math.round((ocupados * 1000) / operacionais) / 10 : 0;
}

export function formatarTaxa(taxa: number): string {
  return `${taxa.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}
