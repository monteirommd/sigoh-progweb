import { useCallback, useEffect, useState } from "react";
import { mensagemDeErro } from "../services/api";

export const INTERVALO_PADRAO_MS = 5000;

export function useAtualizacaoPeriodica<T>(buscar: () => Promise<T>, intervaloMs = INTERVALO_PADRAO_MS) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setDados(await buscar());
      setErro(null);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }, [buscar]);

  useEffect(() => {
    let ativo = true;
    const executar = async () => {
      try {
        const resultado = await buscar();
        if (ativo) {
          setDados(resultado);
          setErro(null);
        }
      } catch (e) {
        if (ativo) setErro(mensagemDeErro(e));
      }
    };
    executar();
    const id = setInterval(executar, intervaloMs);
    return () => {
      ativo = false;
      clearInterval(id);
    };
  }, [buscar, intervaloMs]);

  return { dados, erro, carregando: dados === null && erro === null, recarregar };
}
