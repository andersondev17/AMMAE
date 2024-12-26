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
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">AMMAE</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                    {/* Menú principal */}
                    <div className="space-y-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`flex items-center space-x-3 px-2 py-3 rounded-lg transition-colors
                    ${pathname === item.path
                                        ? "bg-gray-100 text-black"
                                        : "hover:bg-gray-50"}`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Separador */}
                    <div className="border-t my-4" />

                    {/* Categorías */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-500 px-2">
                            CATEGORÍAS
                        </h3>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <Link
                                    key={category.path}
                                    href={category.path}
                                    onClick={onClose}
                                    className={`block px-2 py-3 rounded-lg transition-colors
                      ${pathname === category.path
                                            ? "bg-gray-100 text-black font-medium"
                                            : "hover:bg-gray-50"}`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};