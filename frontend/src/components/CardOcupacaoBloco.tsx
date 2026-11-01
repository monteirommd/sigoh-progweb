import type { OcupacaoBloco } from "../types/ocupacao";
import { classificarTaxaBloco, formatarTaxa } from "../utils/taxa";

interface Props {
  ocupacao: OcupacaoBloco;
}

export function CardOcupacaoBloco({ ocupacao }: Props) {
  const classificacao = classificarTaxaBloco(ocupacao.taxaOcupacao);
  const tituloId = `bloco-${ocupacao.blocoId}`;

  return (
    <article className={`card card-bloco ${classificacao.classe}`} aria-labelledby={tituloId}>
      <header className="card-bloco-topo">
        <h3 id={tituloId}>{ocupacao.blocoNome}</h3>
        <span className={`badge-nivel ${classificacao.classe}`}>{classificacao.rotulo}</span>
      </header>
      <p className="card-bloco-taxa">
        <span className="numero">{formatarTaxa(ocupacao.taxaOcupacao)}</span>
        <span className="rotulo">ocupação</span>
      </p>
      <div className="barra" aria-hidden="true">
        <div className="barra-preenchida" style={{ width: `${Math.min(ocupacao.taxaOcupacao, 100)}%` }} />
      </div>
      <dl className="card-bloco-contagens">
        <div>
          <dt className="rotulo">Ocupados</dt>
          <dd className="numero">{ocupacao.ocupados}</dd>
        </div>
        <div>
          <dt className="rotulo">Disponíveis</dt>
          <dd className="numero">{ocupacao.disponiveis}</dd>
        </div>
        <div>
          <dt className="rotulo">Limpeza</dt>
          <dd className="numero">{ocupacao.limpeza}</dd>
        </div>
        <div>
          <dt className="rotulo">Bloqueados</dt>
          <dd className="numero">{ocupacao.bloqueados}</dd>
        </div>
      </dl>
      <p className="card-bloco-total texto-suave">{ocupacao.total} leitos no bloco</p>
    </article>
  );
}
