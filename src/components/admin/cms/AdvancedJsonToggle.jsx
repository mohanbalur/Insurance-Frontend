import React from 'react';
import { Code, Layout } from 'lucide-react';

const AdvancedJsonToggle = ({ mode, onChange }) => {
    return (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                {mode === 'structured' ? (
                    <><Layout size={10} /> Structured UI Mode active</>
                ) : (
                    <><Code size={10} className="text-amber-500" /> Advanced JSON Editing Mode</>
                )}
            </div>
            <button
                type="button"
                onClick={() => onChange(mode === 'structured' ? 'json' : 'structured')}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-colors ${mode === 'json'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
            >
                {mode === 'json' ? 'Switch to UI' : 'Switch to JSON'}
            </button>
        </div>
    );
};

export default AdvancedJsonToggle;
