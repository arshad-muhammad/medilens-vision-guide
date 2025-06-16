
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SideEffectsChartProps {
  data?: {
    common: number;
    uncommon: number;
    rare: number;
  };
}

const SideEffectsChart = ({ data }: SideEffectsChartProps) => {
  const defaultData = data || { common: 60, uncommon: 30, rare: 10 };
  
  const chartData = [
    { name: 'Common', value: defaultData.common, color: '#f59e0b' },
    { name: 'Uncommon', value: defaultData.uncommon, color: '#ef4444' },
    { name: 'Rare', value: defaultData.rare, color: '#8b5cf6' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name} Side Effects</p>
          <p className="text-gray-600">{data.value}% of patients</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SideEffectsChart;
