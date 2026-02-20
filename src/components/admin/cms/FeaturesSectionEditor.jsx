import React from 'react';
import ImageUploader from './ImageUploader';
import RepeaterField from './RepeaterField';

const FeaturesSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    const handleAddItem = () => {
        const items = content.items || [];
        updateField('items', [...items, { title: '', description: '', iconName: 'Activity', accentColor: '#1E90FF', imageUrl: null }]);
    };

    const handleRemoveItem = (index) => {
        const items = [...(content.items || [])];
        items.splice(index, 1);
        updateField('items', items);
    };

    const handleMoveItem = (index, direction) => {
        const items = [...(content.items || [])];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= items.length) return;
        [items[index], items[newIndex]] = [items[newIndex], items[index]];
        updateField('items', items);
    };

    const updateItem = (index, field, value) => {
        const items = [...(content.items || [])];
        items[index] = { ...items[index], [field]: value };
        updateField('items', items);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Section Subtitle</label>
                        <textarea
                            value={content.subtitle || ''}
                            onChange={(e) => updateField('subtitle', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none resize-none"
                            placeholder="Why choose our services?"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <ImageUploader
                        label="Section Side Image"
                        value={content.imageUrl}
                        onChange={(url) => updateField('imageUrl', url)}
                    />
                </div>
            </div>

            <RepeaterField
                label="Feature Highlights"
                addButtonLabel="Add New Feature"
                items={content.items || []}
                onAdd={handleAddItem}
                onRemove={handleRemoveItem}
                onMove={handleMoveItem}
                renderItem={(item, index) => (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Feature Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                        placeholder="e.g. 24/7 Support"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none resize-none"
                                        placeholder="Brief explanation..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Icon Name</label>
                                        <input
                                            type="text"
                                            value={item.iconName}
                                            onChange={(e) => updateItem(index, 'iconName', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                            placeholder="Activity, Shield, Star..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Accent Color</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={item.accentColor}
                                                onChange={(e) => updateItem(index, 'accentColor', e.target.value)}
                                                className="h-8 w-12 rounded border border-slate-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={item.accentColor}
                                                onChange={(e) => updateItem(index, 'accentColor', e.target.value)}
                                                className="flex-1 px-3 py-1 rounded-lg border border-slate-300 text-xs outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <ImageUploader
                                    label="Feature Image"
                                    value={item.imageUrl}
                                    onChange={(url) => updateItem(index, 'imageUrl', url)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default FeaturesSectionEditor;
