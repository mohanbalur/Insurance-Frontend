import React from 'react';
import RepeaterField from './RepeaterField';

const PressSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    const releases = content.releases || [];

    const handleAddRelease = () => {
        updateField('releases', [...releases, { title: '', summary: '', date: '' }]);
    };

    const handleRemoveRelease = (index) => {
        const next = [...releases];
        next.splice(index, 1);
        updateField('releases', next);
    };

    const handleMoveRelease = (index, direction) => {
        const next = [...releases];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= next.length) return;
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        updateField('releases', next);
    };

    const updateRelease = (index, field, value) => {
        const next = [...releases];
        next[index] = { ...next[index], [field]: value };
        updateField('releases', next);
    };

    return (
        <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Title</label>
                <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Press Releases"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>

            <RepeaterField
                label="Press Releases"
                addButtonLabel="Add Press Release"
                items={releases}
                onAdd={handleAddRelease}
                onRemove={handleRemoveRelease}
                onMove={handleMoveRelease}
                renderItem={(item, index) => (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                                <input
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => updateRelease(index, 'title', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                    placeholder="Release title"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                                <input
                                    type="date"
                                    value={item.date || ''}
                                    onChange={(e) => updateRelease(index, 'date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Summary</label>
                            <textarea
                                value={item.summary || ''}
                                onChange={(e) => updateRelease(index, 'summary', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                placeholder="Release summary"
                            />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default PressSectionEditor;

