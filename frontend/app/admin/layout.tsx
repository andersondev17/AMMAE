export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 text-white py-2 px-4 text-sm">
          <div className="container mx-auto">
            <p>Modo Administrador</p>
          </div>
        </div>
        {children}
      </div>
    );
  }