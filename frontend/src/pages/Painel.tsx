import { CardOcupacaoBloco } from "../components/CardOcupacaoBloco";
import { ResumoStatus } from "../components/ResumoStatus";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { ocupacaoService } from "../services/ocupacao.service";
import "../styles/painel.css";
import type { OcupacaoBloco } from "../types/ocupacao";
import { calcularTaxa, classificarTaxaGeral, formatarTaxa } from "../utils/taxa";

function somar(ocupacoes: OcupacaoBloco[]) {
  return ocupacoes.reduce(
    (soma, o) => ({
      total: soma.total + o.total,
      DISPONIVEL: soma.DISPONIVEL + o.disponiveis,
      OCUPADO: soma.OCUPADO + o.ocupados,
      LIMPEZA: soma.LIMPEZA + o.limpeza,
      BLOQUEADO: soma.BLOQUEADO + o.bloqueados,
    }),
    { total: 0, DISPONIVEL: 0, OCUPADO: 0, LIMPEZA: 0, BLOQUEADO: 0 },
  );
}

export default function Painel() {
  const { dados: ocupacoes, erro, carregando } = useAtualizacaoPeriodica(ocupacaoService.porBloco);

  const totais = somar(ocupacoes ?? []);
  const taxaGeral = calcularTaxa(totais.OCUPADO, totais.total, totais.BLOQUEADO);
  const classificacaoGeral = classificarTaxaGeral(taxaGeral);

  return (
    <>
      <h1>Painel de ocupação</h1>

      {erro && (
        <p className="alerta alerta-erro" role="alert">
          {erro}
        </p>
      )}
      {carregando && <p role="status">Carregando...</p>}

      {ocupacoes && (
        <>
          <section aria-labelledby="titulo-geral" className="painel-secao">
            <h2 id="titulo-geral">Visão geral do hospital</h2>
            <div className="painel-geral">
              <div className={`taxa-geral ${classificacaoGeral.classe}`}>
                <span className="rotulo">Taxa de ocupação geral</span>
                <span className="numero taxa-geral-valor">{formatarTaxa(taxaGeral)}</span>
                <span className={`badge-nivel ${classificacaoGeral.classe}`}>{classificacaoGeral.rotulo}</span>
                <span>{totais.total} leitos em {ocupacoes.length} blocos</span>
              </div>
              <ResumoStatus contagens={totais} />
            </div>
          </section>

          <section aria-labelledby="titulo-blocos" className="painel-secao">
            <h2 id="titulo-blocos">Ocupação por bloco</h2>
            {ocupacoes.length === 0 ? (
              <p className="texto-suave">Nenhum bloco cadastrado.</p>
            ) : (
              <div className="grade-blocos">
                {ocupacoes.map((o) => (
                  <CardOcupacaoBloco key={o.blocoId} ocupacao={o} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
