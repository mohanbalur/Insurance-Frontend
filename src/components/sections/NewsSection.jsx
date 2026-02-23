import React from 'react';

const NewsSection = ({ data }) => {
    const content = data?.content || {};
    const title = (typeof content === 'object' ? content.title : '') || data?.title || 'News & Blog';
    const items = typeof content === 'object' && Array.isArray(content.items) ? content.items : [];
    const subtitle = typeof content === 'object' ? content.subtitle || '' : '';

    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-6 md:mb-7 text-center">{title}</h2>
            {subtitle ? <p className="text-base md:text-lg text-gray-600 text-center mb-5 md:mb-6">{subtitle}</p> : null}

            {items.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                    {items.map((item, idx) => (
                        <article key={`${item.title || 'news'}-${idx}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                            <h3 className="text-lg font-semibold text-[#0B1F3A]">
                                {item.title || 'News Item'}
                            </h3>
                            <p className="text-gray-600 mt-2">
                                {item.summary || item.description || ''}
                            </p>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600 text-center">Latest updates will appear here soon.</p>
            )}
        </div>
    );
};

export default NewsSection;
