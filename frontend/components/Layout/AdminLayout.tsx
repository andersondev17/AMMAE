import { useRouter } from 'next/router';
import React from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const router = useRouter();


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
            {children}
        </div>
    );
};