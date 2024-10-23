import React from 'react';
import { AdminLayout } from '../components/Layout/AdminLayout';
import { ProductManagement } from '../components/ProductManagement';

const ProductManagementPage: React.FC = () => {
    return (
        <AdminLayout>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Productos</h2>
            <ProductManagement />
        </AdminLayout>
    );
};

export default ProductManagementPage;