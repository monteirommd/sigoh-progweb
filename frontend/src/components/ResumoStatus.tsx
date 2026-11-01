import { Bed, BrushCleaning, LockKeyhole, type LucideIcon } from "lucide-react";
import type { StatusLeito } from "../types/leito";
import { ROTULO_STATUS, STATUS_LEITO, classeStatus } from "../utils/leito";

const ICONES: Record<StatusLeito, LucideIcon> = {
  DISPONIVEL: Bed,
  OCUPADO: Bed,
  LIMPEZA: BrushCleaning,
  BLOQUEADO: LockKeyhole,
};

interface Props {
  contagens: Record<StatusLeito, number>;
}

export function ResumoStatus({ contagens }: Props) {
  const total = STATUS_LEITO.reduce((soma, status) => soma + contagens[status], 0);

  return (
    <ul className="resumo-status">
      {STATUS_LEITO.map((status) => {
        const Icone = ICONES[status];
        const percentual = total > 0 ? Math.round((contagens[status] / total) * 100) : 0;
        return (
          <li key={status} className={`card resumo-status-item borda-${classeStatus(status)}`}>
            <span className={`resumo-status-icone ${classeStatus(status)}`}>
              <Icone size={28} aria-hidden="true" />
            </span>
            <span className="resumo-status-textos">
              <span className="rotulo">{ROTULO_STATUS[status]}</span>
              <span className="numero resumo-status-numero">{contagens[status]}</span>
              <span className="texto-suave">{percentual}% do total</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
