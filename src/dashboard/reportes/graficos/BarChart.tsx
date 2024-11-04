
import { Chart } from 'react-google-charts';

interface Props {
    data: any[]
    title: string
}
const BarChart = ({ data, title }: Props) => {


    const options = {
        chart: {
            title: { title },
        },
    };

    return (
        <>
            <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        </>
    );
};

export default BarChart;
