import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const quickLinks = [
        { label: 'About Us', url: '/#about' },
        { label: 'Our Team', url: '/#team' },
        { label: 'Careers', url: '/#careers' },
        { label: 'News & Blog', url: '/#news' },
        { label: 'Press Releases', url: '/#press' },
    ];

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const response = await axiosInstance.get('/cms/footer');
                if (response.data.success && response.data.data && response.data.data.footer) {
                    const data = response.data.data.footer;
                    if (!data.columns || data.columns.length === 0) {
                        setError('NO_SEED_DATA');
                    } else {
                        setFooterData(data);
                    }
                } else {
                    setError('NO_SEED_DATA');
                }
            } catch (err) {
                console.error('Footer fetch error:', err);
                setError('FETCH_ERROR');
            } finally {
                setLoading(false);
            }
        };

        fetchFooter();
    }, []);

    if (loading) return <footer className="bg-[#0B1F3A] py-10"></footer>;

    if (error === 'NO_SEED_DATA') {
        return (
            <footer className="bg-red-50 border-t border-red-100 p-8 text-center">
                <p className="text-red-600 font-semibold mb-2">No Footer data found in backend CMS.</p>
                <p className="text-red-500 text-sm">Please approve seed data creation to continue.</p>
            </footer>
        );
    }

    if (!footerData) return null;

    const hasQuickLinksColumn = footerData.columns.some((column) =>
        (column.title || '').toLowerCase().includes('quick')
    );

    return (
        <footer className="bg-[#0B1F3A] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-[#1E90FF] rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Insurance</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Protecting what matters most since 1995. Your trusted partner in comprehensive insurance solutions.
                        </p>
                    </div>

                    {/* Columns from CMS */}
                    {footerData.columns.map((column, idx) => (
                        <div key={idx}>
                            <h4 className="text-lg font-semibold mb-6">{column.title}</h4>
                            <ul className="space-y-4">
                                {(column.title || '').toLowerCase().includes('quick')
                                    ? quickLinks.map((link, lIdx) => (
                                        <li key={`${link.url}-${lIdx}`}>
                                            <Link to={link.url} className="text-slate-400 hover:text-[#1E90FF] transition-colors text-sm">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))
                                    : column.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            {link.url?.startsWith('/#') ? (
                                                <Link to={link.url} className="text-slate-400 hover:text-[#1E90FF] transition-colors text-sm">
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <a href={link.url} className="text-slate-400 hover:text-[#1E90FF] transition-colors text-sm">
                                                    {link.label}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}

                    {!hasQuickLinksColumn && (
                        <div>
                            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-4">
                                {quickLinks.map((link, idx) => (
                                    <li key={`${link.url}-${idx}`}>
                                        <Link to={link.url} className="text-slate-400 hover:text-[#1E90FF] transition-colors text-sm">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-[#1E90FF] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{footerData.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-[#1E90FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{footerData.contactInfo.phone}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-[#1E90FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{footerData.contactInfo.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs">
                        &copy; {new Date().getFullYear()} Insurance. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        {footerData.socialLinks.map((social, idx) => (
                            <a key={idx} href={social.url} className="text-slate-500 hover:text-white transition-colors">
                                {/* Simple icon based on platform */}
                                <span className="capitalize text-xs">{social.platform}</span>
                            </a>
                        ))}
                    </div>
                    <div className="flex space-x-4 text-xs text-slate-500">
                        <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
