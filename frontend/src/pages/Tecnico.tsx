import { useCallback, useEffect, useState } from "react";
import { MapaLeitos } from "../components/MapaLeitos";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { mensagemDeErro } from "../services/api";
import { blocoService } from "../services/estrutura.service";
import { leitoService } from "../services/leito.service";
import "../styles/tecnico.css";
import type { Bloco } from "../types/bloco";
import type { Leito, StatusLeito } from "../types/leito";
import { ROTULO_STATUS, STATUS_LEITO, classeStatus } from "../utils/leito";

const CHAVE_BLOCO = "sigoh:tecnico-bloco";

function contar(leitos: Leito[], status: StatusLeito) {
  return leitos.filter((l) => l.status === status).length;
}

export default function Tecnico() {
  const [blocos, setBlocos] = useState<Bloco[] | null>(null);
  const [erroBlocos, setErroBlocos] = useState<string | null>(null);
  const [blocoId, setBlocoId] = useState<number | null>(() => Number(sessionStorage.getItem(CHAVE_BLOCO)) || null);

  useEffect(() => {
    blocoService
      .listar()
      .then((lista) => {
        setBlocos(lista);
        setBlocoId((atual) => (atual && lista.some((b) => b.id === atual) ? atual : (lista[0]?.id ?? null)));
      })
      .catch((e) => setErroBlocos(mensagemDeErro(e)));
  }, []);

  const listar = useCallback(
    () => (blocoId ? leitoService.listar({ blocoId }) : Promise.resolve<Leito[]>([])),
    [blocoId],
  );
  const { dados: leitos, erro, recarregar } = useAtualizacaoPeriodica(listar);

  const escolherBloco = (id: number) => {
    setBlocoId(id);
    sessionStorage.setItem(CHAVE_BLOCO, String(id));
  };

  const erroTela = erroBlocos ?? erro;

  return (
    <div className="tecnico">
      <h1>Leitos</h1>

      {erroTela && (
        <p className="alerta alerta-erro" role="alert">
          {erroTela}
        </p>
      )}

      {blocos && blocos.length === 0 && <p className="texto-suave">Nenhum bloco cadastrado.</p>}

      {blocos && blocos.length > 0 && (
        <div className="campo tecnico-bloco">
          <label htmlFor="tecnico-bloco">Bloco</label>
          <select id="tecnico-bloco" value={blocoId ?? ""} onChange={(e) => escolherBloco(Number(e.target.value))}>
            {blocos.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {leitos && blocoId && (
        <>
          <ul className="tecnico-resumo" aria-label="Resumo do bloco">
            {STATUS_LEITO.map((status) => (
              <li key={status} className={classeStatus(status)}>
                <span className="numero">{contar(leitos, status)}</span>
                <span>{ROTULO_STATUS[status]}</span>
              </li>
            ))}
          </ul>
          <MapaLeitos leitos={leitos} podeAlterar onAlterado={recarregar} />
        </>
      )}
    </div>
  );
}
