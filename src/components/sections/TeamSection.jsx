import React from 'react';

const TeamSection = ({ data }) => {
    const content = data?.content || {};
    const title = (typeof content === 'object' ? content.title : '') || data?.title || 'Our Team';
    const members = typeof content === 'object' && Array.isArray(content.members) ? content.members : [];
    const fallbackText = typeof content === 'string'
        ? content
        : (content.description || 'Meet the people behind our insurance expertise.');

    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0B1F3A] mb-6 md:mb-7">
                {title}
            </h2>
            {members.length === 0 ? (
                <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">{fallbackText}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {members.map((member, idx) => (
                        <article
                            key={`${member.name || 'member'}-${idx}`}
                            className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 text-center hover:shadow-md transition"
                        >
                            <h3 className="text-xl font-semibold text-[#0B1F3A]">
                                {member.name || 'Team Member'}
                            </h3>
                            <p className="text-gray-500 mt-2">
                                {member.role || 'Role'}
                            </p>
                            {member.bio ? (
                                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{member.bio}</p>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamSection;
