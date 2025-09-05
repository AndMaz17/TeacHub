'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  X, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Table,
  Calculator,
  Eye,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/types';

// Rendering semplificato che riproduce l'aspetto KaTeX

interface AdvancedEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onSave: (updatedQuestion: Question) => void;
}

interface RichContent {
  type: 'text' | 'latex' | 'image' | 'table';
  content: string;
  id: string;
}

const mathSymbolCategories = {
  'Operazioni Base': [
    { symbol: '\\frac{a}{b}', name: 'Frazione', preview: '\\frac{a}{b}' },
    { symbol: 'a^{b}', name: 'Potenza', preview: 'a^{b}' },
    { symbol: 'a_{b}', name: 'Pedice', preview: 'a_{b}' },
    { symbol: '\\sqrt{a}', name: 'Radice quadrata', preview: '\\sqrt{a}' },
    { symbol: '\\sqrt[n]{a}', name: 'Radice n-esima', preview: '\\sqrt[n]{a}' },
    { symbol: '|a|', name: 'Valore assoluto', preview: '|a|' },
    { symbol: '\\pm', name: 'Più o meno', preview: '\\pm' },
    { symbol: '\\mp', name: 'Meno o più', preview: '\\mp' },
    { symbol: '\\cdot', name: 'Prodotto', preview: 'a \\cdot b' },
    { symbol: '\\times', name: 'Per', preview: 'a \\times b' },
    { symbol: '\\div', name: 'Diviso', preview: 'a \\div b' },
    { symbol: '\\%', name: 'Percentuale', preview: '\\%' }
  ],
  'Funzioni': [
    { symbol: '\\sin(x)', name: 'Seno', preview: '\\sin(x)' },
    { symbol: '\\cos(x)', name: 'Coseno', preview: '\\cos(x)' },
    { symbol: '\\tan(x)', name: 'Tangente', preview: '\\tan(x)' },
    { symbol: '\\log(x)', name: 'Logaritmo', preview: '\\log(x)' },
    { symbol: '\\ln(x)', name: 'Logaritmo naturale', preview: '\\ln(x)' },
    { symbol: '\\log_{a}(x)', name: 'Log base a', preview: '\\log_{a}(x)' },
    { symbol: 'e^{x}', name: 'Esponenziale', preview: 'e^{x}' },
    { symbol: '\\arcsin(x)', name: 'Arcoseno', preview: '\\arcsin(x)' },
    { symbol: '\\arccos(x)', name: 'Arcocoseno', preview: '\\arccos(x)' },
    { symbol: '\\arctan(x)', name: 'Arcotangente', preview: '\\arctan(x)' },
    { symbol: '\\sinh(x)', name: 'Seno iperbolico', preview: '\\sinh(x)' },
    { symbol: '\\cosh(x)', name: 'Coseno iperbolico', preview: '\\cosh(x)' }
  ],
  'Calcolo': [
    { symbol: '\\sum_{i=1}^{n}', name: 'Sommatoria', preview: '\\sum_{i=1}^{n}' },
    { symbol: '\\prod_{i=1}^{n}', name: 'Produttoria', preview: '\\prod_{i=1}^{n}' },
    { symbol: '\\int_{a}^{b}', name: 'Integrale definito', preview: '\\int_{a}^{b}' },
    { symbol: '\\int', name: 'Integrale indefinito', preview: '\\int' },
    { symbol: '\\oint', name: 'Integrale ciclico', preview: '\\oint' },
    { symbol: '\\iint', name: 'Integrale doppio', preview: '\\iint' },
    { symbol: '\\iiint', name: 'Integrale triplo', preview: '\\iiint' },
    { symbol: '\\lim_{x \\to a}', name: 'Limite', preview: '\\lim_{x \\to a}' },
    { symbol: '\\frac{d}{dx}', name: 'Derivata', preview: '\\frac{d}{dx}' },
    { symbol: '\\frac{\\partial}{\\partial x}', name: 'Derivata parziale', preview: '\\frac{\\partial}{\\partial x}' },
    { symbol: '\\nabla', name: 'Nabla', preview: '\\nabla' },
    { symbol: '\\Delta', name: 'Delta grande', preview: '\\Delta' }
  ],
  'Confronti': [
    { symbol: '=', name: 'Uguale', preview: 'a = b' },
    { symbol: '\\neq', name: 'Diverso', preview: 'a \\neq b' },
    { symbol: '<', name: 'Minore', preview: 'a < b' },
    { symbol: '>', name: 'Maggiore', preview: 'a > b' },
    { symbol: '\\leq', name: 'Minore uguale', preview: 'a \\leq b' },
    { symbol: '\\geq', name: 'Maggiore uguale', preview: 'a \\geq b' },
    { symbol: '\\ll', name: 'Molto minore', preview: 'a \\ll b' },
    { symbol: '\\gg', name: 'Molto maggiore', preview: 'a \\gg b' },
    { symbol: '\\approx', name: 'Circa uguale', preview: 'a \\approx b' },
    { symbol: '\\equiv', name: 'Equivalente', preview: 'a \\equiv b' },
    { symbol: '\\sim', name: 'Simile', preview: 'a \\sim b' },
    { symbol: '\\propto', name: 'Proporzionale', preview: 'a \\propto b' }
  ],
  'Lettere Greche': [
    { symbol: '\\alpha', name: 'Alpha', preview: '\\alpha' },
    { symbol: '\\beta', name: 'Beta', preview: '\\beta' },
    { symbol: '\\gamma', name: 'Gamma', preview: '\\gamma' },
    { symbol: '\\delta', name: 'Delta', preview: '\\delta' },
    { symbol: '\\epsilon', name: 'Epsilon', preview: '\\epsilon' },
    { symbol: '\\zeta', name: 'Zeta', preview: '\\zeta' },
    { symbol: '\\eta', name: 'Eta', preview: '\\eta' },
    { symbol: '\\theta', name: 'Theta', preview: '\\theta' },
    { symbol: '\\iota', name: 'Iota', preview: '\\iota' },
    { symbol: '\\kappa', name: 'Kappa', preview: '\\kappa' },
    { symbol: '\\lambda', name: 'Lambda', preview: '\\lambda' },
    { symbol: '\\mu', name: 'Mu', preview: '\\mu' },
    { symbol: '\\nu', name: 'Nu', preview: '\\nu' },
    { symbol: '\\xi', name: 'Xi', preview: '\\xi' },
    { symbol: '\\pi', name: 'Pi', preview: '\\pi' },
    { symbol: '\\rho', name: 'Rho', preview: '\\rho' },
    { symbol: '\\sigma', name: 'Sigma', preview: '\\sigma' },
    { symbol: '\\tau', name: 'Tau', preview: '\\tau' },
    { symbol: '\\phi', name: 'Phi', preview: '\\phi' },
    { symbol: '\\chi', name: 'Chi', preview: '\\chi' },
    { symbol: '\\psi', name: 'Psi', preview: '\\psi' },
    { symbol: '\\omega', name: 'Omega', preview: '\\omega' }
  ],
  'Simboli Speciali': [
    { symbol: '\\infty', name: 'Infinito', preview: '\\infty' },
    { symbol: '\\emptyset', name: 'Insieme vuoto', preview: '\\emptyset' },
    { symbol: '\\in', name: 'Appartiene', preview: 'a \\in A' },
    { symbol: '\\notin', name: 'Non appartiene', preview: 'a \\notin A' },
    { symbol: '\\subset', name: 'Sottoinsieme', preview: 'A \\subset B' },
    { symbol: '\\supset', name: 'Sovrainsieme', preview: 'A \\supset B' },
    { symbol: '\\cup', name: 'Unione', preview: 'A \\cup B' },
    { symbol: '\\cap', name: 'Intersezione', preview: 'A \\cap B' },
    { symbol: '\\forall', name: 'Per ogni', preview: '\\forall' },
    { symbol: '\\exists', name: 'Esiste', preview: '\\exists' },
    { symbol: '\\nexists', name: 'Non esiste', preview: '\\nexists' },
    { symbol: '\\rightarrow', name: 'Freccia destra', preview: 'A \\rightarrow B' },
    { symbol: '\\leftarrow', name: 'Freccia sinistra', preview: 'A \\leftarrow B' },
    { symbol: '\\leftrightarrow', name: 'Doppia freccia', preview: 'A \\leftrightarrow B' },
    { symbol: '\\Rightarrow', name: 'Implica', preview: 'A \\Rightarrow B' },
    { symbol: '\\Leftrightarrow', name: 'Se e solo se', preview: 'A \\Leftrightarrow B' }
  ]
};

export function AdvancedEditorModal({ isOpen, onClose, question, onSave }: AdvancedEditorModalProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [richContent, setRichContent] = useState<RichContent[]>([
    { type: 'text', content: question.text, id: '1' }
  ]);
  const [activeTab, setActiveTab] = useState('editor');
  const [latexInput, setLatexInput] = useState('');
  const [latexPreview, setLatexPreview] = useState('');
  const [activeSymbolCategory, setActiveSymbolCategory] = useState('Operazioni Base');

  const renderLatex = useCallback((latex: string) => {
    // Rendering che emula lo stile KaTeX con stili inline
    if (!latex.trim()) return '';
    
    // Converti simboli comuni mantenendo lo stile matematico
    let rendered = latex
      // Frazioni
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 0.1em;"><span style="display: block; font-size: 0.8em; border-bottom: 1px solid; padding-bottom: 0.1em;">$1</span><span style="display: block; font-size: 0.8em; padding-top: 0.1em;">$2</span></span>')
      // Potenze e pedici
      .replace(/\^{([^}]+)}/g, '<sup style="font-size: 0.75em;">$1</sup>')
      .replace(/_{([^}]+)}/g, '<sub style="font-size: 0.75em;">$1</sub>')
      // Radici
      .replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '<span style="position: relative;"><sup style="font-size: 0.6em; position: absolute; top: -0.5em; left: -0.3em;">$1</sup>√<span style="border-top: 1px solid; padding-top: 0.1em;">$2</span></span>')
      .replace(/\\sqrt\{([^}]+)\}/g, '√<span style="border-top: 1px solid; padding-top: 0.1em;">$1</span>')
      // Valore assoluto
      .replace(/\|([^|]+)\|/g, '|$1|')
      // Funzioni trigonometriche
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\arcsin/g, 'arcsin')
      .replace(/\\arccos/g, 'arccos')
      .replace(/\\arctan/g, 'arctan')
      .replace(/\\sinh/g, 'sinh')
      .replace(/\\cosh/g, 'cosh')
      // Logaritmi
      .replace(/\\log/g, 'log')
      .replace(/\\ln/g, 'ln')
      // Simboli di calcolo
      .replace(/\\sum/g, '<span style="font-size: 1.4em;">∑</span>')
      .replace(/\\prod/g, '<span style="font-size: 1.4em;">∏</span>')
      .replace(/\\int/g, '<span style="font-size: 1.4em;">∫</span>')
      .replace(/\\oint/g, '<span style="font-size: 1.4em;">∮</span>')
      .replace(/\\iint/g, '<span style="font-size: 1.4em;">∬</span>')
      .replace(/\\iiint/g, '<span style="font-size: 1.4em;">∭</span>')
      .replace(/\\lim/g, 'lim')
      .replace(/\\to/g, '→')
      .replace(/\\nabla/g, '∇')
      .replace(/\\partial/g, '∂')
      .replace(/\\Delta/g, 'Δ')
      // Confronti
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\ll/g, '≪')
      .replace(/\\gg/g, '≫')
      .replace(/\\approx/g, '≈')
      .replace(/\\equiv/g, '≡')
      .replace(/\\sim/g, '∼')
      .replace(/\\propto/g, '∝')
      // Operazioni
      .replace(/\\pm/g, '±')
      .replace(/\\mp/g, '∓')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\cdot/g, '⋅')
      .replace(/\\%/g, '%')
      // Lettere greche minuscole
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\zeta/g, 'ζ')
      .replace(/\\eta/g, 'η')
      .replace(/\\theta/g, 'θ')
      .replace(/\\iota/g, 'ι')
      .replace(/\\kappa/g, 'κ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\nu/g, 'ν')
      .replace(/\\xi/g, 'ξ')
      .replace(/\\pi/g, 'π')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\chi/g, 'χ')
      .replace(/\\psi/g, 'ψ')
      .replace(/\\omega/g, 'ω')
      // Simboli speciali
      .replace(/\\infty/g, '∞')
      .replace(/\\emptyset/g, '∅')
      .replace(/\\in/g, '∈')
      .replace(/\\notin/g, '∉')
      .replace(/\\subset/g, '⊂')
      .replace(/\\supset/g, '⊃')
      .replace(/\\cup/g, '∪')
      .replace(/\\cap/g, '∩')
      .replace(/\\forall/g, '∀')
      .replace(/\\exists/g, '∃')
      .replace(/\\nexists/g, '∄')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\leftrightarrow/g, '↔')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\Leftrightarrow/g, '⇔');
    
    return `<span style="font-family: 'Times New Roman', serif; font-size: 1.1em; color: #374151;">${rendered}</span>`;
  }, []);

  const handleLatexPreview = (latex: string) => {
    setLatexInput(latex);
    const rendered = renderLatex(latex);
    setLatexPreview(rendered);
  };

  const insertMathSymbol = (symbol: string) => {
    const newInput = latexInput + symbol;
    setLatexInput(newInput);
    handleLatexPreview(newInput);
  };

  const addLatexToContent = () => {
    if (!latexInput.trim()) {
      toast.error('Inserisci una formula LaTeX valida');
      return;
    }

    const newContent: RichContent = {
      type: 'latex',
      content: latexInput,
      id: Date.now().toString()
    };

    setRichContent(prev => [...prev, newContent]);
    setLatexInput('');
    setLatexPreview('');
    toast.success('Formula aggiunta!');
  };

  const removeContent = (id: string) => {
    setRichContent(prev => prev.filter(item => item.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine deve essere inferiore a 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newContent: RichContent = {
        type: 'image',
        content: e.target?.result as string,
        id: Date.now().toString()
      };
      setRichContent(prev => [...prev, newContent]);
      toast.success('Immagine aggiunta!');
    };
    reader.readAsDataURL(file);
  };

  const generateFinalText = () => {
    return richContent.map(item => {
      switch (item.type) {
        case 'text':
          return item.content;
        case 'latex':
          return `[LATEX]${item.content}[/LATEX]`;
        case 'image':
          return `[IMAGE]${item.content}[/IMAGE]`;
        case 'table':
          return `[TABLE]${item.content}[/TABLE]`;
        default:
          return item.content;
      }
    }).join('\n\n');
  };

  const handleSave = () => {
    const finalText = generateFinalText();
    const updatedQuestion: Question = {
      ...editedQuestion,
      text: finalText,
      richContent: richContent // Store rich content for later use
    };
    
    onSave(updatedQuestion);
    toast.success('Domanda salvata con contenuto avanzato!');
    onClose();
  };

  const renderContentPreview = () => {
    return richContent.map((item, index) => (
      <div key={item.id} className="relative group border border-gray-200 rounded-lg p-3 mb-3">
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => removeContent(item.id)}
        >
          <X className="h-3 w-3" />
        </Button>
        
        <div className="text-xs text-gray-500 mb-2 font-semibold">
          {item.type === 'text' && 'Testo'}
          {item.type === 'latex' && 'Formula Matematica'}
          {item.type === 'image' && 'Immagine'}
          {item.type === 'table' && 'Tabella'}
        </div>
        
        {item.type === 'text' && (
          <p className="text-sm">{item.content}</p>
        )}
        
        {item.type === 'latex' && (
          <div 
            className="math-preview bg-gray-50 p-2 rounded border"
            dangerouslySetInnerHTML={{ __html: renderLatex(item.content) }}
          />
        )}
        
        {item.type === 'image' && (
          <img 
            src={item.content} 
            alt="Contenuto" 
            className="max-w-full h-auto max-h-32 object-contain border rounded"
          />
        )}
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Editor Avanzato - Domanda {question.id}
          </DialogTitle>
          <DialogDescription>
            Crea contenuti ricchi con formule matematiche, immagini e tabelle per verifiche STEM
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor Contenuti</TabsTrigger>
            <TabsTrigger value="math">Formule Matematiche</TabsTrigger>
            <TabsTrigger value="preview">Anteprima</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Content Editor */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Testo Base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full h-24 p-3 border rounded-md resize-none text-sm"
                      placeholder="Inserisci il testo della domanda..."
                      value={richContent[0]?.content || ''}
                      onChange={(e) => {
                        const updatedContent = [...richContent];
                        updatedContent[0] = { ...updatedContent[0], content: e.target.value };
                        setRichContent(updatedContent);
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Aggiungi Contenuti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setActiveTab('math')}>
                        <Calculator className="mr-2 h-3 w-3" />
                        Formula
                      </Button>
                      
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button size="sm" variant="outline" asChild>
                          <span>
                            <Image className="mr-2 h-3 w-3" />
                            Immagine
                          </span>
                        </Button>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Label>
                      
                      <Button size="sm" variant="outline" disabled>
                        <Table className="mr-2 h-3 w-3" />
                        Tabella (Prossimamente)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Live Preview */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Contenuti Aggiunti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    {richContent.length > 0 ? (
                      renderContentPreview()
                    ) : (
                      <p className="text-gray-500 text-sm">Nessun contenuto aggiunto ancora</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="math" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Math Toolbar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Simboli Matematici</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(mathSymbolCategories).map((category) => (
                        <Button
                          key={category}
                          size="sm"
                          variant={activeSymbolCategory === category ? 'default' : 'outline'}
                          className="text-xs h-7 px-2"
                          onClick={() => setActiveSymbolCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Symbol Grid */}
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                      {mathSymbolCategories[activeSymbolCategory as keyof typeof mathSymbolCategories]?.map((symbol, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="h-10 text-xs"
                          onClick={() => insertMathSymbol(symbol.symbol)}
                          title={symbol.name}
                        >
                          <div dangerouslySetInnerHTML={{ __html: renderLatex(symbol.preview) }} />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Editor LaTeX</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <textarea
                      className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                      placeholder="Scrivi la tua formula LaTeX qui..."
                      value={latexInput}
                      onChange={(e) => handleLatexPreview(e.target.value)}
                    />
                    <Button onClick={addLatexToContent} className="w-full">
                      Aggiungi Formula
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Math Preview */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Anteprima Formula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-24 flex items-center justify-center">
                      {latexPreview ? (
                        <div dangerouslySetInnerHTML={{ __html: latexPreview }} />
                      ) : (
                        <p className="text-gray-500 text-sm">L'anteprima apparirà qui</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Esempi Formule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <code className="block bg-gray-100 p-1 rounded">{'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'}</code>
                      <code className="block bg-gray-100 p-1 rounded">{'\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}'}</code>
                      <code className="block bg-gray-100 p-1 rounded">{'\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e'}</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Anteprima Finale Domanda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="font-semibold mb-4">
                    DOMANDA (Punti: {editedQuestion.points})
                  </div>
                  <div className="space-y-4">
                    {renderContentPreview()}
                  </div>
                  
                  {editedQuestion.type === 'multiple_choice' && editedQuestion.options && (
                    <div className="mt-6 space-y-2">
                      <div className="font-medium text-sm">Opzioni di risposta:</div>
                      {editedQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{String.fromCharCode(65 + index)})</span>
                          <span>{option}</span>
                          {index === editedQuestion.correctAnswer && (
                            <span className="text-green-600 font-bold">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-between">
          <Button onClick={onClose} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Annulla
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salva Domanda Avanzata
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}