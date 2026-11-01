import type { OcupacaoBloco } from "../types/ocupacao";
import { requisitar } from "./api";

export const ocupacaoService = {
  porBloco: () => requisitar<OcupacaoBloco[]>("/api/ocupacao/blocos"),
};
