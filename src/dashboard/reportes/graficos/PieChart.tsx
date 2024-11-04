import { Chart } from "react-google-charts";
interface Props{
    data : any[] 
}

const PieChart = ({ data } : Props) => {
    return (
        <Chart
            chartType="PieChart"
            data={data}
            options={{title: "Cantidad Pedidos Por Instrumentos"}}
            width={"100%"}
            height={"400px"}
        />
    );
}


export default PieChart;
