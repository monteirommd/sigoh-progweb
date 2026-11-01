import type { Usuario, UsuarioRequest } from "../types/usuario";
import { requisitar } from "./api";

export const usuarioService = {
  listar: () => requisitar<Usuario[]>("/api/usuarios"),
  criar: (dados: UsuarioRequest) => requisitar<Usuario>("/api/usuarios", "POST", dados),
  atualizar: (id: number, dados: UsuarioRequest) => requisitar<Usuario>(`/api/usuarios/${id}`, "PUT", dados),
  excluir: (id: number) => requisitar<void>(`/api/usuarios/${id}`, "DELETE"),
};
