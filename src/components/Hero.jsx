import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

const Hero = ({ data }) => {
    const { title, content } = data;
    const { description, primaryBtn, secondaryBtn, stats, imageUrl } = content;

    return (
        <section className="relative bg-white py-10 lg:py-14 overflow-hidden">
            <div className="w-full px-6 md:px-12 lg:px-20">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Text Column */}
                    <div className="relative z-10">
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0B1F3A] leading-tight mb-6">
                            {title}
                        </h1>
                        <p className="text-lg text-slate-600 mb-7 max-w-lg leading-relaxed">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            {primaryBtn && (
                                <Link
                                    to={primaryBtn.url}
                                    className="bg-[#1E90FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#0B1F3A] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {primaryBtn.label} →
                                </Link>
                            )}
                            {secondaryBtn && (
                                <Link
                                    to={secondaryBtn.url}
                                    className="bg-white text-[#1E90FF] border-2 border-[#1E90FF] px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all transform hover:-translate-y-1"
                                >
                                    {secondaryBtn.label}
                                </Link>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-6">
                            {stats?.map((stat, idx) => (
                                <div key={idx}>
                                    <p className="text-3xl font-bold text-[#1E90FF] mb-1">
                                        {stat.value === '500K+' ? (
                                            <>
                                                <CountUp
                                                    end={500}
                                                    duration={2}
                                                    enableScrollSpy
                                                    scrollSpyOnce
                                                />
                                                K+
                                            </>
                                        ) : stat.value === '98%' ? (
                                            <>
                                                <CountUp
                                                    end={98}
                                                    duration={2}
                                                    enableScrollSpy
                                                    scrollSpyOnce
                                                />
                                                %
                                            </>
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="mt-10 lg:mt-0 relative lg:justify-self-end">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src={imageUrl}
                                alt="Family Protection"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            {/* Decorative Blur */}
                            <div className="absolute -inset-4 bg-[#1E90FF]/10 blur-3xl -z-10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
