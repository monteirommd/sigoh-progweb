import { MapaLeitos } from "../components/MapaLeitos";
import { useAtualizacaoPeriodica } from "../hooks/useAtualizacaoPeriodica";
import { useAuth } from "../hooks/useAuth";
import { leitoService } from "../services/leito.service";
import { podeAlterarStatus } from "../utils/permissoes";

const listarTodosLeitos = () => leitoService.listar();

export default function Mapa() {
  const { sessao } = useAuth();
  const { dados: leitos, erro, carregando, recarregar } = useAtualizacaoPeriodica(listarTodosLeitos);

  return (
    <>
      <h1>Mapa de leitos</h1>

      {erro && (
        <p className="alerta alerta-erro" role="alert">
          {erro}
        </p>
      )}
      {carregando && <p role="status">Carregando...</p>}

      {leitos && (
        <MapaLeitos
          leitos={leitos}
          podeAlterar={sessao !== null && podeAlterarStatus(sessao.role)}
          onAlterado={recarregar}
        />
      )}
    </>
  );
}
