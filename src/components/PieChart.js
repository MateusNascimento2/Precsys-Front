import React, { useEffect, useState } from 'react'
import { VictoryPie } from 'victory';



function PieChart() {
  const [endAngle, setEndAngle] = useState(360); // Define o ângulo final inicial
  const [hoveredData, setHoveredData] = useState(null);

  // Define a animação para abrir o gráfico
  useEffect(() => {
    const interval = setInterval(() => {
      setEndAngle(endAngle => endAngle - 2); // Diminui o ângulo final gradualmente
    }, 15);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-[300px]'>
      <VictoryPie
        data={[
          { x: "Cats", y: 35 },
          { x: "Dogs", y: 40 },
          { x: "Birds", y: 55 }
        ]}
        innerRadius={100}
        startAngle={360} // Define um raio interno para o gráfico de pizza
        endAngle={endAngle} // Define o ângulo final para a animação
        animate={{ duration: 0 }} // Adiciona animação com efeito de retorno
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "data",
                    mutation: (props) => {
                      const { x, y } = props.datum;
                      setHoveredData({ label: x, quantity: y });
                      return { style: { fill: "#c43a31" } };
                    }
                  }
                ];
              },
              onMouseOut: () => {
                setHoveredData(null);
                return [
                  {
                    target: "data",
                    mutation: () => null
                  }
                ];
              }
            }
          }
        ]}
      />
      {hoveredData && (
        <div>
          <p>Label: {hoveredData.label}</p>
          <p>Quantity: {hoveredData.quantity}</p>
        </div>
      )}
    </div>
  )
}

export default PieChart;