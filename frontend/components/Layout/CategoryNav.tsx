'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const categories = ['WOMEN', 'BALI', 'BONDI', 'EMPIRE', 'JACK', 'JOHN', 'MONZA', 'RAIL', 'SKATE', 'SOHO', 'THEA', 'VERT'];

export const CategoryNav: React.FC = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un placeholder si prefieres
  }

  return (
    <nav className="mb-8 border border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap -mb-px">
          {categories.map((category) => (
            <li key={category} className="mr-2">
              <Link
                href={`/category/${category.toLowerCase()}`}
                className={`inline-block p-4 text-sm font-medium ${
                  pathname === `/category/${category.toLowerCase()}`
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:border-b-2'
                } transition-colors duration-200`}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};