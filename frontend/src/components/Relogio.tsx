import { useEffect, useState } from "react";

const formatador = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function Relogio() {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className="cabecalho-relogio" dateTime={agora.toISOString()}>
      {formatador.format(agora)}
    </time>
  );
}
