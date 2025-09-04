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

// Quick quiz generator with only multiple choice questions
const generateQuickMultipleChoiceQuiz = (subject: string, topic: string, questionCount: number): QuizContent => {
  const subjectTemplates = {
    'Matematica': [
      {
        text: `In ${topic}, quale formula è corretta per calcolare l'area?`,
        options: ['A = b × h', 'A = π × r²', 'A = (b + h) / 2', 'A = l × l'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `Quale proprietà è vera per ${topic}?`,
        options: ['È sempre positivo', 'Può essere negativo', 'È sempre intero', 'È sempre razionale'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `In un problema di ${topic}, quale approccio è più efficace?`,
        options: ['Metodo algebrico', 'Metodo grafico', 'Metodo numerico', 'Dipende dal problema'],
        correctAnswer: 3
      }
    ],
    'Storia': [
      {
        text: `L'evento principale riguardo a ${topic} avvenne in:`,
        options: ['XVIII secolo', 'XIX secolo', 'XX secolo', 'XVII secolo'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `Le cause principali di ${topic} furono:`,
        options: ['Economiche', 'Politiche', 'Sociali', 'Tutte le precedenti'],
        correctAnswer: 3
      },
      {
        text: `Le conseguenze di ${topic} influenzarono:`,
        options: ['Solo l\'Europa', 'Solo l\'America', 'Il mondo intero', 'Solo l\'Asia'],
        correctAnswer: 2
      }
    ],
    'Italiano': [
      {
        text: `L'autore più rappresentativo di ${topic} è:`,
        options: ['Dante Alighieri', 'Francesco Petrarca', 'Giovanni Boccaccio', 'Ludovico Ariosto'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `Lo stile letterario di ${topic} è caratterizzato da:`,
        options: ['Semplicità', 'Complessità', 'Realismo', 'Simbolismo'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `Il tema principale di ${topic} riguarda:`,
        options: ['L\'amore', 'La natura', 'La società', 'Tutti i precedenti'],
        correctAnswer: 3
      }
    ],
    'Scienze': [
      {
        text: `In ${topic}, l'elemento fondamentale è:`,
        options: ['Il carbonio', 'L\'ossigeno', 'L\'idrogeno', 'L\'azoto'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `Il processo più importante in ${topic} è:`,
        options: ['La fotosintesi', 'La respirazione', 'La digestione', 'La circolazione'],
        correctAnswer: Math.floor(Math.random() * 4)
      },
      {
        text: `La caratteristica principale di ${topic} è:`,
        options: ['Velocità', 'Precisione', 'Efficienza', 'Adattabilità'],
        correctAnswer: Math.floor(Math.random() * 4)
      }
    ]
  };

  const defaultTemplate = [
    {
      text: `Quale affermazione su ${topic} è corretta?`,
      options: ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'],
      correctAnswer: Math.floor(Math.random() * 4)
    },
    {
      text: `In che modo ${topic} influenza il risultato?`,
      options: ['Positivamente', 'Negativamente', 'Non influenza', 'Dipende dal contesto'],
      correctAnswer: 3
    },
    {
      text: `La caratteristica principale di ${topic} è:`,
      options: ['Innovativa', 'Tradizionale', 'Complessa', 'Semplice'],
      correctAnswer: Math.floor(Math.random() * 4)
    }
  ];

  const templates = subjectTemplates[subject as keyof typeof subjectTemplates] || defaultTemplate;
  const questions: Question[] = [];
  
  for (let i = 0; i < questionCount; i++) {
    const template = templates[i % templates.length];
    questions.push({
      id: String(i + 1),
      text: template.text,
      type: 'multiple_choice',
      options: template.options,
      correctAnswer: template.correctAnswer,
      points: 2
    });
  }

  return {
    title: `Quiz Rapido: ${subject} - ${topic}`,
    instructions: 'Quiz a risposta multipla. Seleziona la risposta corretta per ogni domanda. Tempo: 15 minuti.',
    questions,
    totalPoints: questionCount * 2,
    timeLimit: 15
  };
};

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
        // Generate quick quiz with only multiple choice questions
        response = generateQuickMultipleChoiceQuiz(params.subject, params.topic, params.questionCount || 10);
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