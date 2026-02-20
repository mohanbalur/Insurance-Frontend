import React, { useState, useEffect } from 'react';

const CustomJsonEditor = ({ value, onChange }) => {
    const [localContent, setLocalContent] = useState(
        typeof value === 'object' ? JSON.stringify(value, null, 2) : '{}'
    );
    const [error, setError] = useState(null);

    // Sync if external value changes (rare but possible)
    useEffect(() => {
        const stringified = typeof value === 'object' ? JSON.stringify(value, null, 2) : '{}';
        if (stringified !== localContent) {
            setLocalContent(stringified);
        }
    }, [value]);

    const handleBlur = () => {
        try {
            const parsed = JSON.parse(localContent);
            setError(null);
            onChange(parsed);
        } catch (e) {
            setError('Invalid JSON syntax. Changes not saved.');
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    Raw Section Content (Advanced)
                </label>
                {error && <span className="text-[10px] text-red-500 animate-pulse font-medium">{error}</span>}
            </div>
            <textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                onBlur={handleBlur}
                rows={12}
                className={`w-full px-4 py-3 rounded-xl border font-mono text-xs transition-all focus:outline-none focus:ring-2 ${error
                        ? 'border-red-200 bg-red-50/30 ring-red-100'
                        : 'border-slate-200 bg-white text-[#0B1F3A] focus:ring-[#1E90FF] focus:border-[#1E90FF]'
                    }`}
                placeholder='{ "key": "value" }'
            />
            <p className="text-[10px] text-slate-500 italic">
                Careful: JSON changes are applied directly to the database. Use this mode only for custom configurations or unknown section types.
            </p>
        </div>
    );
};

export default CustomJsonEditor;
