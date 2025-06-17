import React from "react";

export function TabsTabelaCalculo({ showTabelas, setShowTabelas }) {
  const marcarSomenteTabela = (nomeTabela) => (prev) =>
    Object.fromEntries(Object.keys(prev).map((key) => [key, key === nomeTabela]));

  const abas = [
    /* { nome: "Resumo", chave: "tabelaResumo" }, */
    { nome: "Cálculo", chave: "tabelaCalculo" },
/*     { nome: "IR", chave: "tabelaIR" },
    { nome: "Custas", chave: "tabelaCustas" }, */
  ];

  return (
    <div className="border-b pt-1 px-1 rounded-t w-full">
      <div className="flex gap-1 items-center justify-between lg:w-full">
        <div className="flex w-full">
          {abas.map(({ nome, chave }) => (
            <div key={chave} className="flex w-[150px] overflow-hidden bg-white dark:bg-neutral-900" onClick={() => setShowTabelas(marcarSomenteTabela(chave))}>
              <div className={
                "flex flex-none justify-between items-center rounded-t py-1 border-t border-l border-r dark:border-neutral-600 dark:text-white px-2 w-full "}>
                <div className="text-sm">
                  <span>{nome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
