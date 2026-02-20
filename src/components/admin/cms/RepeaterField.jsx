import React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Layout } from 'lucide-react';

const RepeaterField = ({
    items = [],
    onAdd,
    onRemove,
    onMove,
    renderItem,
    label = 'Items',
    addButtonLabel = 'Add Item',
    emptyMessage = 'No items added yet.'
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Layout size={14} className="text-[#1E90FF]" />
                    {label} ({items.length})
                </label>
                <button
                    type="button"
                    onClick={onAdd}
                    className="text-xs font-bold text-[#1E90FF] hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                    <Plus size={14} /> {addButtonLabel}
                </button>
            </div>

            {items.length === 0 ? (
                <div className="py-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic bg-slate-50/50">
                    {emptyMessage}
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group hover:border-[#1E90FF]/30 transition-colors"
                        >
                            {/* Controls */}
                            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => onMove(index, -1)}
                                    disabled={index === 0}
                                    className="p-1.5 text-slate-400 hover:text-[#1E90FF] hover:bg-blue-50 rounded-lg disabled:opacity-20"
                                >
                                    <ChevronUp size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onMove(index, 1)}
                                    disabled={index === items.length - 1}
                                    className="p-1.5 text-slate-400 hover:text-[#1E90FF] hover:bg-blue-50 rounded-lg disabled:opacity-20"
                                >
                                    <ChevronDown size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Item Index Badge */}
                            <div className="absolute top-4 left-4 h-6 w-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                                {index + 1}
                            </div>

                            {/* Render Child Content */}
                            <div className="pl-8 pt-2">
                                {renderItem(item, index)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RepeaterField;
