import React from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { ProductManagement } from '../../components/ProductManagement';

const ProductManagementPage: React.FC = () => {
    return (
        <AdminLayout>
            <div className="py-40 lg:py-20 sm:py-0">
                <h2 className="text-2xl font-semibold mb-4 py-11">Gestión de Productos</h2>
                <ProductManagement />
            </div>
        </AdminLayout>
    );
};

export default ProductManagementPage;
