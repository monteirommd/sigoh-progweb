import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types/usuario";
import { rotaInicial } from "../utils/permissoes";

interface Props {
  papeis?: Role[];
}

export function RotaProtegida({ papeis }: Props) {
  const { sessao } = useAuth();

  if (!sessao) return <Navigate to="/login" replace />;
  if (papeis && !papeis.includes(sessao.role)) return <Navigate to={rotaInicial(sessao.role)} replace />;

  return <Outlet />;
}
