import React from 'react';
import { Square, Circle, Diamond, Goal as Oval } from 'lucide-react';

const shapes = [
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'diamond', icon: Diamond, label: 'Diamond' },
  { type: 'oval', icon: Oval, label: 'Oval' }
];

const Toolbar = ({ onAddShape }) => {
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('application/shape-type', type);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shapes</h2>
      <div className="space-y-2">
        {shapes.map(({ type, icon: Icon, label }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">
          Drag shapes to the canvas to start creating your diagram
        </p>
      </div>
    </div>
  );
};

export default Toolbar;