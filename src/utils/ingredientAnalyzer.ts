import { Ingredient } from '../types/ingredient';

const ingredientDatabase: { [key: string]: Partial<Ingredient> } = {
  'water': {
    function: 'Solvent',
    ewgScore: 1,
    safetyLevel: 'Low Concern',
    reasonForConcern: '',
    commonUse: 'Base ingredient in most products'
  },
  'sodium lauryl sulfate': {
    function: 'Surfactant, Cleansing Agent',
    ewgScore: 3,
    safetyLevel: 'Moderate Concern',
    reasonForConcern: 'Irritation (skin, eyes, or lungs), Organ system toxicity, Contamination concerns',
    commonUse: 'Foaming agent in cleansers, shampoos'
  },
  'methylparaben': {
    function: 'Preservative',
    ewgScore: 4,
    safetyLevel: 'Moderate Concern',
    reasonForConcern: 'Endocrine disruption, Allergies/immunotoxicity',
    commonUse: 'Preservative in cosmetics'
  },
  'propylparaben': {
    function: 'Preservative',
    ewgScore: 7,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Endocrine disruption, Developmental/reproductive toxicity',
    commonUse: 'Preservative in cosmetics'
  },
  'fragrance': {
    function: 'Fragrance',
    ewgScore: 8,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Allergies/immunotoxicity, Irritation, Non-reproductive organ system toxicity',
    commonUse: 'Scent in personal care products'
  },
  'oxybenzone': {
    function: 'UV Filter',
    ewgScore: 8,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Endocrine disruption, Allergies/immunotoxicity, Biochemical or cellular level changes',
    commonUse: 'Sunscreen agent'
  },
  'glycerin': {
    function: 'Humectant',
    ewgScore: 1,
    safetyLevel: 'Low Concern',
    reasonForConcern: '',
    commonUse: 'Moisturizing agent in skin care'
  },
  'tocopherol': {
    function: 'Antioxidant',
    ewgScore: 1,
    safetyLevel: 'Low Concern',
    reasonForConcern: '',
    commonUse: 'Vitamin E, preserves product freshness'
  },
  'sodium benzoate': {
    function: 'Preservative',
    ewgScore: 3,
    safetyLevel: 'Moderate Concern',
    reasonForConcern: 'Organ system toxicity, Multiple additive exposure sources',
    commonUse: 'Preservative in food and cosmetics'
  },
  'phenoxyethanol': {
    function: 'Preservative',
    ewgScore: 4,
    safetyLevel: 'Moderate Concern',
    reasonForConcern: 'Irritation, Occupational hazards, Organ system toxicity',
    commonUse: 'Common preservative in cosmetics'
  },
  'retinyl palmitate': {
    function: 'Anti-aging',
    ewgScore: 9,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Biochemical or cellular level changes, Developmental/reproductive toxicity, Cancer',
    commonUse: 'Form of Vitamin A used in anti-aging products'
  },
  'titanium dioxide': {
    function: 'UV filter, Colorant',
    ewgScore: 3,
    safetyLevel: 'Moderate Concern',
    reasonForConcern: 'Organ system toxicity, Cancer (when airborne)',
    commonUse: 'Sunscreen ingredient, colorant in makeup'
  },
  'butylated hydroxyanisole': {
    function: 'Preservative',
    ewgScore: 7,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Cancer, Endocrine disruption, Organ system toxicity',
    commonUse: 'Preservative in cosmetics and personal care products'
  },
  'triclosan': {
    function: 'Antimicrobial',
    ewgScore: 7,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Endocrine disruption, Ecotoxicology, Organ system toxicity',
    commonUse: 'Antibacterial agent in personal care products'
  },
  'toluene': {
    function: 'Solvent',
    ewgScore: 10,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Developmental/reproductive toxicity, Organ system toxicity, Multiple exposure sources',
    commonUse: 'Solvent in nail products'
  },
  'hydroquinone': {
    function: 'Skin Lightener',
    ewgScore: 8,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Cancer, Organ system toxicity, Skin irritation',
    commonUse: 'Skin lightening agent'
  },
  'formaldehyde': {
    function: 'Preservative',
    ewgScore: 10,
    safetyLevel: 'High Concern',
    reasonForConcern: 'Cancer, Allergies/immunotoxicity, Organ system toxicity',
    commonUse: 'Preservative in personal care products'
  }
};

const unknownIngredient: Partial<Ingredient> = {
  function: 'Unknown',
  ewgScore: 3,
  safetyLevel: 'Moderate Concern',
  reasonForConcern: 'Limited safety data available',
  commonUse: 'Various applications'
};

export const analyzeIngredients = (ingredientList: string): Ingredient[] => {
  const ingredientsArray = ingredientList.split(/[,;\n]+/).map(item => item.trim().toLowerCase());
  
  const filteredIngredients = ingredientsArray.filter(item => item !== '');
  
  return filteredIngredients.map(name => {
    const matchedIngredient = Object.keys(ingredientDatabase).find(
      key => name.includes(key) || key.includes(name)
    );
    
    const details = matchedIngredient 
      ? ingredientDatabase[matchedIngredient] 
      : unknownIngredient;
    
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      ...details
    } as Ingredient;
  });
};