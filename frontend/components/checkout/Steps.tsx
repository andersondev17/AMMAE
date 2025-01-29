"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { id: 1, name: 'Información de envío' },
  { id: 2, name: 'Método de pago' },
  { id: 3, name: 'Confirmación' }
] as const;

interface StepsProps {
  currentStep: number;
}

export function Steps({ currentStep }: StepsProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Barra de progreso */}
      <div className="relative h-1 mb-6">
        <div className="absolute w-full h-full bg-gray-200 rounded-full" />
        <motion.div
          className="absolute h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between relative">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Círculo indicador */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                  "transition-all duration-200",
                  isCompleted ? "bg-blue-600 border-blue-600" : 
                  isCurrent ? "border-blue-600" : 
                  "border-gray-300"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-blue-600" : "text-gray-500"
                  )}>
                    {step.id}
                  </span>
                )}
              </div>

              {/* Nombre del step */}
              <span className={cn(
                "mt-2 text-sm font-medium",
                isCurrent ? "text-blue-600" : "text-gray-500"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}