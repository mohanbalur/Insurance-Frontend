import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppWidget from '../components/common/WhatsAppWidget';

const PublicLayout = () => {
    return (
        <div className="h-screen overflow-y-auto flex flex-col bg-[#F4F7FB]">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppWidget />
        </div>
    );
};

export default PublicLayout;
