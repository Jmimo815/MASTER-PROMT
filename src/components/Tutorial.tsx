import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  Zap, 
  Target, 
  Cpu, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light";
}

const steps = [
  {
    title: "1. Definir la Tarea Primaria",
    description: "Comienza escribiendo lo que deseas lograr en el campo 'Tarea Primaria'. Sé lo más descriptivo posible sobre el objetivo final.",
    example: "Ejemplo: 'Escribir un resumen de noticias sobre tecnología.'",
    icon: <Play className="text-[#D4AF37]" size={24} />
  },
  {
    title: "2. Seleccionar la Técnica Estratégica",
    description: "Elige una de las tres metodologías de prompting según la complejidad de tu tarea (Directo, Con Ejemplos o Paso a Paso).",
    example: "Directo (Zero-Shot) es ideal para tareas sencillas.",
    icon: <Zap className="text-[#D4AF37]" size={24} />
  },
  {
    title: "3. Configuración del Experto",
    description: "Define el Rol del Experto, el Formato de Salida y añade Contexto o Restricciones para obtener fidelidad extrema.",
    example: "Rol: 'Periodista con 20 años de experiencia'.",
    icon: <Cpu className="text-[#D4AF37]" size={24} />
  },
  {
    title: "4. Analizar la Precisión",
    description: "Pulsa 'Analizar Precisión' para recibir un diagnóstico del motor sobre posibles áreas de mejora estructural.",
    example: "Recibirás un puntaje (0-100%) y sugerencias específicas.",
    icon: <Target className="text-[#D4AF37]" size={24} />
  },
  {
    title: "5. Aplicar Mejora y Copiar",
    description: "Haz clic en 'Aplicar Mejora' para generar el prompt meta-optimizado y cópialo para usarlo en tu IA favorita.",
    example: "El motor Gemini 3-Flash se encargará de la ingeniería pesada.",
    icon: <CheckCircle2 className="text-[#D4AF37]" size={24} />
  }
];

const FlowNode = ({ title, description, active }: { title: string; description: string, active?: boolean }) => (
  <div className={`p-4 border rounded-sm transition-all duration-300 w-full max-w-[200px] text-center ${
    active ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-zinc-800 bg-black/20"
  }`}>
    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">{title}</h5>
    <p className="text-[10px] text-zinc-500 leading-tight">{description}</p>
  </div>
);

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose, theme }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl overflow-hidden flex flex-col border ${
            theme === "dark" ? "bg-[#0E0E0E] border-[#2A2A2A]" : "bg-white border-zinc-200"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#D4AF37] rounded-sm rotate-45"></div>
              <h2 className={`font-serif text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>
                Tutorial Interactivo
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-zinc-800">
              <X size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="steps" className="h-full flex flex-col">
              <div className="px-6 py-2 border-b border-zinc-800">
                <TabsList className="bg-transparent gap-6">
                  <TabsTrigger value="steps" className="data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none px-0">
                    Guía Paso a Paso
                  </TabsTrigger>
                  <TabsTrigger value="flow" className="data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none px-0">
                    Flujo Gráfico
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <TabsContent value="steps" className="m-0 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
                    <div className="space-y-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="space-y-4"
                        >
                          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                            {steps[currentStep].icon}
                          </div>
                          <h3 className={`text-2xl font-serif ${theme === "dark" ? "text-white" : "text-black"}`}>
                            {steps[currentStep].title}
                          </h3>
                          <p className="text-zinc-500 leading-relaxed">
                            {steps[currentStep].description}
                          </p>
                          <div className="bg-[#141414] p-4 rounded-sm border border-[#2A2A2A] italic text-sm text-zinc-400">
                            {steps[currentStep].example}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="flex gap-4 pt-8">
                        <Button 
                          variant="outline" 
                          disabled={currentStep === 0}
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          className="flex-1 rounded-sm border-zinc-800 text-zinc-500"
                        >
                          <ChevronLeft className="mr-2" size={16} /> Anterior
                        </Button>
                        <Button 
                          className="flex-1 rounded-sm bg-[#D4AF37] text-black hover:bg-[#B8962D]"
                          onClick={() => currentStep < steps.length - 1 ? setCurrentStep(prev => prev + 1) : onClose()}
                        >
                          {currentStep === steps.length - 1 ? "Comenzar ahora" : "Siguiente"} <ChevronRight className="ml-2" size={16} />
                        </Button>
                      </div>

                      <div className="flex justify-center gap-2 mt-4">
                        {steps.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-[#D4AF37]" : "w-2 bg-zinc-800"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="hidden md:block relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full blur-3xl"></div>
                      <Card className="relative bg-[#0A0A0A]/80 border-zinc-800 shadow-2xl overflow-hidden">
                        <CardHeader className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0 aspect-video flex items-center justify-center">
                          <img 
                            src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png" 
                            alt="Preview" 
                            className="h-20 opacity-20 grayscale invert"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="flow" className="m-0 h-full">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-12 py-8">
                      <div className="flex flex-col items-center gap-4">
                        <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Arquitectura de Flujo</h4>
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                          <FlowNode title="Entrada" description="Tarea, Rol, Formato, Contexto y Técnica" />
                          <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0" />
                          <div className="flex flex-col gap-4">
                            <FlowNode title="Motor de Análisis" description="Evalúa precisión y sugiere cambios" active />
                            <FlowNode title="Motor Refinador" description="Aplica lógica avanzada Gemini 3-Flash" active />
                          </div>
                          <ArrowRight className="text-zinc-800 rotate-90 md:rotate-0" />
                          <FlowNode title="Resultado" description="Prompt meta-optimizado listo para copiar" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-zinc-900/20 p-8 rounded-sm border border-zinc-800/50">
                        <div className="space-y-4">
                          <h4 className="text-sm font-serif text-[#D4AF37]">Procesamiento IA</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Las peticiones se estructuran dinámicamente según la técnica elegida. El sistema utiliza "Chain-of-Thought" para descomponer problemas lógicos, asegurando que la IA razoné antes de generar el output final.
                          </p>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-sm font-serif text-[#D4AF37]">Estados de Interfaz</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            La UI reacciona en tiempo real. El modo oscuro/claro no es solo estético; utiliza transiciones de desenfoque para mitigar la fatiga visual durante sesiones prolongadas de ingeniería de prompts.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
