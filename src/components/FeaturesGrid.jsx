import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesGrid = ({ data }) => {
    const { title, content } = data;
    const { subtitle, items } = content;

    return (
        <section className="w-full bg-[#F4F7FB] py-16 px-6 md:px-12 lg:px-20">
            <div className="w-full">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-4xl font-bold text-[#0B1F3A] mb-4">{title}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {items?.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group overflow-hidden"
                        >
                            {/* Card Image */}
                            <div className="h-44 overflow-hidden border-b border-slate-50">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5 md:p-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
                                    ${item.accentColor === 'blue' ? 'bg-blue-50 text-blue-600' :
                                        item.accentColor === 'green' ? 'bg-green-50 text-green-600' :
                                            item.accentColor === 'purple' ? 'bg-purple-50 text-purple-600' :
                                                item.accentColor === 'orange' ? 'bg-orange-50 text-orange-600' :
                                                    item.accentColor === 'red' ? 'bg-red-50 text-red-600' :
                                                        'bg-teal-50 text-teal-600'}`}
                                >
                                    {/* Icon Placeholder */}
                                    <div className="font-bold text-lg uppercase">{item.title[0]}</div>
                                </div>
                                <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{item.title}</h3>
                                <p className="text-slate-500 mb-6 leading-relaxed text-sm h-12 overflow-hidden">
                                    {item.description}
                                </p>
                                <Link
                                    to={item.link}
                                    className="text-[#1E90FF] font-bold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform"
                                >
                                    Learn More <span className="ml-2">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
