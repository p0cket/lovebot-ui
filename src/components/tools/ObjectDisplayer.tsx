import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Maximize2, Minimize2 } from 'lucide-react';

const ObjectDisplayer = () => {
  const defaultObject = {
    name: "John",
    age: 30,
    address: { street: "123 Main St", city: "Boston" },
    hobbies: ["reading", "gaming", "coding"],
    nested: { deep: { deeper: { deepest: "value" }}}
  };

  const [input, setInput] = useState(JSON.stringify(defaultObject, null, 2));
  const [fontSize, setFontSize] = useState('text-sm');
  const [fontFamily, setFontFamily] = useState('font-mono');
  const [theme, setTheme] = useState('dark');
  const [expanded, setExpanded] = useState({});
  const [indentSize, setIndentSize] = useState('4');
  const [showTypes, setShowTypes] = useState(false);
  const [keyColor, setKeyColor] = useState('text-blue-400');
  const [compactMode, setCompactMode] = useState(false);

  // Initialize expanded state for all paths
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      const paths = {};
      const addPaths = (obj, path = '') => {
        if (typeof obj !== 'object' || obj === null) return;
        paths[path] = true;
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => addPaths(item, `${path}.${index}`));
        } else {
          Object.entries(obj).forEach(([key, value]) => addPaths(value, `${path}.${key}`));
        }
      };
      addPaths(parsed);
      setExpanded(paths);
    } catch (e) {}
  }, []);

  const toggleExpand = (path) => {
    setExpanded(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const expandAll = () => {
    const paths = {};
    const addPaths = (obj, path = '') => {
      if (typeof obj !== 'object' || obj === null) return;
      paths[path] = true;
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => addPaths(item, `${path}.${index}`));
      } else {
        Object.entries(obj).forEach(([key, value]) => addPaths(value, `${path}.${key}`));
      }
    };
    try {
      addPaths(JSON.parse(input));
      setExpanded(paths);
    } catch (e) {}
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderType = (value) => {
    if (!showTypes) return null;
    const type = Array.isArray(value) ? 'array' : typeof value;
    return <span className="text-gray-500 text-xs ml-2">({type})</span>;
  };

  const renderValue = (value, path = '', level = 0) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'boolean') return <span className="text-purple-400">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="text-green-400">{value}</span>;
    if (typeof value === 'string') return <span className="text-yellow-400">"{value}"</span>;
    
    if (Array.isArray(value)) {
      const isExpanded = expanded[path];
      if (value.length === 0) return <span className="text-gray-400">[ ]</span>;
      
      return (
        <div className={`ml-${indentSize}`}>
          <span 
            onClick={() => toggleExpand(path)}
            className="cursor-pointer hover:bg-gray-700 rounded px-1"
          >
            {isExpanded ? <ChevronDown className="inline w-4 h-4" /> : <ChevronRight className="inline w-4 h-4" />}
            <span className="text-gray-400">[</span> <span className="text-gray-500 text-xs">{value.length}</span>
          </span>
          {isExpanded && (
            <div className={`ml-${indentSize} ${compactMode ? 'py-0' : 'py-1'}`}>
              {value.map((item, index) => (
                <div key={index} className={compactMode ? 'leading-tight' : 'leading-relaxed'}>
                  <span className="text-gray-500">{index}</span>: {renderValue(item, `${path}.${index}`, level + 1)}
                </div>
              ))}
            </div>
          )}
          <div className={`ml-${indentSize}`}><span className="text-gray-400">]</span></div>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const isExpanded = expanded[path];
      const entries = Object.entries(value);
      if (entries.length === 0) return <span className="text-gray-400">{ }</span>;
      
      return (
        <div className={`ml-${indentSize}`}>
          <span 
            onClick={() => toggleExpand(path)}
            className="cursor-pointer hover:bg-gray-700 rounded px-1"
          >
            {isExpanded ? <ChevronDown className="inline w-4 h-4" /> : <ChevronRight className="inline w-4 h-4" />}
            <span className="text-gray-400">{'{'}</span>
          </span>
          {isExpanded && (
            <div className={`ml-${indentSize} ${compactMode ? 'py-0' : 'py-1'}`}>
              {entries.map(([key, val]) => (
                <div key={key} className={compactMode ? 'leading-tight' : 'leading-relaxed'}>
                  <span className={keyColor}>{key}</span>: {renderValue(val, `${path}.${key}`, level + 1)}
                </div>
              ))}
            </div>
          )}
          <div className={`ml-${indentSize}`}><span className="text-gray-400">{'}'}</span></div>
        </div>
      );
    }
    
    return String(value);
  };

  const themeClasses = {
    dark: 'bg-gray-900 text-white border-gray-700',
    darker: 'bg-black text-white border-gray-800',
    light: 'bg-white text-black border-gray-200',
    blue: 'bg-blue-900 text-white border-blue-800',
    green: 'bg-green-900 text-white border-green-800',
    purple: 'bg-purple-900 text-white border-purple-800'
  };

  const renderParsedContent = () => {
    try {
      const parsed = JSON.parse(input);
      return renderValue(parsed);
    } catch (error) {
      return <div className="text-red-500">Invalid JSON: {error.message}</div>;
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 bg-gray-800 rounded-lg">
      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 font-mono text-sm"
          placeholder="Paste your object here (as JSON)"
        />
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex gap-2">
          <button 
            onClick={expandAll}
            className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-700 border-gray-600 text-white"
          >
            <Maximize2 className="w-4 h-4" /> Expand All
          </button>
          <button 
            onClick={collapseAll}
            className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-700 border-gray-600 text-white"
          >
            <Minimize2 className="w-4 h-4" /> Collapse All
          </button>
          <button 
            onClick={() => copyToClipboard(input)}
            className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-700 border-gray-600 text-white"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
        
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
          className="border rounded p-1 bg-gray-900 text-white border-gray-700"
        >
          <option value="text-xs">XS</option>
          <option value="text-sm">SM</option>
          <option value="text-base">MD</option>
          <option value="text-lg">LG</option>
        </select>
        
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          className="border rounded p-1 bg-gray-900 text-white border-gray-700"
        >
          <option value="dark">Dark</option>
          <option value="darker">Darker</option>
          <option value="light">Light</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
        
        <select 
          value={keyColor} 
          onChange={(e) => setKeyColor(e.target.value)}
          className="border rounded p-1 bg-gray-900 text-white border-gray-700"
        >
          <option value="text-blue-400">Blue</option>
          <option value="text-green-400">Green</option>
          <option value="text-purple-400">Purple</option>
          <option value="text-yellow-400">Yellow</option>
          <option value="text-white">White</option>
        </select>

        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={compactMode}
            onChange={(e) => setCompactMode(e.target.checked)}
            className="rounded border-gray-700"
          />
          Compact
        </label>
      </div>
      
      <div className={`border rounded p-4 ${themeClasses[theme]} ${fontSize} ${fontFamily}`}>
        {renderParsedContent()}
      </div>
    </div>
  );
};

export default ObjectDisplayer;