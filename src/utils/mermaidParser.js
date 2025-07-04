export const generateMermaidCode = (shapes, connections) => {
  if (shapes.length === 0) return 'graph TD\n  %% Add shapes to generate code';

  let code = 'graph TD\n';
  
  // Add shape definitions
  shapes.forEach(shape => {
    let shapeCode = '';
    const label = shape.label || 'Shape';
    
    switch (shape.type) {
      case 'rectangle':
        shapeCode = `  ${shape.id}[${label}]`;
        break;
      case 'circle':
        shapeCode = `  ${shape.id}((${label}))`;
        break;
      case 'diamond':
        shapeCode = `  ${shape.id}{${label}}`;
        break;
      case 'oval':
        shapeCode = `  ${shape.id}(${label})`;
        break;
      default:
        shapeCode = `  ${shape.id}[${label}]`;
    }
    
    code += shapeCode + '\n';
  });
  
  // Add connections
  connections.forEach(connection => {
    const label = connection.label && connection.label.trim() ? `|${connection.label}|` : '';
    code += `  ${connection.from} -->${label} ${connection.to}\n`;
  });
  
  return code;
};

export const parseMermaidCode = (code) => {
  const shapes = [];
  const connections = [];
  
  const lines = code.split('\n');
  let currentX = 100;
  let currentY = 100;
  const spacing = 200;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines, comments, and graph declaration
    if (!trimmed || trimmed.startsWith('%%') || trimmed.startsWith('graph')) {
      continue;
    }
    
    // Parse shape definitions
    const shapeMatch = trimmed.match(/^(\w+)(\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\}|\(\(([^)]+)\)\))/);
    if (shapeMatch) {
      const id = shapeMatch[1];
      const label = shapeMatch[3] || shapeMatch[4] || shapeMatch[5] || shapeMatch[6] || id;
      
      let type = 'rectangle';
      if (shapeMatch[2].startsWith('((')) type = 'circle';
      else if (shapeMatch[2].startsWith('{')) type = 'diamond';
      else if (shapeMatch[2].startsWith('(')) type = 'oval';
      
      if (!shapes.find(s => s.id === id)) {
        shapes.push({
          id,
          type,
          x: currentX,
          y: currentY,
          width: 120,
          height: 60,
          label
        });
        
        currentX += spacing;
        if (currentX > 800) {
          currentX = 100;
          currentY += 120;
        }
      }
    }
    
    // Parse connections with labels
    const connectionMatch = trimmed.match(/^(\w+)\s*-->\s*(\|([^|]+)\|)?\s*(\w+)/);
    if (connectionMatch) {
      const from = connectionMatch[1];
      const to = connectionMatch[4];
      const label = connectionMatch[3] || '';
      
      connections.push({
        id: `conn_${from}_${to}_${Date.now()}`,
        from,
        to,
        label: label.trim()
      });
    }
  }
  
  return { shapes, connections };
};