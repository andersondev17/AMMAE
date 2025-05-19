import { Button } from "@/components/ui"
import { RefreshCw } from "lucide-react"

const page = () => {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight">Usuarios</h1>
                    <p className="text-gray-500 mt-1">Vista general de usuarios</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 `} />
                    Actualizar
                </Button>
            </div>
        </div>
    )
}

export default page