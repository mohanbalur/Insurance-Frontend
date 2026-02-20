import React from 'react';
import Hero from './Hero';
import FeaturesGrid from './FeaturesGrid';
import FAQ from './FAQ';
import AboutSection from './sections/AboutSection';
import TeamSection from './sections/TeamSection';
import CareersSection from './sections/CareersSection';
import NewsSection from './sections/NewsSection';
import PressSection from './sections/PressSection';

const DynamicSectionRenderer = ({ section }) => {
    switch (section.type) {
        case 'hero':
            return <Hero data={section} />;
        case 'features':
            return <FeaturesGrid data={section} />;
        case 'faq':
            return <FAQ data={section} />;
        case 'about':
            return <AboutSection data={section} />;
        case 'team':
            return <TeamSection data={section} />;
        case 'careers':
            return <CareersSection data={section} />;
        case 'news':
            return <NewsSection data={section} />;
        case 'press':
            return <PressSection data={section} />;
        case 'custom':
            return (
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: section.content?.html || '' }} />
                </section>
            );
        default:
            return null;
    }
};

export default DynamicSectionRenderer;
