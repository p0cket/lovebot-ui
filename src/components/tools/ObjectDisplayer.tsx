import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Copy, Maximize2, Minimize2 } from 'lucide-react';

type ExpandedState = Record<string, boolean>;

const ObjectDisplayer: React.FC = () => {
    const defaultObject = {
        name: "John",
        age: 30,
        address: { street: "123 Main St", city: "Boston" },
        hobbies: ["reading", "gaming", "coding"],
        nested: { deep: { deeper: { deepest: "value" }}}
    };

    const [input, setInput] = useState<string>(JSON.stringify(defaultObject, null, 2));
    const [fontSize, setFontSize] = useState<string>('text-sm');
    const [fontFamily, setFontFamily] = useState<string>('font-mono');
    const [theme, setTheme] = useState<string>('dark');
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [indentSize, setIndentSize] = useState<string>('4');
    const [showTypes] = useState<boolean>(false); // Not used in example, but typed
    const [keyColor, setKeyColor] = useState<string>('text-blue-400');
    const [compactMode, setCompactMode] = useState<boolean>(false);

    useEffect(() => {
        try {
            const parsed: unknown = JSON.parse(input);
            const paths: ExpandedState = {};
            const addPaths = (obj: any, path = ''): void => {
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
        } catch (e) {
            // ignore invalid JSON
        }
    }, [input]);

    const toggleExpand = (path: string) => {
        setExpanded(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    const expandAll = () => {
        const paths: ExpandedState = {};
        const addPaths = (obj: any, path = ''): void => {
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
        } catch (e) {
            // ignore invalid JSON
        }
    };

    const collapseAll = () => {
        setExpanded({});
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const renderValue = (value: any, path = '', level = 0): JSX.Element | string => {
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
            if (entries.length === 0) return <span className="text-gray-400">{'{}'}</span>;
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

    const themeClasses: Record<string, string> = {
        dark: 'bg-gray-900 text-white border-gray-700',
        darker: 'bg-black text-white border-gray-800',
        light: 'bg-white text-black border-gray-200',
        blue: 'bg-blue-900 text-white border-blue-800',
        green: 'bg-green-900 text-white border-green-800',
        purple: 'bg-purple-900 text-white border-purple-800'
    };

    const renderParsedContent = (): JSX.Element | string => {
        try {
            const parsed: any = JSON.parse(input);
            return renderValue(parsed);
        } catch (error: any) {
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
