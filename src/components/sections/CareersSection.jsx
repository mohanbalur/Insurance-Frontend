import React from 'react';

const CareersSection = ({ data }) => {
    const content = data?.content || {};
    const title = (typeof content === 'object' ? content.title : '') || data?.title || 'Careers';
    const positions = typeof content === 'object' && Array.isArray(content.positions) ? content.positions : [];
    const description = typeof content === 'string'
        ? content
        : (content.content || content.description || 'Explore opportunities to build your career with us.');

    return (
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4 md:mb-5">
                {title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-5 leading-relaxed">
                {description}
            </p>
            <button className="bg-[#1E90FF] text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
                View Open Positions
            </button>

            {positions.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-left">
                    {positions.map((job, idx) => (
                        <article key={`${job.title || 'job'}-${idx}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                            <h3 className="text-lg font-semibold text-[#0B1F3A]">{job.title || 'Open Role'}</h3>
                            <p className="text-gray-500 mt-1">{job.location || ''}</p>
                            <p className="text-gray-600 mt-2">{job.summary || ''}</p>
                        </article>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default CareersSection;
