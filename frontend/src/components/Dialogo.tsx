import { useEffect, useId, useRef, type ReactNode } from "react";

interface Props {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
}

export function Dialogo({ aberto, titulo, onFechar, children }: Props) {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const tituloId = useId();

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog ref={dialogoRef} className="dialogo" aria-labelledby={tituloId} onClose={onFechar}>
      {aberto && (
        <>
          <h2 id={tituloId}>{titulo}</h2>
          {children}
        </>
      )}
    </dialog>
  );
}
