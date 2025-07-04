import React, { useState, useCallback, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import CodeEditor from './components/CodeEditor';
import { generateMermaidCode, parseMermaidCode } from './utils/mermaidParser';

function App() {
  const [shapes, setShapes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [mermaidCode, setMermaidCode] = useState('graph TD\n  A[Start] --> B[Process]\n  B --> C[End]');
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFromId, setConnectingFromId] = useState(null);

  // Initialize with sample diagram
  useEffect(() => {
    const initialShapes = [
      { id: 'A', type: 'rectangle', x: 100, y: 100, width: 120, height: 60, label: 'Start' },
      { id: 'B', type: 'rectangle', x: 300, y: 100, width: 120, height: 60, label: 'Process' },
      { id: 'C', type: 'rectangle', x: 500, y: 100, width: 120, height: 60, label: 'End' }
    ];
    const initialConnections = [
      { id: 'conn1', from: 'A', to: 'B', label: '' },
      { id: 'conn2', from: 'B', to: 'C', label: '' }
    ];
    setShapes(initialShapes);
    setConnections(initialConnections);
  }, []);

  // Update mermaid code when shapes or connections change
  useEffect(() => {
    const newCode = generateMermaidCode(shapes, connections);
    setMermaidCode(newCode);
  }, [shapes, connections]);

  const handleAddShape = useCallback((type, x, y) => {
    const newShape = {
      id: `shape_${Date.now()}`,
      type,
      x,
      y,
      width: 120,
      height: 60,
      label: 'New Shape'
    };
    setShapes(prev => [...prev, newShape]);
  }, []);

  const handleUpdateShape = useCallback((id, updates) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  }, []);

  const handleDeleteShape = useCallback((id) => {
    setShapes(prev => prev.filter(shape => shape.id !== id));
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id));
  }, []);

  const handleUpdateConnection = useCallback((id, updates) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, ...updates } : conn
    ));
  }, []);

  const handleShapeClick = useCallback((id) => {
    if (isConnecting && connectingFromId && connectingFromId !== id) {
      // Create connection
      const newConnection = {
        id: `conn_${Date.now()}`,
        from: connectingFromId,
        to: id,
        label: ''
      };
      setConnections(prev => [...prev, newConnection]);
      setIsConnecting(false);
      setConnectingFromId(null);
    } else if (isConnecting) {
      // Start connecting from this shape
      setConnectingFromId(id);
    } else {
      // Select shape
      setSelectedShapeId(id);
    }
  }, [isConnecting, connectingFromId]);

  const handleStartConnection = useCallback(() => {
    setIsConnecting(true);
    setConnectingFromId(null);
  }, []);

  const handleCancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectingFromId(null);
  }, []);

  const handleDeleteConnection = useCallback((id) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
  }, []);

  const handleCodeChange = useCallback((newCode) => {
    setMermaidCode(newCode);
    try {
      const parsed = parseMermaidCode(newCode);
      setShapes(parsed.shapes);
      setConnections(parsed.connections);
    } catch (error) {
      console.warn('Failed to parse mermaid code:', error);
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mermaid Chart Editor</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStartConnection}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isConnecting 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isConnecting ? 'Connecting...' : 'Connect Shapes'}
            </button>
            {isConnecting && (
              <button
                onClick={handleCancelConnection}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Toolbar */}
        <Toolbar onAddShape={handleAddShape} />

        {/* Canvas */}
        <div className="flex-1 flex">
          <Canvas
            shapes={shapes}
            connections={connections}
            selectedShapeId={selectedShapeId}
            isConnecting={isConnecting}
            connectingFromId={connectingFromId}
            onAddShape={handleAddShape}
            onUpdateShape={handleUpdateShape}
            onDeleteShape={handleDeleteShape}
            onUpdateConnection={handleUpdateConnection}
            onShapeClick={handleShapeClick}
            onDeleteConnection={handleDeleteConnection}
            onCanvasClick={() => setSelectedShapeId(null)}
          />

          {/* Code Editor */}
          <CodeEditor
            code={mermaidCode}
            onChange={handleCodeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;