
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dosageData = [
  { time: '8:00 AM', level: 100, dose: '200mg' },
  { time: '10:00 AM', level: 80, dose: '' },
  { time: '12:00 PM', level: 60, dose: '200mg' },
  { time: '2:00 PM', level: 90, dose: '' },
  { time: '4:00 PM', level: 70, dose: '200mg' },
  { time: '6:00 PM', level: 85, dose: '' },
  { time: '8:00 PM', level: 50, dose: '200mg' },
  { time: '10:00 PM', level: 30, dose: '' },
];

const DosageChart = () => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Recommended Dosage:</h4>
        <p className="text-blue-700">Adults: 200-400mg every 4-6 hours. Maximum 1200mg per day.</p>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dosageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'Medicine Level (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#1d4ed8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded-lg">
          <h5 className="font-semibold text-green-800">Best Times to Take:</h5>
          <ul className="text-green-700 mt-1">
            <li>• With food to reduce stomach irritation</li>
            <li>• Every 4-6 hours as needed</li>
          </ul>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <h5 className="font-semibold text-amber-800">Important Notes:</h5>
          <ul className="text-amber-700 mt-1">
            <li>• Don't exceed daily maximum</li>
            <li>• Consult doctor if symptoms persist</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DosageChart;
