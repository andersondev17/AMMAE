import ErrorBoundary from '@/components/ErrorBoundary';
import { ProductList } from '../components/product/ProductList';


export default function Home() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <ProductList />
      </div>
    </ErrorBoundary>
  );
}
