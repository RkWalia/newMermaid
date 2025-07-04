import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Copy, Check, Code } from 'lucide-react';

const CodeEditor = ({ code, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-96'
    }`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-blue-400" />
            {!isCollapsed && (
              <h3 className="text-lg font-semibold">Mermaid Code</h3>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isCollapsed && (
              <button
                onClick={handleCopy}
                className="p-2 rounded hover:bg-gray-700 transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded hover:bg-gray-700 transition-colors"
              title={isCollapsed ? 'Expand editor' : 'Collapse editor'}
            >
              <Code className={`w-4 h-4 transition-transform ${
                isCollapsed ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 h-full">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            className="w-full h-full bg-gray-800 text-white p-4 rounded-lg border border-gray-600 focus:border-blue-400 focus:outline-none font-mono text-sm resize-none"
            placeholder="Enter your Mermaid diagram code here..."
            style={{ minHeight: '200px' }}
            spellCheck={false}
          />
          
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Reference:</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>• graph TD - Top Down</div>
              <div>• A[Rectangle] - Rectangle shape</div>
              <div>• B(Circle) - Circle shape</div>
              <div>• C&#123;Diamond&#125; - Diamond shape</div>
              <div>• A --&gt; B - Connection</div>
              <div>• A --&gt;|Label| B - Labeled connection</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;