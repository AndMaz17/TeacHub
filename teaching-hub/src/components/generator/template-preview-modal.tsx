'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { QuizContent } from '@/types';
import { PDFTemplate } from './template-selector-modal';

export interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: PDFTemplate;
  quizContent: QuizContent | null;
  customData: any;
}

export function TemplatePreviewModal({ isOpen, onClose, template, quizContent, customData }: TemplatePreviewModalProps) {
  const [zoom, setZoom] = useState(1);

  const generatePreviewContent = () => {
    if (!quizContent) return null;

    // Use school info from customData
    const school = {
      schoolName: customData?.schoolName || 'ISTITUTO COMPRENSIVO "ALESSANDRO MANZONI"',
      schoolAddress: customData?.schoolAddress || 'Via dei Promessi Sposi, 25 - 20100 Milano (MI)',
      className: customData?.className || '3°A',
      date: new Date().toLocaleDateString('it-IT'),
      teacherName: customData?.teacherName || ''
    };

    return (
      <div className="bg-white shadow-xl border rounded-lg overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <div className="p-6 font-serif" style={{ width: '800px', minHeight: '600px' }}>
          {/* Render different headers based on template */}
          {renderTemplateHeader(template.id, school, quizContent)}
          
          {/* Instructions */}
          <div className="mb-6 bg-gray-50 border border-gray-200 p-4">
            <h3 className="font-bold text-gray-800 mb-2 text-center">ISTRUZIONI PER LO SVOLGIMENTO</h3>
            <div className="border-t border-gray-300 pt-3">
              <p className="text-gray-700 text-sm mb-3 text-center">{quizContent.instructions}</p>
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <span className="font-semibold text-gray-700">⏱ Tempo:</span>
                  <div className="font-bold text-gray-800">{quizContent.timeLimit} minuti</div>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-gray-700">🎯 Punteggio:</span>
                  <div className="font-bold text-gray-800">{quizContent.totalPoints} punti</div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Preview (first 2-3 questions) */}
          <div className="space-y-6">
            {quizContent.questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="bg-white border border-gray-200 p-4">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-gray-800">
                      DOMANDA {index + 1}
                    </h4>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {question.points} {question.points === 1 ? 'punto' : 'punti'}
                  </Badge>
                </div>
                
                {/* Question Text */}
                <div className="mb-4 bg-gray-50 p-3 border-l-4 border-gray-400">
                  <p className="text-gray-800 leading-relaxed text-sm">
                    {question.text.length > 100 ? question.text.substring(0, 100) + '...' : question.text}
                  </p>
                </div>
                
                {/* Answer Section */}
                {question.type === 'multiple_choice' && question.options ? (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 mb-2 text-sm">Opzioni di risposta:</h5>
                    {question.options.slice(0, 2).map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 text-sm">
                        <div className="w-6 h-6 bg-gray-700 text-white flex items-center justify-center font-bold text-xs">
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                        <span className="text-gray-800">
                          {option.length > 50 ? option.substring(0, 50) + '...' : option}
                        </span>
                      </div>
                    ))}
                    {question.options.length > 2 && (
                      <div className="text-xs text-gray-500 italic">... e altre {question.options.length - 2} opzioni</div>
                    )}
                    <div className="mt-3 p-2 bg-gray-50 border border-gray-300">
                      <span className="font-semibold text-gray-800 text-sm">✏️ Risposta:</span>
                      <div className="border-b-2 border-gray-400 w-16 h-6 ml-2 inline-block"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-700 mb-2 text-sm">Spazio per la risposta:</h5>
                    {[1, 2, 3].map(line => (
                      <div key={line} className="border-b-2 border-gray-300 h-6"></div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {quizContent.questions.length > 3 && (
              <div className="text-center py-4 bg-gray-100 border-2 border-dashed border-gray-300">
                <span className="text-gray-600 italic">... e altre {quizContent.questions.length - 3} domande</span>
              </div>
            )}
          </div>

          {/* Footer - Evaluation Section */}
          <div className="mt-8 bg-gray-50 border border-gray-800 border-t-4 p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">VALUTAZIONE</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 border border-gray-300 text-center">
                <p className="text-sm font-semibold text-gray-600 mb-2">PUNTEGGIO OTTENUTO</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="border-b-2 border-gray-400 w-12 h-8 bg-gray-50"></div>
                  <span className="font-bold text-gray-700">/ {quizContent.totalPoints}</span>
                  <span className="text-sm text-gray-500">punti</span>
                </div>
              </div>

              <div className="bg-white p-3 border border-gray-300 text-center">
                <p className="text-sm font-semibold text-gray-600 mb-2">VOTO FINALE</p>
                <div className="border-b-2 border-gray-400 w-16 h-8 bg-gray-50 mx-auto"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">Docente:</span>
                <div className="flex-1 border-b-2 border-gray-400 h-6 bg-gray-50"></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">Firma:</span>
                <div className="flex-1 border-b-2 border-gray-400 h-6 bg-gray-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTemplateHeader = (templateId: string, school: any, quizContent: QuizContent) => {
    switch (templateId) {
      case 'school-standard':
        return (
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-xl font-bold mb-2">{school.schoolName}</h1>
            <p className="text-gray-600 mb-4">{school.schoolAddress}</p>
            <h2 className="text-2xl font-bold mb-4">VERIFICA DI {quizContent.title.split(' - ')[0]?.toUpperCase()}</h2>
            <div className="flex justify-between text-sm mb-4">
              <span>Classe: {school.className}</span>
              <span>Data: {school.date}</span>
            </div>
            <div className="flex justify-between">
              <div>Nome: ______________________</div>
              <div>Cognome: ______________________</div>
            </div>
          </div>
        );

      case 'university-formal':
        return (
          <div className="border-2 border-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 mb-6">
            <div className="text-center border-b-2 border-purple-300 pb-4 mb-4">
              <div className="bg-purple-800 text-white p-2 inline-block mb-3">
                <h1 className="text-sm font-bold">{school.schoolName}</h1>
              </div>
              <p className="text-xs text-purple-700 mb-2">{school.schoolAddress}</p>
              <div className="bg-white border-2 border-purple-800 p-4 mx-8">
                <h2 className="text-lg font-bold text-purple-800">ESAME DI {quizContent.title.split(' - ')[0]?.toUpperCase()}</h2>
                <div className="text-xs text-purple-600 mt-2 font-semibold">
                  Anno Accademico {new Date().getFullYear()}/{new Date().getFullYear() + 1}
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-70 p-3 border border-purple-300">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><strong>Corso:</strong> {school.className}</div>
                <div><strong>Sessione:</strong> {school.date}</div>
                <div><strong>Matricola:</strong> __________</div>
                <div><strong>Candidato:</strong> ________________________</div>
              </div>
            </div>
          </div>
        );

      case 'exam-grid':
        return (
          <div className="border-4 border-red-600 bg-red-50 p-4 mb-6">
            <div className="bg-red-600 text-white p-3 text-center mb-4">
              <h1 className="text-sm font-bold uppercase tracking-wide">{school.schoolName}</h1>
              <h2 className="text-lg font-bold mt-1">PROVA D'ESAME UFFICIALE</h2>
              <div className="text-xs mt-2 bg-white text-red-600 inline-block px-3 py-1 font-bold">
                {quizContent.title.split(' - ')[0]?.toUpperCase()}
              </div>
            </div>
            
            <div className="bg-white border-2 border-red-400 p-3 mb-4">
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="font-bold">CLASSE: {school.className}</div>
                <div className="font-bold">DATA: {school.date}</div>
                <div className="font-bold">DURATA: 90 min</div>
              </div>
              <div className="border-t border-red-200 pt-2 grid grid-cols-2 gap-4 text-xs">
                <div>CANDIDATO: ________________________</div>
                <div>N. PROTOCOLLO: _______________</div>
              </div>
            </div>
            
            <div className="bg-yellow-100 border-2 border-yellow-400 p-3">
              <p className="font-bold text-xs mb-2 text-center">📊 GRIGLIA DI VALUTAZIONE</p>
              <div className="grid grid-cols-4 gap-1 text-xs">
                <div className="bg-white p-1 text-center border"><strong>Conoscenze</strong><br/>___/10</div>
                <div className="bg-white p-1 text-center border"><strong>Competenze</strong><br/>___/10</div>
                <div className="bg-white p-1 text-center border"><strong>Abilità</strong><br/>___/5</div>
                <div className="bg-red-200 p-1 text-center border font-bold"><strong>TOTALE</strong><br/>___/25</div>
              </div>
            </div>
          </div>
        );

      case 'minimalist':
        return (
          <div className="text-left mb-4 border-b border-gray-300 pb-4">
            <h1 className="text-xl font-bold mb-2 text-gray-800">
              {quizContent.title.split(' - ')[0]?.toUpperCase()}
            </h1>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{school.date}</span>
              <span>Tempo: {quizContent.timeLimit} min</span>
            </div>
            <div className="text-sm text-gray-700">
              Nome: ______________________
            </div>
          </div>
        );

      case 'quiz-compact':
        return (
          <div className="bg-yellow-400 border-2 border-yellow-600 p-2 mb-4">
            <div className="bg-black text-yellow-400 p-2 text-center mb-2">
              <h1 className="text-sm font-bold tracking-widest">⚡ QUIZ RAPIDO ⚡</h1>
              <div className="text-xs font-bold">{quizContent.title.split(' - ')[0]?.toUpperCase()}</div>
            </div>
            <div className="bg-white p-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold">📅 {school.date}</span>
                <span className="font-bold">⏰ 20 min</span>
                <span className="font-bold">🎯 {quizContent.totalPoints} pt</span>
              </div>
              <div className="border-t border-yellow-300 pt-1 text-xs grid grid-cols-3 gap-2">
                <div>Nome: __________</div>
                <div>Classe: {school.className}</div>
                <div>Punti: ___/___</div>
              </div>
            </div>
          </div>
        );

      default:
        return renderTemplateHeader('school-standard', school, quizContent);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {template.icon}
              Anteprima: {template.name}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono">{Math.round(zoom * 100)}%</span>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Questa è l'anteprima di come apparirà il documento con il template selezionato
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 p-6 max-h-[70vh]">
          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              {generatePreviewContent()}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Chiudi Anteprima
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}