import React, { useState } from 'react';
import { Scale, Activity, ArrowLeft, ArrowRight } from 'lucide-react';

interface BMICalculatorProps {
  onNavigate?: (page: string) => void;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ onNavigate }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = () => {
    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInM > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInM * heightInM);
      setBMI(parseFloat(bmiValue.toFixed(1)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };

  const handleDietPlan = () => {
    const goal = bmi && bmi > 25 ? 'weight_loss' : 
                bmi && bmi < 18.5 ? 'weight_gain' : 'maintenance';
    onNavigate?.('diet');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            BMI Calculator
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter height in centimeters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter weight in kilograms"
            />
          </div>

          <button
            onClick={calculateBMI}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Activity className="h-5 w-5" />
            Calculate BMI
          </button>
        </div>
      </div>

      {bmi !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Your Results
          </h3>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {bmi}
            </p>
            <p className={`text-xl font-medium ${getBMICategory(bmi).color}`}>
              {getBMICategory(bmi).category}
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              BMI Categories:
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-500">Underweight: &lt; 18.5</li>
              <li className="text-green-500">Normal weight: 18.5 - 24.9</li>
              <li className="text-yellow-500">Overweight: 25 - 29.9</li>
              <li className="text-red-500">Obese: ≥ 30</li>
            </ul>
          </div>

          {onNavigate && (
            <button
              onClick={handleDietPlan}
              className="mt-6 w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowRight className="h-5 w-5" />
              Get Personalized Diet Plan
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BMICalculator