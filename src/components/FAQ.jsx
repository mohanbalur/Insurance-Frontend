import React, { useState } from 'react';

const FAQ = ({ data }) => {
    const { title, content } = data;
    const { subtitle, faqs } = content;
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20">
            <div className="w-full">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-4xl font-bold text-[#0B1F3A] mb-4">{title}</h2>
                    <p className="text-slate-600 text-lg">{subtitle}</p>
                </div>

                <div className="space-y-4">
                    {faqs?.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 bg-slate-50/50"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                className="w-full text-left px-8 py-6 flex justify-between items-center hover:bg-white transition-colors"
                            >
                                <span className={`text-lg font-semibold ${activeIndex === idx ? 'text-[#1E90FF]' : 'text-[#0B1F3A]'}`}>
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-5 h-5 transition-transform duration-300 ${activeIndex === idx ? 'rotate-180 text-[#1E90FF]' : 'rotate-0 text-slate-400'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeIndex === idx && (
                                <div className="px-8 pb-6 bg-white animate-fadeIn">
                                    <p className="text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
