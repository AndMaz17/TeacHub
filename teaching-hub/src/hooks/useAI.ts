import { useState } from 'react';
import { QuizContent, Question, DocumentType, Difficulty } from '@/types';

interface GenerateQuizParams {
  subject: string;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  type: 'literature' | 'stem' | 'quick';
  instructions?: string;
}

interface AIResponse {
  success: boolean;
  data?: QuizContent;
  error?: string;
}

// Mock AI responses per diversi tipi di materie
const mockResponses = {
  literature: {
    dante: {
      title: 'Verifica su Dante Alighieri - Inferno',
      instructions: 'Leggere attentamente i brani e rispondere alle domande seguenti. Tempo: 60 minuti.',
      questions: [
        {
          id: '1',
          text: 'Chi è Virgilio nella Divina Commedia e quale ruolo svolge nel viaggio di Dante?',
          type: 'open_ended' as const,
          points: 10
        },
        {
          id: '2', 
          text: 'Nel primo canto dell\'Inferno, Dante incontra tre fiere. Quali sono e cosa simboleggiano?',
          type: 'open_ended' as const,
          points: 15
        },
        {
          id: '3',
          text: 'Cosa rappresenta la "selva oscura" in cui si trova Dante all\'inizio del poema?',
          type: 'multiple_choice' as const,
          options: [
            'Una foresta reale in cui si è perso',
            'Lo smarrimento spirituale e morale',
            'I boschi intorno a Firenze',
            'Un sogno di Dante'
          ],
          correctAnswer: 1,
          points: 5
        }
      ],
      totalPoints: 30
    },
    manzoni: {
      title: 'Verifica su Alessandro Manzoni - I Promessi Sposi',
      instructions: 'Analizza i personaggi e i temi principali del romanzo.',
      questions: [
        {
          id: '1',
          text: 'Analizza la figura di Renzo Tramaglino: caratteristiche, evoluzione nel romanzo.',
          type: 'open_ended' as const,
          points: 12
        },
        {
          id: '2',
          text: 'Qual è il ruolo della Provvidenza nei Promessi Sposi?',
          type: 'open_ended' as const,
          points: 13
        },
        {
          id: '3',
          text: 'Chi è Don Abbondio?',
          type: 'multiple_choice' as const,
          options: [
            'Il parroco del paese di Renzo e Lucia',
            'Un nobile milanese',
            'Un mercante di seta',
            'Un bandito'
          ],
          correctAnswer: 0,
          points: 5
        }
      ],
      totalPoints: 30
    }
  },
  stem: {
    mathematics: {
      title: 'Test di Matematica - Equazioni di Secondo Grado',
      instructions: 'Risolvi gli esercizi mostrando tutti i passaggi. Calcolatrice non consentita.',
      questions: [
        {
          id: '1',
          text: 'Risolvi l\'equazione: x² - 5x + 6 = 0',
          type: 'open_ended' as const,
          points: 10
        },
        {
          id: '2',
          text: 'Determina per quali valori di k l\'equazione kx² - 2x + 1 = 0 ha soluzioni reali.',
          type: 'open_ended' as const,
          points: 15
        },
        {
          id: '3',
          text: 'Il discriminante di un\'equazione di secondo grado ax² + bx + c = 0 è:',
          type: 'multiple_choice' as const,
          options: [
            'b² - 4ac',
            'b² + 4ac', 
            '4ac - b²',
            'a² + b² + c²'
          ],
          correctAnswer: 0,
          points: 5
        }
      ],
      totalPoints: 30
    },
    physics: {
      title: 'Test di Fisica - Meccanica',
      instructions: 'Risolvi i problemi indicando le formule utilizzate.',
      questions: [
        {
          id: '1',
          text: 'Un corpo di massa 2 kg è soggetto a una forza di 10 N. Calcola l\'accelerazione.',
          type: 'open_ended' as const,
          points: 8
        },
        {
          id: '2',
          text: 'Enuncia la seconda legge di Newton e fornisci un esempio pratico.',
          type: 'open_ended' as const,
          points: 12
        },
        {
          id: '3',
          text: 'L\'unità di misura della forza nel Sistema Internazionale è:',
          type: 'multiple_choice' as const,
          options: ['Joule', 'Newton', 'Watt', 'Pascal'],
          correctAnswer: 1,
          points: 5
        }
      ],
      totalPoints: 25
    }
  },
  history: {
    title: 'Quiz di Storia - Rivoluzione Francese',
    instructions: 'Rispondi alle domande sulla Rivoluzione Francese.',
    questions: [
      {
        id: '1',
        text: 'In che anno iniziò la Rivoluzione Francese?',
        type: 'multiple_choice' as const,
        options: ['1788', '1789', '1790', '1791'],
        correctAnswer: 1,
        points: 3
      },
      {
        id: '2',
        text: 'Chi fu ghigliottinato il 21 gennaio 1793?',
        type: 'multiple_choice' as const,
        options: ['Luigi XVI', 'Maria Antonietta', 'Robespierre', 'Marat'],
        correctAnswer: 0,
        points: 3
      },
      {
        id: '3',
        text: 'Descrivi le cause principali della Rivoluzione Francese.',
        type: 'open_ended' as const,
        points: 14
      }
    ],
    totalPoints: 20
  }
};

export function useAI() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuiz = async (params: GenerateQuizParams): Promise<AIResponse> => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    try {
      let response: QuizContent;

      // Determine response based on subject and type
      const subject = params.subject.toLowerCase();
      const topic = params.topic.toLowerCase();

      if (params.type === 'literature' || subject.includes('letteratura')) {
        if (topic.includes('dante') || topic.includes('inferno')) {
          response = mockResponses.literature.dante;
        } else if (topic.includes('manzoni') || topic.includes('promessi')) {
          response = mockResponses.literature.manzoni;
        } else {
          // Default literature response
          response = {
            title: `Verifica di ${params.subject} - ${params.topic}`,
            instructions: 'Analizza attentamente i testi e rispondi alle domande seguenti.',
            questions: [
              {
                id: '1',
                text: `Analizza il tema principale di "${params.topic}" nel contesto letterario studiato.`,
                type: 'open_ended' as const,
                points: 15
              },
              {
                id: '2',
                text: `Quale tra queste affermazioni su "${params.topic}" è corretta?`,
                type: 'multiple_choice' as const,
                options: [
                  'Opzione A (generica)',
                  'Opzione B (corretta)',  
                  'Opzione C (generica)',
                  'Opzione D (generica)'
                ],
                correctAnswer: 1,
                points: 5
              }
            ],
            totalPoints: 20
          };
        }
      } else if (params.type === 'stem' || subject.includes('matematica') || subject.includes('fisica')) {
        if (subject.includes('matematica')) {
          response = mockResponses.stem.mathematics;
        } else if (subject.includes('fisica')) {
          response = mockResponses.stem.physics;
        } else {
          response = {
            title: `Test di ${params.subject} - ${params.topic}`,
            instructions: 'Risolvi gli esercizi mostrando tutti i passaggi.',
            questions: [
              {
                id: '1',
                text: `Risolvi il problema relativo a "${params.topic}"`,
                type: 'open_ended' as const,
                points: 12
              },
              {
                id: '2',
                text: `Formula principale per "${params.topic}":`,
                type: 'multiple_choice' as const,
                options: ['Formula A', 'Formula B (corretta)', 'Formula C', 'Formula D'],
                correctAnswer: 1,
                points: 8
              }
            ],
            totalPoints: 20
          };
        }
      } else {
        // Default quick quiz for other subjects
        response = {
          ...mockResponses.history,
          title: `Quiz di ${params.subject} - ${params.topic}`,
        };
      }

      // Adjust question count if requested
      if (params.questionCount && params.questionCount !== response.questions.length) {
        const questions = [...response.questions];
        if (params.questionCount > questions.length) {
          // Add more generic questions
          for (let i = questions.length; i < params.questionCount; i++) {
            questions.push({
              id: String(i + 1),
              text: `Domanda aggiuntiva ${i + 1} su "${params.topic}"`,
              type: 'open_ended' as const,
              points: 5
            });
          }
        } else {
          // Trim to requested count
          questions.splice(params.questionCount);
        }
        response.questions = questions;
        response.totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      }

      setIsGenerating(false);
      return { success: true, data: response };

    } catch (error) {
      setIsGenerating(false);
      return { 
        success: false, 
        error: 'Errore nella generazione della verifica. Riprova più tardi.' 
      };
    }
  };

  return {
    generateQuiz,
    isGenerating
  };
}