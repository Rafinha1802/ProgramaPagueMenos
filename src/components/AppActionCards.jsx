import React from 'react';
import { FileText, Calendar, Sparkles } from 'lucide-react';

export function AppActionCards({ onOpenPrescriptionFlow, onOpenAlerts }) {
  return (
    <div className="app-action-cards-grid">
      {/* Card 1: Busque produtos usando sua receita (com badge Novo) */}
      <div className="app-action-card" onClick={onOpenPrescriptionFlow}>
        <div className="app-action-card-top">
          <div style={{ color: 'var(--pm-app-blue)' }}>
            <FileText size={22} strokeWidth={2.2} />
          </div>
          <span className="badge-novo">Novo</span>
        </div>
        <div className="app-action-card-title">
          Busque produtos usando sua receita
        </div>
      </div>

      {/* Card 2: Configure alertas de medicamentos */}
      <div className="app-action-card" onClick={onOpenAlerts}>
        <div className="app-action-card-top">
          <div style={{ color: 'var(--pm-app-blue)' }}>
            <Calendar size={22} strokeWidth={2.2} />
          </div>
        </div>
        <div className="app-action-card-title">
          Configure alertas de medicamentos
        </div>
      </div>
    </div>
  );
}
