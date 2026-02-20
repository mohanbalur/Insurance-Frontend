import React from 'react';

const CareersSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Title</label>
                <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Careers"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Content</label>
                <textarea
                    value={content.content || content.description || ''}
                    onChange={(e) => {
                        updateField('content', e.target.value);
                        updateField('description', e.target.value);
                    }}
                    rows={5}
                    placeholder="Share hiring details, culture, and how to apply..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>
        </div>
    );
};

export default CareersSectionEditor;

