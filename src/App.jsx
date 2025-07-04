import React, { useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import CodeEditor from './components/CodeEditor';
import { useDiagramStore } from './store/useDiagramStore'; // adjust path if needed

function App() {
  const {
    shapes,
    connections,
    mermaidCode,
    setShapes,
    setConnections,
    handleCodeChange,
    updateMermaidCodeIfNotTyping,
  } = useDiagramStore();

  // Replace local shape/connection state with store state
  const [selectedShapeId, setSelectedShapeId] = React.useState(null);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [connectingFromId, setConnectingFromId] = React.useState(null);

  // Initial sample diagram
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
  }, [setShapes, setConnections]);

  // Auto-update code when shapes/connections change
  useEffect(() => {
    updateMermaidCodeIfNotTyping();
  }, [shapes, connections, updateMermaidCodeIfNotTyping]);

  const handleAddShape = (type, x, y) => {
    const newShape = {
      id: `shape_${Date.now()}`,
      type,
      x,
      y,
      width: 120,
      height: 60,
      label: 'New Shape'
    };
    setShapes([...shapes, newShape]);
  };

  const handleUpdateShape = (id, updates) => {
    setShapes(shapes.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteShape = (id) => {
    setShapes(shapes.filter(s => s.id !== id));
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
  };

  const handleUpdateConnection = (id, updates) => {
    setConnections(connections.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDeleteConnection = (id) => {
    setConnections(connections.filter(c => c.id !== id));
  };

  const handleShapeClick = (id) => {
    if (isConnecting && connectingFromId && connectingFromId !== id) {
      const newConn = {
        id: `conn_${Date.now()}`,
        from: connectingFromId,
        to: id,
        label: ''
      };
      setConnections([...connections, newConn]);
      setIsConnecting(false);
      setConnectingFromId(null);
    } else if (isConnecting) {
      setConnectingFromId(id);
    } else {
      setSelectedShapeId(id);
    }
  };

  const handleStartConnection = () => {
    setIsConnecting(true);
    setConnectingFromId(null);
  };

  const handleCancelConnection = () => {
    setIsConnecting(false);
    setConnectingFromId(null);
  };

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

      {/* Main */}
      <div className="flex-1 flex">
        <Toolbar onAddShape={handleAddShape} />
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
          <CodeEditor code={mermaidCode} onChange={handleCodeChange} />
        </div>
      </div>
    </div>
  );
}

export default App;
