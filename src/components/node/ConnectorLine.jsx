import React from 'react';

const ConnectorLine = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  isDashed = false,
  isSelected = false,
  onClick,
  className = ""
}) => {
  // Calculate control points for the curved line
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Create curved path starting from exact click position
  const path = `M ${startX} ${startY} Q ${midX} ${startY}, ${midX} ${midY} T ${endX} ${endY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'all',
        zIndex: 10
      }}
      onClick={onClick}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={isSelected ? "#3b82f6" : "#000"} />
        </marker>
      </defs>
      <path
        d={path}
        stroke={isSelected ? "#3b82f6" : "#000"}
        strokeWidth={isSelected ? "3" : "2"}
        strokeDasharray={isDashed ? "5,5" : "none"}
        fill="none"
        markerEnd="url(#arrowhead)"
        className={className}
      />
    </svg>
  );
};

export default ConnectorLine;