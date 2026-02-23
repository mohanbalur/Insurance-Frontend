import React from 'react';

const PressSection = ({ data }) => {
    const content = data?.content || {};
    const title = (typeof content === 'object' ? content.title : '') || data?.title || 'Press Releases';
    const releases = typeof content === 'object' && Array.isArray(content.releases) ? content.releases : [];
    const description = typeof content === 'string' ? content : (content.description || '');

    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-6 md:mb-7 text-center">{title}</h2>
            {description ? <p className="text-base md:text-lg text-gray-600 text-center mb-5 md:mb-6">{description}</p> : null}

            {releases.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                    {releases.map((item, idx) => (
                        <article key={`${item.title || 'release'}-${idx}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-[#0B1F3A]">{item.title || 'Release'}</h3>
                                {item.date ? (
                                    <span className="text-[11px] text-slate-500 whitespace-nowrap">{item.date}</span>
                                ) : null}
                            </div>
                            <p className="text-gray-600">{item.summary || item.description || ''}</p>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600 text-center">Press announcements will be published here.</p>
            )}
        </div>
    );
};

export default PressSection;
