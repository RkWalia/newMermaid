import React, { useRef, useCallback } from 'react';
import ShapeComponent from './ShapeComponent';
import ConnectionComponent from './ConnectionComponent';

const Canvas = ({
  shapes,
  connections,
  selectedShapeId,
  isConnecting,
  connectingFromId,
  onAddShape,
  onUpdateShape,
  onDeleteShape,
  onUpdateConnection,
  onShapeClick,
  onDeleteConnection,
  onCanvasClick
}) => {
  const canvasRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/shape-type');
    if (type && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 60; // Center the shape
      const y = e.clientY - rect.top - 30;
      
      // Add new shape using onAddShape
      onAddShape(type, x, y);
    }
  }, [onAddShape]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      onCanvasClick();
    }
  }, [onCanvasClick]);

  return (
    <div className="flex-1 relative">
      <div
        ref={canvasRef}
        className="w-full h-full bg-gray-50 relative overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connections */}
        {connections.map(connection => {
          const fromShape = shapes.find(s => s.id === connection.from);
          const toShape = shapes.find(s => s.id === connection.to);
          
          if (!fromShape || !toShape) return null;
          
          return (
            <ConnectionComponent
              key={connection.id}
              connection={connection}
              fromShape={fromShape}
              toShape={toShape}
              onDelete={onDeleteConnection}
              onUpdate={onUpdateConnection}
            />
          );
        })}

        {/* Shapes */}
        {shapes.map(shape => (
          <ShapeComponent
            key={shape.id}
            shape={shape}
            isSelected={selectedShapeId === shape.id}
            isConnecting={isConnecting}
            isConnectingFrom={connectingFromId === shape.id}
            onUpdate={onUpdateShape}
            onDelete={onDeleteShape}
            onClick={onShapeClick}
          />
        ))}

        {/* Instructions */}
        {shapes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Drag shapes from the toolbar to start</p>
              <p className="text-sm">or use the code editor to create your diagram</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;