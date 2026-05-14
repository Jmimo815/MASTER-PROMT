/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Bot, 
  Target, 
  Settings2,
  RefreshCcw,
  Copy,
  Check,
  Moon,
  Sun,
  HelpCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tutorial } from "./components/Tutorial";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  analyzePromptPrecision, 
  refinePrompt, 
  type PromptTechnique, 
  type PromptAnalysis, 
  type RefinedPrompt 
} from "@/lib/gemini";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [task, setTask] = useState("");
  const [technique, setTechnique] = useState<PromptTechnique>("zero-shot");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [format, setFormat] = useState("");
  
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [refined, setRefined] = useState<RefinedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const handleAnalyze = async () => {
    if (!inputPrompt.trim() && !task.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzePromptPrecision(inputPrompt || task);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!inputPrompt.trim() && !task.trim()) return;
    setIsLoading(true);
    try {
      const result = await refinePrompt(inputPrompt, technique, role, task, context, format);
      setRefined(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    <AnimatePresence mode="wait">
      <motion.div 
        key={theme}
        initial={{ filter: "blur(8px)", opacity: 0.9 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        exit={{ filter: "blur(8px)", opacity: 0.9 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black transition-colors duration-500 ${
          theme === "dark" ? "bg-[#0A0A0A] text-[#E5E5E5]" : "bg-[#F8F9FA] text-[#1A1A1A]"
        }`}
      >
        {/* Header */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-colors duration-500 ${
        theme === "dark" ? "border-[#2A2A2A] bg-[#0A0A0A]/80" : "border-zinc-200 bg-white/80"
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png" 
              alt="Logo del SENA" 
              className={`h-12 w-auto object-contain transition-all ${
                theme === "dark" ? "brightness-0 invert opacity-80" : ""
              }`}
            />
            <div>
              <h1 className={`font-serif text-2xl tracking-tight transition-colors duration-500 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>PROMT SENA PMS</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-zinc-500">Estudio de Ingeniería de Prompts</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Motor de Optimización</span>
              <span className="text-xs font-mono text-zinc-500">v2.4.82</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsTutorialOpen(true)}
                className={`rounded-full border-2 transition-all ${
                  theme === "dark" 
                    ? "bg-[#141414] border-[#2A2A2A] text-zinc-500 hover:bg-zinc-800 hover:text-[#D4AF37]" 
                    : "bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-black"
                }`}
              >
                <HelpCircle size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full border-2 transition-all ${
                  theme === "dark" 
                    ? "bg-[#141414] border-[#2A2A2A] text-[#D4AF37] hover:bg-zinc-800" 
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Panel: Input & Settings */}
          <div className="lg:col-span-5 space-y-8">
            <section className={`border rounded-sm overflow-hidden shadow-2xl transition-all duration-500 ${
              theme === "dark" ? "bg-[#0E0E0E] border-[#2A2A2A]" : "bg-white border-zinc-200"
            }`}>
              <div className="p-8 space-y-8">
                {/* Task Input */}
                <div className="space-y-3">
                  <Label className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Tarea Primaria</Label>
                  <Textarea 
                    placeholder="¿Qué quieres que la IA haga? (ej: Redactar un artículo de bioética)"
                    className={`min-h-[100px] rounded-sm p-4 text-sm leading-relaxed focus:border-[#D4AF37] focus:ring-0 transition-all resize-none ${
                        theme === "dark" 
                          ? "bg-[#141414] border-[#2A2A2A] placeholder:text-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 placeholder:text-zinc-400 text-black"
                      }`}
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">Técnica Estratégica</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["zero-shot", "few-shot", "chain-of-thought"] as PromptTechnique[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTechnique(t)}
                        className={`py-3 text-[9px] uppercase font-bold tracking-tighter border transition-all ${
                          technique === t 
                            ? "bg-[#1a1813] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.1)]" 
                            : theme === "dark"
                              ? "bg-[#141414] border-[#2A2A2A] text-zinc-500 hover:border-zinc-700"
                              : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        {t === "zero-shot" ? "Directo" : t === "few-shot" ? "Con Ejemplos" : "Paso a Paso"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Structure Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-zinc-500">Rol del Experto</Label>
                    <input 
                      className={`w-full rounded-sm p-3 text-xs focus:border-[#D4AF37] outline-none transition-all ${
                        theme === "dark" 
                          ? "bg-[#141414] border-[#2A2A2A] placeholder:text-zinc-800" 
                          : "bg-zinc-50 border-zinc-200 placeholder:text-zinc-400 text-black"
                      }`}
                      placeholder="e.g. Bioeticista"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-zinc-500">Formato de Salida</Label>
                    <input 
                      className={`w-full rounded-sm p-3 text-xs focus:border-[#D4AF37] outline-none transition-all ${
                        theme === "dark" 
                          ? "bg-[#141414] border-[#2A2A2A] placeholder:text-zinc-800" 
                          : "bg-zinc-50 border-zinc-200 placeholder:text-zinc-400 text-black"
                      }`}
                      placeholder="e.g. Markdown"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] uppercase tracking-wider text-zinc-500">Contexto y Restricciones</Label>
                  <Textarea 
                    placeholder="Audiencia, tono, palabras clave, límites..."
                    className={`min-h-[100px] rounded-sm p-4 text-xs leading-relaxed focus:border-[#D4AF37] focus:ring-0 transition-all resize-none ${
                        theme === "dark" 
                          ? "bg-[#141414] border-[#2A2A2A] placeholder:text-zinc-800" 
                          : "bg-zinc-50 border-zinc-200 placeholder:text-zinc-400 text-black"
                      }`}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>
              </div>
              
              <div className={`p-8 border-t flex gap-4 transition-colors duration-500 ${
                theme === "dark" ? "bg-[#111111] border-[#2A2A2A]" : "bg-zinc-50 border-zinc-100"
              }`}>
                <Button 
                  variant="outline" 
                  className={`flex-1 rounded-sm bg-transparent transition-all font-bold uppercase tracking-widest text-[10px] h-12 ${
                    theme === "dark"
                      ? "border-[#2A2A2A] text-zinc-400 hover:text-white hover:bg-zinc-900"
                      : "border-zinc-200 text-zinc-500 hover:bg-white hover:text-black"
                  }`}
                  onClick={handleAnalyze}
                  disabled={isLoading || (!inputPrompt.trim() && !task.trim())}
                >
                  {isLoading ? <RefreshCcw size={14} className="animate-spin" /> : "Analizar Precisión"}
                </Button>
                <Button 
                  className={`flex-1 rounded-sm font-bold uppercase tracking-widest text-[10px] h-12 transition-all ${
                    theme === "dark"
                      ? "bg-white text-black hover:bg-[#D4AF37]"
                      : "bg-black text-white hover:bg-[#D4AF37]"
                  }`}
                  onClick={handleRefine}
                  disabled={isLoading || (!inputPrompt.trim() && !task.trim())}
                >
                  {isLoading ? <RefreshCcw size={14} className="animate-spin" /> : "Aplicar Mejora"}
                </Button>
              </div>
            </section>
          </div>

          {/* Right Panel: Analysis & Output */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {(!analysis && !refined) ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`h-full flex flex-col items-center justify-center p-16 text-center space-y-6 border rounded-sm transition-colors duration-500 ${
                    theme === "dark" ? "border-[#2A2A2A] bg-[#0E0E0E]" : "border-zinc-200 bg-white shadow-sm"
                  }`}
                >
                  <div className={`w-16 h-16 border rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-[#141414] border-[#2A2A2A]" : "bg-zinc-50 border-zinc-100"
                  }`}>
                    <Target size={32} className={theme === "dark" ? "text-zinc-800" : "text-zinc-300"} />
                  </div>
                  <div>
                    <h3 className={`font-serif text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>Motor en Espera</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed uppercase tracking-widest">
                      Los resultados de la optimización aparecerán aquí tras el análisis.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {/* Analysis Dashboard */}
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className={`rounded-sm shadow-2xl overflow-hidden transition-colors duration-500 border ${
                        theme === "dark" ? "bg-[#0E0E0E] border-[#2A2A2A]" : "bg-white border-zinc-100"
                      }`}>
                        <CardHeader className={`p-8 border-b ${theme === "dark" ? "border-[#2A2A2A]" : "border-zinc-100"}`}>
                          <div className="flex items-center gap-8">
                            <div className="relative w-24 h-24 shrink-0">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke={theme === "dark" ? "#1F1F1F" : "#F1F1F1"} strokeWidth="2" />
                                <circle 
                                  cx="18" cy="18" r="16" fill="none" 
                                  stroke="#D4AF37" strokeWidth="2" 
                                  strokeDasharray={`${analysis.precision}, 100`} 
                                  strokeLinecap="round"
                                  className="transition-all duration-1000 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-2xl font-serif ${theme === "dark" ? "text-white" : "text-black"}`}>{analysis.precision}%</span>
                                <span className="text-[8px] uppercase text-zinc-500 tracking-tighter">Precisión</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold">Análisis de Estado</span>
                              <p className={`text-sm font-serif italic leading-relaxed ${theme === "dark" ? "text-zinc-300" : "text-zinc-600"}`}>
                                {analysis.feedbacks.length > 0 
                                  ? `Se detectaron ${analysis.feedbacks.length} áreas críticas para optimización estructural.`
                                  : "El prompt presenta una estructura sólida, procediendo con refinamiento estético."}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className={`text-[11px] uppercase tracking-widest text-zinc-500 font-bold border-b pb-2 ${
                                theme === "dark" ? "border-[#2A2A2A]" : "border-zinc-100"
                              }`}>Hallazgos</h4>
                              <ul className="space-y-3">
                                {analysis.feedbacks.map((f, i) => (
                                  <li key={i} className="text-[13px] flex items-start gap-3 group">
                                    <div className="mt-1.5 w-1.5 h-1.5 border border-[#D4AF37] rotate-45 group-hover:bg-[#D4AF37] transition-all" />
                                    <span className={`transition-all ${
                                      theme === "dark" ? "text-zinc-400 group-hover:text-white" : "text-zinc-500 group-hover:text-black"
                                    }`}>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold border-b border-[#D4AF37]/20 pb-2">Estructura Sugerida</h4>
                              <div className="space-y-2">
                                {Object.entries(analysis.suggestions).map(([key, val]) => val && (
                                  <div key={key} className={`p-3 border transition-all rounded-sm flex items-center justify-between ${
                                    theme === "dark" ? "bg-[#141414] border-[#2A2A2A] hover:border-[#D4AF37]/30" : "bg-zinc-50 border-zinc-100 hover:border-[#D4AF37]/30"
                                  }`}>
                                    <div>
                                      <p className="text-[9px] font-bold uppercase text-zinc-600 mb-0.5">{key}</p>
                                      <p className={`text-xs ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>{val}</p>
                                    </div>
                                    <CheckCircle2 size={12} className="text-[#D4AF37] opacity-20" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Refined Strategy Output */}
                  {refined && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className={`rounded-sm shadow-2xl overflow-hidden relative border transition-colors duration-500 ${
                        theme === "dark" 
                          ? "bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E] border-[#2A2A2A]" 
                          : "bg-white border-zinc-200"
                      }`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-[0.03] blur-3xl rounded-full -mr-16 -mt-16"></div>
                        <CardHeader className={`p-8 border-b flex flex-row items-center justify-between ${
                          theme === "dark" ? "border-[#2A2A2A]" : "border-zinc-100"
                        }`}>
                          <div className="flex items-center gap-3">
                            <Zap className="text-[#D4AF37] fill-[#D4AF37]/20" size={18} />
                            <CardTitle className={`text-[11px] uppercase tracking-[0.3em] font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Estrategia de Salida Refinada</CardTitle>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-8 w-8 p-0 ${theme === "dark" ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-black"}`}
                              onClick={() => copyToClipboard(refined.content)}
                            >
                              {copied ? <Check size={14} className="text-[#D4AF37]" /> : <Copy size={14} />}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                          <div className={`p-6 border rounded-sm font-mono text-sm leading-relaxed group relative ${
                            theme === "dark" ? "bg-[#0A0A0A] border-[#2A2A2A] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-600"
                          }`}>
                            <ScrollArea className="h-[220px]">
                              {refined.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2 last:mb-0">
                                  {line.includes(':') ? (
                                    <>
                                      <span className="text-[#D4AF37] font-bold">{line.split(':')[0]}:</span>
                                      {line.split(':').slice(1).join(':')}
                                    </>
                                  ) : line}
                                </p>
                              ))}
                            </ScrollArea>
                          </div>
                          <div className={`p-6 border rounded-sm ${
                            theme === "dark" ? "bg-[#1a1813]/50 border-[#D4AF37]/10" : "bg-[#D4AF37]/5 border-[#D4AF37]/20"
                          }`}>
                            <h4 className="text-[9px] font-bold uppercase text-[#D4AF37] tracking-[0.2em] mb-3">Notas de Optimización Lógica</h4>
                            <p className={`text-[13px] italic leading-relaxed font-serif ${
                              theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                            }`}>
                              "{refined.explanation}"
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className={`px-8 py-4 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
                          theme === "dark" ? "bg-black/40 border-[#2A2A2A]" : "bg-zinc-50 border-zinc-100"
                        }`}>
                          <span className="text-[9px] text-zinc-600 font-mono tracking-tighter uppercase order-2 md:order-1">Motor: Gemini 3-Flash • ID: RE-{Math.floor(Math.random()*10000)}</span>
                          <Button 
                            onClick={() => copyToClipboard(refined.content)}
                            variant="outline"
                            className={`h-10 px-6 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-all order-1 md:order-2 ${
                              theme === "dark"
                                ? "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                                : "border-[#D4AF37] text-black hover:bg-[#D4AF37] hover:text-white"
                            }`}
                          >
                            {copied ? (
                              <><Check size={14} className="mr-2" /> Copiado</>
                            ) : (
                              <><Copy size={14} className="mr-2" /> Copiar Prompt</>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className={`mt-16 border-t py-12 transition-colors duration-500 ${
        theme === "dark" ? "bg-[#080808] border-[#1A1A1A]" : "bg-white border-zinc-200"
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-700">
            Meta-Ingeniería y Optimización Avanzada
          </p>
          <div className="flex gap-8">
            <span className="text-[9px] uppercase tracking-widest text-zinc-800">Privacidad</span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-800">Protocolos</span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-800">Archivo</span>
          </div>
        </div>
      </footer>
      </motion.div>
      </AnimatePresence>
      <Tutorial 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
        theme={theme} 
      />
    </>
  );
}

