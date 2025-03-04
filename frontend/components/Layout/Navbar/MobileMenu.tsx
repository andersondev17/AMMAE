import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Home, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    categories: readonly {
        name: string;
        path: string;
        apiValue: string;
    }[];
}

export const MobileMenu = ({ isOpen, onClose, categories }: MobileMenuProps) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: Home, label: "Inicio", path: "/" },
        { icon: Package, label: "Admin", path: "/admin/products" },
        { icon: User, label: "Mi Cuenta", path: "/account" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 bg-white overflow-y-auto">
            <SheetHeader>
                <SheetTitle className="text-2xl font-zentry font-black tracking-wide text-center">AMMAE</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                    {/* Menú principal */}
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                    className={`flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-300
                    ${pathname === item.path
                        ? "bg-gray-900 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-100 my-2" />

                    {/* Categorías */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-zentry tracking-widest font-bold text-gray-900 px-2 uppercase">
                            CATEGORÍAS
                        </h3>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <Link
                                    key={category.path}
                                    href={category.path}
                                    onClick={onClose}
                                    className={`block px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden
                      ${pathname === category.path
                                            ? "bg-gray-100 text-black font-medium"
                                            : "hover:bg-gray-50"}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-2" />

                    <div className="mt-auto pt-6 text-center text-sm text-gray-500 font-robert-regular">
                        <p>© 2025 AMMAE. All rights reserved.</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};