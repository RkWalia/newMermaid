import React, { useState, useCallback, useRef } from 'react';
import { Trash2, Edit3 } from 'lucide-react';

const ShapeComponent = ({
  shape,
  isSelected,
  isConnecting,
  isConnectingFrom,
  onUpdate,
  onDelete,
  onClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(shape.label);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const shapeRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target !== e.currentTarget && !e.target.closest('.shape-content')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - shape.x,
      y: e.clientY - shape.y
    });
  }, [shape.x, shape.y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    onUpdate(shape.id, { x: newX, y: newY });
  }, [isDragging, dragStart, shape.id, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onClick(shape.id);
  }, [onClick, shape.id]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(shape.id);
  }, [onDelete, shape.id]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleLabelSubmit = useCallback(() => {
    onUpdate(shape.id, { label: editLabel });
    setIsEditing(false);
  }, [shape.id, editLabel, onUpdate]);

  const handleLabelKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setEditLabel(shape.label);
      setIsEditing(false);
    }
  }, [handleLabelSubmit, shape.label]);

  const renderShape = () => {
    const commonProps = {
      className: 'shape-content w-full h-full',
      fill: isConnectingFrom ? '#3b82f6' : isSelected ? '#dbeafe' : 'white',
      stroke: isConnectingFrom ? '#1d4ed8' : isSelected ? '#3b82f6' : '#6b7280',
      strokeWidth: isSelected || isConnectingFrom ? 2 : 1
    };

    switch (shape.type) {
      case 'rectangle':
        return (
          <rect
            {...commonProps}
            width={shape.width}
            height={shape.height}
            rx={8}
          />
        );
      case 'circle':
        return (
          <ellipse
            {...commonProps}
            cx={shape.width / 2}
            cy={shape.height / 2}
            rx={shape.width / 2}
            ry={shape.height / 2}
          />
        );
      case 'diamond':
        return (
          <polygon
            {...commonProps}
            points={`${shape.width / 2},0 ${shape.width},${shape.height / 2} ${shape.width / 2},${shape.height} 0,${shape.height / 2}`}
          />
        );
      case 'oval':
        return (
          <ellipse
            {...commonProps}
            cx={shape.width / 2}
            cy={shape.height / 2}
            rx={shape.width / 2}
            ry={shape.height / 2}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={shapeRef}
      className={`absolute cursor-move select-none group ${
        isConnecting ? 'cursor-pointer' : ''
      } ${isConnectingFrom ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.width,
        height: shape.height
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <svg width={shape.width} height={shape.height} className="absolute inset-0">
        {renderShape()}
      </svg>
      
      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isEditing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyDown={handleLabelKeyDown}
            className="text-sm font-medium text-center bg-transparent border-none outline-none pointer-events-auto"
            style={{ width: `${Math.max(editLabel.length * 8, 60)}px` }}
            autoFocus
          />
        ) : (
          <span className="text-sm font-medium text-gray-800 px-2 text-center">
            {shape.label}
          </span>
        )}
      </div>

      {/* Controls */}
      {isSelected && !isConnecting && (
        <div className="absolute -top-10 left-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShapeComponent;