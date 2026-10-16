import React from 'react';
import { Pill, Sparkles, Baby, Dumbbell } from 'lucide-react';

export function AppCategories({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: 'Medicamentos', label: 'Medicamentos e saúde', icon: Pill },
    { id: 'Skincare', label: 'Dermo e beleza', icon: Sparkles },
    { id: 'Baby', label: 'Mamães e bebês', icon: Baby },
    { id: 'Suplementos', label: 'Vida saudável', icon: Dumbbell }
  ];

  return (
    <div className="app-categories-section">
      <div className="app-categories-header">
        <h3 className="app-categories-title">Categorias</h3>
        <span
          className="app-categories-see-all"
          onClick={() => onSelectCategory('all')}
        >
          {activeCategory === 'all' ? 'Ver todas' : 'Limpar filtro'}
        </span>
      </div>

      <div className="app-categories-list">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`app-category-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
            >
              <div className="app-category-icon-box">
                <IconComponent size={24} strokeWidth={1.9} />
              </div>
              <div className="app-category-label">
                {cat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
