import React, { useState } from 'react';
import { Scan, ArrowLeft } from 'lucide-react';
import { analyzeIngredients } from '../../utils/ingredientAnalyzer';
import IngredientResults from './IngredientResults';
import ImageCapture from './ImageCapture';
import ProductSearch from './ProductSearch';
import ProductResults from './ProductResults';
import { Ingredient } from '../../types/ingredient';
import { Product } from '../../types/product';

interface IngredientScannerProps {
  onNavigate?: (page: string) => void;
}

const IngredientScanner: React.FC<IngredientScannerProps> = ({ onNavigate }) => {
  const [ingredients, setIngredients] = useState('');
  const [analyzedIngredients, setAnalyzedIngredients] = useState<Ingredient[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!ingredients.trim()) return;
    
    setIsAnalyzing(true);
    setProduct(null);
    
    setTimeout(() => {
      const results = analyzeIngredients(ingredients);
      setAnalyzedIngredients(results);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleTextExtracted = (text: string) => {
    setIngredients(text);
    setProduct(null);
  };

  const handleProductFound = (foundProduct: Product) => {
    setProduct(foundProduct);
    setAnalyzedIngredients([]);
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
          Product & Ingredient Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Search for a product or scan ingredients to analyze their safety and read community reviews.
        </p>
        
        <div className="space-y-6">
          <ProductSearch onProductFound={handleProductFound} />
          
          <div className="relative">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">- OR -</p>
            <ImageCapture onTextExtracted={handleTextExtracted} />
            
            <textarea
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:ring-2 focus:ring-green-500 focus:border-transparent 
                        resize-none transition-colors duration-200"
              placeholder="Paste ingredients here (e.g., Water, Glycerin, Fragrance, Sodium Lauryl Sulfate...)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          
          {ingredients && (
            <button
              onClick={handleAnalyze}
              disabled={!ingredients.trim() || isAnalyzing}
              className={`
                flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md 
                text-white font-medium transition-all duration-200
                ${
                  !ingredients.trim() || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                }
              `}
            >
              <Scan className="h-5 w-5" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Ingredients'}
            </button>
          )}
        </div>
      </div>

      {product && <ProductResults product={product} />}
      {analyzedIngredients.length > 0 && <IngredientResults ingredients={analyzedIngredients} />}
    </div>
  );
};

export default IngredientScanner;