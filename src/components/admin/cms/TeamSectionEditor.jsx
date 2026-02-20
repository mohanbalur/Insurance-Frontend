import React from 'react';
import RepeaterField from './RepeaterField';

const TeamSectionEditor = ({ content = {}, onChange }) => {
    const updateField = (field, value) => {
        onChange({ ...content, [field]: value });
    };

    const members = content.members || [];

    const handleAddMember = () => {
        updateField('members', [...members, { name: '', role: '' }]);
    };

    const handleRemoveMember = (index) => {
        const next = [...members];
        next.splice(index, 1);
        updateField('members', next);
    };

    const handleMoveMember = (index, direction) => {
        const next = [...members];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= next.length) return;
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        updateField('members', next);
    };

    const updateMember = (index, field, value) => {
        const next = [...members];
        next[index] = { ...next[index], [field]: value };
        updateField('members', next);
    };

    return (
        <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Section Title</label>
                <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Our Team"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                />
            </div>

            <RepeaterField
                label="Team Members"
                addButtonLabel="Add Team Member"
                items={members}
                onAdd={handleAddMember}
                onRemove={handleRemoveMember}
                onMove={handleMoveMember}
                renderItem={(member, index) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Name</label>
                            <input
                                type="text"
                                value={member.name || ''}
                                onChange={(e) => updateMember(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                placeholder="Member name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Role</label>
                            <input
                                type="text"
                                value={member.role || ''}
                                onChange={(e) => updateMember(index, 'role', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                placeholder="Member role"
                            />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default TeamSectionEditor;

