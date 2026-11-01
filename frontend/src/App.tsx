import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/AuthProvider";
import GestaoBlocos from "./pages/GestaoBlocos";
import GestaoEnfermarias from "./pages/GestaoEnfermarias";
import GestaoLeitos from "./pages/GestaoLeitos";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import Login from "./pages/Login";
import Mapa from "./pages/Mapa";
import Painel from "./pages/Painel";
import Tecnico from "./pages/Tecnico";
import { RotaProtegida } from "./routes/RotaProtegida";
import { PAPEIS_PAINEL } from "./utils/permissoes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RotaProtegida />}>
            <Route element={<Layout />}>
              <Route element={<RotaProtegida papeis={["TECNICO"]} />}>
                <Route path="/tecnico" element={<Tecnico />} />
              </Route>
              <Route element={<RotaProtegida papeis={PAPEIS_PAINEL} />}>
                <Route path="/painel" element={<Painel />} />
                <Route path="/mapa" element={<Mapa />} />
              </Route>
              <Route element={<RotaProtegida papeis={["ADMIN"]} />}>
                <Route path="/gestao/blocos" element={<GestaoBlocos />} />
                <Route path="/gestao/blocos/:blocoId/enfermarias" element={<GestaoEnfermarias />} />
                <Route path="/gestao/blocos/:blocoId/enfermarias/:enfermariaId/leitos" element={<GestaoLeitos />} />
                <Route path="/gestao/usuarios" element={<GestaoUsuarios />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
