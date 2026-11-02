import type { ApiError } from "../types/api-error";

const URL_BASE = import.meta.env.VITE_API_URL;

type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

let token: string | null = null;
let aoExpirarSessao: (() => void) | null = null;

export function definirToken(novoToken: string | null) {
  token = novoToken;
}

export function definirAoExpirarSessao(callback: () => void) {
  aoExpirarSessao = callback;
}

class ErroApi extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

export async function requisitar<T>(caminho: string, metodo: Metodo = "GET", corpo?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta: Response;
  try {
    resposta = await fetch(URL_BASE + caminho, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroApi(0, "Não foi possível conectar ao servidor");
  }

  if (resposta.status === 401 && token) {
    aoExpirarSessao?.();
  }

  if (!resposta.ok) {
    const erro = (await resposta.json().catch(() => null)) as ApiError | null;
    throw new ErroApi(resposta.status, erro?.message ?? `Erro ${resposta.status}`);
  }

  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}

export async function baixarArquivo(caminho: string, nomePadrao: string): Promise<void> {
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  let resposta: Response;
  try {
    resposta = await fetch(URL_BASE + caminho, { headers });
  } catch {
    throw new ErroApi(0, "Não foi possível conectar ao servidor");
  }

  if (resposta.status === 401 && token) {
    aoExpirarSessao?.();
  }

  if (!resposta.ok) {
    const erro = (await resposta.json().catch(() => null)) as ApiError | null;
    throw new ErroApi(resposta.status, erro?.message ?? `Erro ${resposta.status}`);
  }

  const disposicao = resposta.headers.get("Content-Disposition") ?? "";
  const nome = /filename="?([^"]+)"?/.exec(disposicao)?.[1] ?? nomePadrao;
  const url = URL.createObjectURL(await resposta.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  URL.revokeObjectURL(url);
}

export function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : "Erro inesperado";
}
