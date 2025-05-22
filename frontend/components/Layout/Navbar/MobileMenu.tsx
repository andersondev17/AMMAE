// components/Layout/MobileMenu.tsx
import { Sheet, SheetContent, SheetHeader, } from "@/components/ui/sheet";
import { Home, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    categories: readonly {
        name: string;
        path: string;
        apiValue: string;
    }[];
}

export const MobileMenu = memo(({ isOpen, onClose, categories }: MobileMenuProps) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: Home, label: "Inicio", path: "/" },
        { icon: Package, label: "Admin", path: "/admin/products" },
        { icon: User, label: "Mi Cuenta", path: "/account" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-full max-w-xs p-0 border-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="py-6 px-4 border-b border-gray-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">AMMAE</div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Navegación principal */}
                        <div className="space-y-1 mb-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={onClose}
                                    className={`flex items-center font-robert-regular gap-3 px-3 py-3 rounded-md transition-colors
                                        ${pathname === item.path
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Categorías */}
                        <div className="mb-8">
                            <h3 className="text-xs font=general uppercase tracking-wider text-gray-500 font-medium px-3 mb-2">
                                Categorías
                            </h3>
                            <div className=" space-y-1">
                                {categories.map((category) => (
                                    <Link
                                        key={category.path}
                                        href={category.path}
                                        onClick={onClose}
                                        className={`block px-3 py-2 font-robert-regular rounded-md transition-colors
                                            ${pathname === category.path
                                                ? "bg-gray-100 font-medium"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t font-general border-gray-100 bg-gray-50 text-center text-xs text-gray-500">
                        <p>© 2025 AMMAE</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
});

MobileMenu.displayName = 'MobileMenu';