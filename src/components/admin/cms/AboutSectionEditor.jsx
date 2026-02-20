import React from 'react';

const AboutSectionEditor = ({ content = {}, onChange }) => {
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
                    placeholder="About Us"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                    value={content.description || content.content || ''}
                    onChange={(e) => {
                        updateField('description', e.target.value);
                        updateField('content', e.target.value);
                    }}
                    rows={5}
                    placeholder="Tell visitors about your company..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>
        </div>
    );
};

export default AboutSectionEditor;

