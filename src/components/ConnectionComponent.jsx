import React, { useState, useCallback } from 'react';
import { X, Edit3 } from 'lucide-react';

const ConnectionComponent = ({
  connection,
  fromShape,
  toShape,
  onDelete,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(connection.label || '');

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(connection.id);
  }, [connection.id, onDelete]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditLabel(connection.label || '');
  }, [connection.label]);

  const handleLabelSubmit = useCallback(() => {
    onUpdate(connection.id, { label: editLabel });
    setIsEditing(false);
  }, [connection.id, editLabel, onUpdate]);

  const handleLabelKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setEditLabel(connection.label || '');
      setIsEditing(false);
    }
  }, [handleLabelSubmit, connection.label]);

  // Calculate connection points
  const fromX = fromShape.x + fromShape.width / 2;
  const fromY = fromShape.y + fromShape.height / 2;
  const toX = toShape.x + toShape.width / 2;
  const toY = toShape.y + toShape.height / 2;

  // Calculate arrow angle
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowLength = 10;
  const arrowAngle = Math.PI / 6;

  // Arrow points
  const arrowX1 = toX - arrowLength * Math.cos(angle - arrowAngle);
  const arrowY1 = toY - arrowLength * Math.sin(angle - arrowAngle);
  const arrowX2 = toX - arrowLength * Math.cos(angle + arrowAngle);
  const arrowY2 = toY - arrowLength * Math.sin(angle + arrowAngle);

  // Label position (middle of the line)
  const labelX = (fromX + toX) / 2;
  const labelY = (fromY + toY) / 2;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#6b7280"
          />
        </marker>
      </defs>
      
      {/* Connection line */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="#6b7280"
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${connection.id})`}
        className="hover:stroke-blue-500 transition-colors"
      />

      {/* Label background and text */}
      {(connection.label || isEditing) && (
        <g className="pointer-events-auto">
          {/* Label background */}
          <rect
            x={labelX - (isEditing ? 60 : Math.max(connection.label?.length * 4 || 0, 20))}
            y={labelY - 12}
            width={isEditing ? 120 : Math.max(connection.label?.length * 8 || 0, 40)}
            height="24"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
            rx="4"
            className="drop-shadow-sm"
          />
          
          {/* Label text or input */}
          {isEditing ? (
            <foreignObject
              x={labelX - 60}
              y={labelY - 10}
              width="120"
              height="20"
            >
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={handleLabelSubmit}
                onKeyDown={handleLabelKeyDown}
                className="w-full text-xs text-center bg-transparent border-none outline-none font-medium text-gray-800"
                autoFocus
                placeholder="Enter label"
              />
            </foreignObject>
          ) : (
            <text
              x={labelX}
              y={labelY + 3}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-800 select-none cursor-pointer"
              onClick={handleEditClick}
            >
              {connection.label}
            </text>
          )}
        </g>
      )}

      {/* Control buttons */}
      <g className="pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        {/* Edit button */}
        <circle
          cx={labelX - 15}
          cy={labelY}
          r="10"
          fill="white"
          stroke="#6b7280"
          strokeWidth="1"
          className="hover:stroke-blue-500 hover:fill-blue-50 transition-colors cursor-pointer"
          onClick={handleEditClick}
        />
        <Edit3
          x={labelX - 19}
          y={labelY - 4}
          width="8"
          height="8"
          className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer pointer-events-none"
        />

        {/* Delete button */}
        <circle
          cx={labelX + 15}
          cy={labelY}
          r="10"
          fill="white"
          stroke="#6b7280"
          strokeWidth="1"
          className="hover:stroke-red-500 hover:fill-red-50 transition-colors cursor-pointer"
          onClick={handleDelete}
        />
        <X
          x={labelX + 11}
          y={labelY - 4}
          width="8"
          height="8"
          className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer pointer-events-none"
        />
      </g>

      {/* Add label button (when no label exists) */}
      {!connection.label && !isEditing && (
        <g className="pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
          <circle
            cx={labelX}
            cy={labelY}
            r="12"
            fill="white"
            stroke="#6b7280"
            strokeWidth="1"
            className="hover:stroke-blue-500 hover:fill-blue-50 transition-colors cursor-pointer"
            onClick={handleEditClick}
          />
          <text
            x={labelX}
            y={labelY + 3}
            textAnchor="middle"
            className="text-xs font-medium fill-gray-600 hover:fill-blue-500 transition-colors cursor-pointer pointer-events-none"
          >
            +
          </text>
        </g>
      )}
    </svg>
  );
};

export default ConnectionComponent;