import { useState } from "react";
import "../styles/mapa-leitos.css";
import type { Leito } from "../types/leito";
import { ROTULO_STATUS, classeStatus } from "../utils/leito";
import { DialogoStatusLeito } from "./DialogoStatusLeito";

interface GrupoEnfermaria {
  id: number;
  nome: string;
  leitos: Leito[];
}

interface GrupoBloco {
  id: number;
  nome: string;
  enfermarias: GrupoEnfermaria[];
}

function agruparPorBloco(leitos: Leito[]): GrupoBloco[] {
  const blocos = new Map<number, GrupoBloco>();
  for (const leito of leitos) {
    let bloco = blocos.get(leito.blocoId);
    if (!bloco) {
      bloco = { id: leito.blocoId, nome: leito.blocoNome, enfermarias: [] };
      blocos.set(leito.blocoId, bloco);
    }
    let enfermaria = bloco.enfermarias.find((e) => e.id === leito.enfermariaId);
    if (!enfermaria) {
      enfermaria = { id: leito.enfermariaId, nome: leito.enfermariaNome, leitos: [] };
      bloco.enfermarias.push(enfermaria);
    }
    enfermaria.leitos.push(leito);
  }
  return [...blocos.values()];
}

interface Props {
  leitos: Leito[];
  podeAlterar: boolean;
  onAlterado: () => void;
}

export function MapaLeitos({ leitos, podeAlterar, onAlterado }: Props) {
  const [selecionado, setSelecionado] = useState<Leito | null>(null);
  const blocos = agruparPorBloco(leitos);

  if (blocos.length === 0) return <p className="texto-suave">Nenhum leito cadastrado.</p>;

  return (
    <>
      <div className="mapa">
        {blocos.map((bloco) => (
          <section key={bloco.id} className="card mapa-bloco" aria-labelledby={`mapa-bloco-${bloco.id}`}>
            <h3 id={`mapa-bloco-${bloco.id}`}>{bloco.nome}</h3>
            {bloco.enfermarias.map((enfermaria) => (
              <div key={enfermaria.id} className="mapa-enfermaria">
                <h4 id={`mapa-enf-${enfermaria.id}`}>{enfermaria.nome}</h4>
                <ul className="mapa-leitos" aria-labelledby={`mapa-enf-${enfermaria.id}`}>
                  {enfermaria.leitos.map((leito) => (
                    <li key={leito.id}>
                      <button
                        type="button"
                        className={`leito ${classeStatus(leito.status)}`}
                        aria-label={`Leito ${leito.codigo}, ${ROTULO_STATUS[leito.status]}. ${podeAlterar ? "Alterar status ou ver histórico" : "Ver detalhes"}`}
                        onClick={() => setSelecionado(leito)}
                      >
                        <span className="leito-codigo">{leito.codigo}</span>
                        <span className="leito-status">{ROTULO_STATUS[leito.status]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
      <DialogoStatusLeito
        leito={selecionado}
        podeAlterar={podeAlterar}
        onFechar={() => setSelecionado(null)} onAlterado={onAlterado} />
    </>
  );
}
