import { Link } from "react-router-dom";

export interface ItemTrilha {
  rotulo: string;
  para?: string;
}

export function Trilha({ itens }: { itens: ItemTrilha[] }) {
  return (
    <nav aria-label="Trilha" className="trilha">
      <ol>
        {itens.map((item, indice) => {
          const atual = indice === itens.length - 1;
          return (
            <li key={item.rotulo}>
              {item.para && !atual ? (
                <Link to={item.para}>{item.rotulo}</Link>
              ) : (
                <span aria-current={atual ? "page" : undefined}>{item.rotulo}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
