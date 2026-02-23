import React from 'react';

const AboutSection = ({ data }) => {
    const content = data?.content || {};
    const title = (typeof content === 'object' ? content.title : '') || data?.title || 'About Us';
    const subtitle = typeof content === 'object' ? content.subtitle || '' : '';
    const description = typeof content === 'string'
        ? content
        : (content.description || content.content || content.text || '');

    return (
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4 md:mb-5">
                {title}
            </h2>
            {subtitle ? (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-3">
                    {subtitle}
                </p>
            ) : null}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default AboutSection;
