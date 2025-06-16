
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const sideEffectsData = [
  { name: 'Stomach Upset', value: 15, severity: 'mild', color: '#fbbf24' },
  { name: 'Nausea', value: 8, severity: 'mild', color: '#34d399' },
  { name: 'Dizziness', value: 5, severity: 'moderate', color: '#fb923c' },
  { name: 'Headache', value: 3, severity: 'mild', color: '#60a5fa' },
  { name: 'Allergic Reaction', value: 1, severity: 'severe', color: '#f87171' },
];

const severityData = [
  { severity: 'Mild', count: 26, color: '#34d399' },
  { severity: 'Moderate', count: 5, color: '#fbbf24' },
  { severity: 'Severe', count: 1, color: '#f87171' },
];

const SideEffectsChart = () => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Side Effects by Type</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sideEffectsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {sideEffectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Severity Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="severity" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Side Effects List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Common Side Effects</h4>
        <div className="grid gap-3">
          {sideEffectsData.map((effect) => (
            <div 
              key={effect.name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: effect.color }}
                />
                <span className="font-medium">{effect.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  effect.severity === 'mild' ? 'bg-green-100 text-green-800' :
                  effect.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {effect.severity}
                </span>
              </div>
              <span className="text-gray-600 font-medium">{effect.value}% of users</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h5 className="font-semibold text-red-800 mb-2">⚠️ When to Stop Taking:</h5>
        <ul className="text-red-700 text-sm space-y-1">
          <li>• Severe allergic reactions (rash, difficulty breathing)</li>
          <li>• Persistent stomach pain or black stools</li>
          <li>• Signs of liver problems (yellowing of skin/eyes)</li>
          <li>• Unusual bleeding or bruising</li>
        </ul>
      </div>
    </div>
  );
};

export default SideEffectsChart;
