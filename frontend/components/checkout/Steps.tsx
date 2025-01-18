// components/checkout/Steps.tsx
"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepsProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: 'Información de envío' },
    { id: 2, name: 'Método de pago' },
    { id: 3, name: 'Confirmación' },
] as const;

const animations = {
    progress: {
        initial: { width: "0%" },
        animate: (progress: number) => ({
            width: `${progress}%`,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
        })
    },
    step: {
        inactive: { scale: 0.95, opacity: 0.7 },
        active: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        },
        completed: { scale: 1, opacity: 1 }
    }
};

const StepCircle = ({ 
    step, 
    currentStep 
}: { 
    step: typeof steps[number];
    currentStep: number;
}) => {
    const isCompleted = step.id < currentStep;
    const isCurrent = step.id === currentStep;

    return (
        <div className="relative">
            {/* Efecto de brillo exterior */}
            <motion.div
                className={cn(
                    "absolute -inset-1 rounded-full",
                    "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-sm",
                    isCurrent && "animate-pulse"
                )}
            />

            {/* Círculo principal */}
            <output
                className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                    "transition-all duration-500 ease-out",
                    isCompleted && "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600",
                    isCurrent && "border-blue-600 bg-white shadow-lg",
                    !isCompleted && !isCurrent && "border-gray-300 bg-white"
                )}
                aria-current={isCurrent ? "step" : undefined}
            >
                <AnimatePresence mode="wait">
                    {isCompleted ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check className="h-5 w-5 text-white" />
                        </motion.div>
                    ) : (
                        <span className={cn(
                            "text-sm font-semibold transition-colors",
                            isCurrent ? "text-blue-600" : "text-gray-500"
                        )}>
                            {step.id}
                        </span>
                    )}
                </AnimatePresence>
            </output>
        </div>
    );
};

const ProgressBar = ({ progress }: { progress: number }) => (
    <div
        className="absolute top-5 left-0 h-1 w-full bg-gradient-to-r from-gray-100/20 to-gray-100/10 
        rounded-full overflow-hidden backdrop-blur-sm"
        role="progressbar"
        aria-label={`Progreso: ${progress}% completado`}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
    >
        <motion.div
            className="relative h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"
            initial={{ width: "0%" }}
            animate={{
                width: `${progress}%`,
                transition: {
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1]
                }
            }}
        >
            {/* Efecto de brillo animado */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ x: '-100%' }}
                animate={{
                    x: '100%',
                    transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }
                }}
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                }}
            />
        </motion.div>
    </div>
);

export function Steps({ currentStep }: StepsProps) {
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <nav
            className="relative flex mb-8 px-4"
            aria-label="Progreso del checkout"
        >
            <ProgressBar progress={progress} />

            <div className="relative flex w-full max-w-2xl justify-between">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        className="flex flex-col items-center group"
                        variants={animations.step}
                        initial="inactive"
                        animate={step.id === currentStep ? "active" : step.id < currentStep ? "completed" : "inactive"}
                    >
                        <StepCircle step={step} currentStep={currentStep} />
                        <motion.span
                            className={cn(
                                "mt-2 text-sm font-medium transition-colors",
                                step.id === currentStep ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                            )}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {step.name}
                        </motion.span>

                        {index !== steps.length - 1 && (
                            <div className={cn(
                                "absolute left-[4.5rem] top-5 h-[2px] w-[calc(100%-6rem)]",
                                "bg-gradient-to-r",
                                step.id < currentStep ? "from-blue-600 to-indigo-600" : "from-gray-200 to-gray-300"
                            )} />
                        )}
                    </motion.div>
                ))}
            </div>
        </nav>
    );
}