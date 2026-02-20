import React from 'react';
import ImageUploader from './ImageUploader';

const HeroSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    const updateNestedField = (parent, field, value) => {
        onChange({
            ...content,
            [parent]: {
                ...(content[parent] || {}),
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Hero Subtitle / Description</label>
                        <textarea
                            value={content.subtitle || ''}
                            onChange={(e) => updateField('subtitle', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition-all"
                            placeholder="Hook your visitors with a compelling tagline..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <ImageUploader
                        label="Background Banner Image"
                        value={content.imageUrl}
                        onChange={(url) => updateField('imageUrl', url)}
                    />
                </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Call to Action Buttons</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Button */}
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                        <div className="text-[10px] font-bold text-[#1E90FF] uppercase">Primary Button</div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-slate-500">Label</label>
                                <input
                                    type="text"
                                    value={content.primaryBtn?.label || ''}
                                    onChange={(e) => updateNestedField('primaryBtn', 'label', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-slate-500">URL</label>
                                <input
                                    type="text"
                                    value={content.primaryBtn?.url || ''}
                                    onChange={(e) => updateNestedField('primaryBtn', 'url', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Secondary Button</div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-slate-500">Label</label>
                                <input
                                    type="text"
                                    value={content.secondaryBtn?.label || ''}
                                    onChange={(e) => updateNestedField('secondaryBtn', 'label', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-slate-500">URL</label>
                                <input
                                    type="text"
                                    value={content.secondaryBtn?.url || ''}
                                    onChange={(e) => updateNestedField('secondaryBtn', 'url', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSectionEditor;
