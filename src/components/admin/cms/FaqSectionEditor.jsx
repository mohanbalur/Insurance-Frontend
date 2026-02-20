import React from 'react';
import ImageUploader from './ImageUploader';
import RepeaterField from './RepeaterField';

const FaqSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    const handleAddItem = () => {
        const faqs = content.faqs || [];
        updateField('faqs', [...faqs, { question: '', answer: '', imageUrl: null }]);
    };

    const handleRemoveItem = (index) => {
        const faqs = [...(content.faqs || [])];
        faqs.splice(index, 1);
        updateField('faqs', faqs);
    };

    const handleMoveItem = (index, direction) => {
        const faqs = [...(content.faqs || [])];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= faqs.length) return;
        [faqs[index], faqs[newIndex]] = [faqs[newIndex], faqs[index]];
        updateField('faqs', faqs);
    };

    const updateItem = (index, field, value) => {
        const faqs = [...(content.faqs || [])];
        faqs[index] = { ...faqs[index], [field]: value };
        updateField('faqs', faqs);
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
                            placeholder="Got questions? We have answers."
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <ImageUploader
                        label="FAQ Accent Image"
                        value={content.imageUrl}
                        onChange={(url) => updateField('imageUrl', url)}
                    />
                </div>
            </div>

            <RepeaterField
                label="Frequently Asked Questions"
                addButtonLabel="Add New FAQ"
                items={content.faqs || []}
                onAdd={handleAddItem}
                onRemove={handleRemoveItem}
                onMove={handleMoveItem}
                renderItem={(item, index) => (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Question</label>
                                    <input
                                        type="text"
                                        value={item.question}
                                        onChange={(e) => updateItem(index, 'question', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                        placeholder="e.g. How do I file a claim?"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Answer</label>
                                    <textarea
                                        value={item.answer}
                                        onChange={(e) => updateItem(index, 'answer', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none"
                                        placeholder="Step-by-step instructions..."
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <ImageUploader
                                    label="FAQ Detail Image"
                                    value={item.imageUrl}
                                    onChange={(url) => updateItem(index, 'imageUrl', url)}
                                    aspectRatio="square"
                                />
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default FaqSectionEditor;
