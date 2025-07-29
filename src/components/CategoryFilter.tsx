import React from 'react';
import { useApp } from '../context/AppContext';

const CategoryFilter: React.FC = () => {
  const { state, dispatch } = useApp();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories</h2>
      <div className="flex flex-wrap gap-3">
        {state.categories.map((category) => (
          <button
            key={category.id}
            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category.id })}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              state.selectedCategory === category.id
                ? 'bg-red-600 text-white border-red-600 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;