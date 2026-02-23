import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';

const HomePage = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await axiosInstance.get('/cms/home');
                if (response.data.success && response.data.data && response.data.data.page) {
                    const data = response.data.data.page;
                    if (!data.sections || data.sections.length === 0) {
                        setError('NO_SEED_DATA');
                    } else {
                        setPageData(data);
                    }
                } else {
                    setError('NO_SEED_DATA');
                }
            } catch (err) {
                console.error('Home Page fetch error:', err);
                setError('FETCH_ERROR');
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, []);

    useEffect(() => {
        if (!location.hash) return;

        const element = document.getElementById(location.hash.substring(1));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-pulse text-2xl font-bold text-[#1E90FF]">Loading Insurance...</div>
            </div>
        );
    }

    if (error === 'NO_SEED_DATA') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white">
                <div className="max-w-md">
                    <h1 className="text-3xl font-bold text-[#0B1F3A] mb-4">No Data Found in Backend</h1>
                    <p className="text-slate-600 mb-8">
                        The CMS "home" page is currently empty. Would you like me to request seed data creation?
                    </p>
                </div>
            </div>
        );
    }

    if (!pageData) return null;

    return (
        <div className="w-full animate-fadeIn">
            {pageData.sections
                .filter((section) => section.isActive)
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((section, index) => (
                    <section
                        key={section._id || section.sectionId}
                        id={section.type}
                        className={`w-full ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${section.type === 'hero' || section.type === 'features' || section.type === 'faq' ? 'py-0 px-0' : 'py-16 px-6 md:px-12 lg:px-20'}`}
                    >
                        <DynamicSectionRenderer section={section} />
                    </section>
                ))}
        </div>
    );
};

export default HomePage;
