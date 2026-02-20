import React from 'react';
import RepeaterField from './RepeaterField';

const NewsSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    const items = content.items || [];

    const handleAddItem = () => {
        updateField('items', [...items, { title: '', summary: '' }]);
    };

    const handleRemoveItem = (index) => {
        const next = [...items];
        next.splice(index, 1);
        updateField('items', next);
    };

    const handleMoveItem = (index, direction) => {
        const next = [...items];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= next.length) return;
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        updateField('items', next);
    };

    const updateItem = (index, field, value) => {
        const next = [...items];
        next[index] = { ...next[index], [field]: value };
        updateField('items', next);
    };

    return (
        <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Title</label>
                <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="News & Blog"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>

            <RepeaterField
                label="Articles"
                addButtonLabel="Add Article"
                items={items}
                onAdd={handleAddItem}
                onRemove={handleRemoveItem}
                onMove={handleMoveItem}
                renderItem={(item, index) => (
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Article Title</label>
                            <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                placeholder="Article title"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Summary</label>
                            <textarea
                                value={item.summary || ''}
                                onChange={(e) => updateItem(index, 'summary', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                placeholder="Short summary"
                            />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default NewsSectionEditor;

