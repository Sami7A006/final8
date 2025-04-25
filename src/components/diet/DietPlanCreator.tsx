import React, { useState } from 'react';
import { Utensils, ArrowLeft } from 'lucide-react';
import { createIndianDietPlan } from '../../utils/indianDietPlan';
import DietPlanResult from './DietPlanResult';
import WeightProgressChart from './WeightProgressChart';
import { DietPlan } from '../../types/dietPlan';

interface DietPlanCreatorProps {
  onNavigate?: (page: string) => void;
  initialGoal?: string;
  initialTimeframe?: string;
}

const DietPlanCreator: React.FC<DietPlanCreatorProps> = ({ 
  onNavigate,
  initialGoal = '',
  initialTimeframe = ''
}) => {
  const [formData, setFormData] = useState({
    goal: initialGoal,
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    dietaryType: 'vegetarian',
    timeframe: initialTimeframe || '8_weeks'
  });
  
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    setTimeout(() => {
      const plan = createIndianDietPlan(
        formData.goal,
        formData.dietaryType === 'vegetarian',
        formData.timeframe,
        parseFloat(formData.currentWeight),
        parseFloat(formData.targetWeight),
        formData.activityLevel
      );
      setDietPlan(plan);
      setIsGenerating(false);
    }, 2000);
  };

  const isFormValid = () => {
    return formData.goal && formData.currentWeight && formData.targetWeight && formData.activityLevel;
  };

  return (
    <div className="space-y-6">
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Indian Diet Plan Creator
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create your personalized Indian diet plan based on your goals and preferences.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Goal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select your goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Diet Type
              </label>
              <select
                name="dietaryType"
                value={formData.dietaryType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="nonVegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                min="30"
                max="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                min="30"
                max="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (2x per day)</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid() || isGenerating}
            className={`
              flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md 
              text-white font-medium transition-all duration-200
              ${
                !isFormValid() || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              }
            `}
          >
            <Utensils className="h-5 w-5" />
            {isGenerating ? 'Generating Plan...' : 'Generate Diet Plan'}
          </button>
        </form>
      </div>

      {formData.currentWeight && formData.targetWeight && (
        <WeightProgressChart
          currentWeight={parseFloat(formData.currentWeight)}
          targetWeight={parseFloat(formData.targetWeight)}
          timeframe={formData.timeframe}
        />
      )}

      {dietPlan && <DietPlanResult plan={dietPlan} />}
    </div>
  );
};

export default DietPlanCreator;