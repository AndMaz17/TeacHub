# Teaching Hub - Specifiche Complete per Sviluppo 📚🚀

## 🎯 VISION & POSITIONING

### Concept Core
Teaching Hub NON è un "registro elettronico 2.0", ma un **hub intelligente che taglia i tempi morti agli insegnanti**. È il gestore smart di documenti, verifiche e materiali didattici, pronto in pochi click.

### Value Proposition
- **Per Letterari**: Praticamente un copilota completo - generi, archivi, correggi, riusi
- **Per STEM**: Un toolbox intelligente - parametri, archivio, generatore varianti, semi-correzione  
- **Per Tutti**: Meno burocrazia, più didattica. Elimina il lavoro ripetitivo e lascia il docente libero di insegnare

### Differenziazione
- Non sostituisce il registro elettronico → si integra come "coltellino svizzero" del docente
- Pochi fronzoli, zero complicazioni → focalizzato su produttività immediata
- Pensato per uso quotidiano: "oggi mi serve una verifica? La tiro fuori in 5 minuti"

---

## 🎯 TARGET MARKET & BUSINESS MODEL

### Target Demografico
- **Primary**: Docenti italiani 25-35 anni (neo-immessi, precari, tech-savvy, nativi digitali)
- **Secondary**: Docenti 35-40 anni (stabili ma aperti al cambiamento, coordinatori/referenti)
- **Market Size**: ~150,000-200,000 docenti target su 500,000 totali in Italia
- **Early Adopters**: ~50,000 docenti digitalmente attivi

### Pricing Strategy
- **Modello**: SaaS B2C con pagamento annuale
- **Prezzo**: €19.99/anno (€1.66/mese)
- **Rationale**: Barrier psicologica zero, compatibile Carta Docente (€500/anno), viral-friendly
- **Future tiers**: 
  - Free: 5 verifiche/anno
  - Basic: €19.99/anno (25 verifiche/mese + archivio)
  - Pro: €39.99/anno (unlimited + AI correzione + collaboration)
  - School: €199/anno (multi-docente + admin features)

### Revenue Projections
```
Anno 1: 2,000 docenti × €19.99 = €40k ARR
Anno 2: 8,000 docenti × €19.99 = €160k ARR
Anno 3: 20,000 docenti × €19.99 = €400k ARR
Anno 4: 50,000 docenti × €19.99 = €1M ARR (target ambizioso)
```

### Unit Economics
- LTV (4 anni retention): €79.96
- CAC target: €5-15 (viral growth)
- LTV/CAC ratio: 5-16x
- Breakeven: 60 docenti paganti

---

## ⚙️ FUNZIONALITÀ CORE

### 1. Archivio Centralizzato
- **Scope**: Tutti i materiali didattici in un unico posto (verifiche, appunti, domande, test)
- **Search**: Ricerca rapidissima - "trovami la verifica di Dante dell'anno scorso" → subito disponibile
- **Organization**: Tagging automatico, categorizzazione per materia/argomento/difficoltà
- **Storage**: File upload (PDF, DOC, immagini), OCR per ricerca nel contenuto

### 2. Generatore di Verifiche & Test
**Materie Letterarie/Umanistiche (killer feature)**:
- Domande aperte su testi/argomenti
- Comprensione del testo con domande auto-generate
- Domande a crocette con distrattori intelligenti
- Varianti multiple della stessa verifica (anti-copia)

**Materie STEM**:
- Generatori parametrizzati (equazioni, problemi fisici)
- AI che propone varianti matematiche con soluzioni
- Template per diversi tipi di esercizi
- Controllo automatico risultati numerici

### 3. Correzione Assistita
- **Crocette**: Correzione automatica completa
- **Domande chiuse**: Pattern matching e scoring automatico
- **Domande aperte**: AI propone valutazioni e suggerimenti, docente conferma/modifica
- **STEM**: AI segnala corretto/errato sui risultati, docente valuta i passaggi
- **Rubric system**: Criteri di valutazione personalizzabili

### 4. Riutilizzo & Adattamento
- **Archivio "vivo"**: Verifiche passate diventano base per future, aggiornate e remixate
- **AI suggestions**: Variazioni per alzare/abbassare difficoltà
- **Version control**: Storico delle modifiche e iterazioni
- **Template system**: Salva formati ricorrenti per riuso veloce

### 5. Collaborazione e Condivisione
- **Libreria personale**: Materiali privati del docente
- **Libreria di istituto**: Condivisione con colleghi dello stesso istituto
- **Condivisione dipartimento**: Materiali comuni per materia
- **Public library**: Repository community-driven (opt-in)
- **Permission system**: Controllo granulare su chi può vedere/modificare

### 6. Calendario e Pianificazione
- **Non è un planner automatico**: Calendario manuale dove il docente inserisce attività previste
- **Planning annuale**: Overview dell'anno scolastico
- **Deadline tracking**: Scadenze verifiche, consegne, eventi
- **Integration ready**: Possibile sync con Google Calendar

---

## 🏗️ ARCHITETTURA TECNICA

### Stack Tecnologico Scelto (Scenario 2 - MVP)

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui  
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Rich Text Editor**: Tiptap (per inserimento domande/materiali)
- **File Upload**: UploadThing
- **PDF Viewer**: React-PDF
- **Charts**: Recharts (per analytics future)

#### Backend & Database
- **Full-stack**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **ORM**: Prisma (per migration-readiness)
- **Cache**: Upstash Redis (per sessioni e query frequenti)
- **Search**: Built-in PostgreSQL full-text search (MVP), Elasticsearch per scale futura

#### AI & Integrazione
- **LLM Provider**: OpenAI GPT-4 (generazione) + GPT-3.5 (task semplici per cost optimization)
- **AI SDK**: Vercel AI SDK
- **Prompt Engineering**: Template system per different educational contexts
- **Rate Limiting**: Usage controls per contenere costi

#### Storage & CDN
- **File Storage**: Supabase Storage (MVP) → migrazione futura su Cloudflare R2
- **CDN**: Vercel Edge Network
- **Backup**: Automated backup Supabase

#### Autenticazione & Security
- **Auth**: Supabase Auth con provider:
  - Google (facilità per docenti)
  - Email/Password
  - SPID integration (futuro per PA)
- **Security**: RLS (Row Level Security), CSRF protection
- **GDPR**: EU server regions, data compliance built-in

#### Pagamenti
- **Provider**: Stripe
- **Subscription**: Stripe Billing per abbonamenti annuali
- **Webhooks**: Gestione stato abbonamenti
- **Carta Docente**: Integration futura con sistema ministeriale

#### Hosting & Deploy
- **Platform**: Vercel (frontend + API)
- **Domain**: Custom domain + SSL automatico
- **CI/CD**: GitHub + Vercel auto-deploy
- **Monitoring**: Vercel Analytics + Sentry per error tracking

### Architettura Migration-Ready

#### Abstraction Layers (per futuro Scenario 1)
```typescript
// Services astratti per facilitare migrazione futura
interface AuthService {
  login(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User | null>;
}

interface StorageService {
  upload(file: File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
}

interface DatabaseService {
  getUser(id: string): Promise<User>;
  createDocument(data: DocumentData): Promise<Document>;
}
```

#### Database Schema (Prisma)
```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String
  school      String?
  subject     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  documents   Document[]
  templates   Template[]
  @@map("users")
}

model Document {
  id          String   @id @default(uuid())
  title       String
  content     Json
  type        DocumentType
  subject     String
  grade       String?
  difficulty  Difficulty
  tags        String[]
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  @@map("documents")
}

enum DocumentType {
  QUIZ
  TEST
  HOMEWORK
  LESSON_PLAN
  MATERIAL
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

---

## 💰 COSTI E BUDGET

### Costi Mensili MVP (0-500 utenti)
- **Vercel**: €0 (Hobby plan)
- **Supabase**: €0 (Free tier: 500MB DB + 1GB storage)  
- **Upstash Redis**: €0 (Free tier: 10k requests/day)
- **OpenAI**: €20-40 (usage-based con rate limiting)
- **Stripe**: €5-15 (solo fee su transazioni)
- **Cloudflare R2**: €0 (Free tier: 10GB)
- **Dominio**: €1/mese
- **Totale MVP**: €26-56/mese

### Scaling Costs (500-2000 utenti)  
- **Vercel Pro**: €20/mese
- **Supabase Pro**: €25/mese
- **Redis**: €5-15/mese
- **OpenAI**: €80-150/mese
- **Altri**: €20-50/mese
- **Totale Scale**: €150-260/mese

### Budget Raccomandato
- **Setup iniziale**: €500
- **Primi 6 mesi**: €50/mese media
- **Anno 1 completo**: €1,200 totali
- **Break-even**: 60 docenti paganti

---

## 🚀 GO-TO-MARKET STRATEGY

### Canali di Acquisizione
1. **Social Media Education**:
   - TikTok Educational (video "Come genero verifiche in 30 secondi")
   - Instagram Stories con tips didattici
   - YouTube channel "Teaching Hacks"

2. **Community Penetration**:
   - Gruppi Facebook: "Docenti 2.0", "Insegnanti Innovativi"
   - LinkedIn teacher communities
   - Reddit r/italy r/ItaliaPersonalFinance (docenti giovani)

3. **Influencer & Partnership**:
   - Collaboration con teacher-influencer
   - Partnership associazioni docenti
   - Presenza eventi education

4. **Referral Program**:
   - "Invita collega = 6 mesi gratis"
   - School referral bonus
   - Content creator affiliate program

### Content Marketing Strategy
- **Educational Content**: Tutorial su didattica innovativa
- **Time-Saving Tips**: "Dalla preparazione alla correzione in 15 minuti"  
- **Case Studies**: Success stories di docenti early adopter
- **Social Proof**: Screenshot risultati, testimonials video

### Launch Strategy
1. **Beta Phase (3 mesi)**: 100 docenti selezionati, feedback intensivo
2. **Soft Launch (3 mesi)**: 500 early adopters, referral program
3. **Public Launch (6+ mesi)**: Marketing full scale, PR push

---

## 📅 DEVELOPMENT ROADMAP

### Phase 1: Core MVP (2-3 mesi)
**Week 1-2**: Project setup + Database schema
- Next.js + Supabase project initialization
- Prisma schema + migrations
- Basic auth flow (Google + Email)
- User dashboard skeleton

**Week 3-4**: Document Management Core  
- File upload system (PDF, DOC, images)
- Basic document CRUD
- Simple categorization (subject, type)
- Search functionality (text-based)

**Week 5-6**: Basic Quiz Generator
- Template-based question generation
- Multiple choice + open questions
- Simple PDF export
- Save/load functionality

**Week 7-8**: User Management & Security
- User profiles + school info
- Basic permission system
- Data validation + security
- Error handling

**Week 9-10**: AI Integration MVP
- OpenAI API integration
- Basic prompt templates
- Question generation (literature focus)
- Usage tracking + rate limiting

**Week 11-12**: Polish & Deploy
- UI/UX refinements
- Payment integration (Stripe)
- Production deployment
- Basic analytics

### Phase 2: Advanced Features (2-3 mesi)
**Month 1**: AI Enhancement
- Advanced question generation (STEM)
- Multiple choice with smart distractors
- Difficulty adjustment algorithms
- Question variation generation

**Month 2**: Collaboration Features
- Document sharing system  
- School/department libraries
- Commenting + feedback system
- Version control for documents

**Month 3**: Advanced Correction
- AI-assisted grading suggestions
- Rubric system implementation
- Batch correction tools
- Performance analytics

### Phase 3: Scale & Optimization (3+ mesi)
- Performance optimization
- Advanced search (Elasticsearch)
- Mobile responsiveness
- API rate optimization
- Advanced analytics dashboard
- Enterprise features (school admin)

---

## 🎯 SUCCESS METRICS & KPIs

### Product Metrics
- **MAU (Monthly Active Users)**: Target crescita 20% month-over-month
- **Document Creation Rate**: Average per user per month
- **AI Usage**: Questions generated per user
- **Feature Adoption**: % users using each major feature
- **Session Duration**: Time spent in app per session

### Business Metrics  
- **MRR (Monthly Recurring Revenue)**: €19.99 × active subscribers / 12
- **Churn Rate**: Target <5% monthly for annual subscriptions
- **Customer Acquisition Cost (CAC)**: Target <€15 per user
- **Lifetime Value (LTV)**: Target >€60 (3+ years retention)
- **Viral Coefficient**: Referrals per active user

### User Experience Metrics
- **Time to First Value**: Minutes to generate first quiz
- **NPS (Net Promoter Score)**: Target >50
- **Support Tickets**: Per 100 active users per month
- **Feature Request Volume**: Community engagement level

---

## 🔒 COMPLIANCE & SECURITY

### GDPR Compliance
- **Data Processing**: Legitimate interest + consent for AI features
- **Data Storage**: EU servers only (Supabase EU region)  
- **Right to Deletion**: Complete data purge capability
- **Data Portability**: Export functionality for user data
- **Privacy Policy**: Clear, education-sector specific

### Educational Data Security
- **Student Privacy**: No student personal data collection
- **Document Security**: Encryption at rest + in transit
- **Access Control**: Granular permissions system
- **Audit Logging**: Complete activity tracking
- **Backup & Recovery**: Automated backup with encryption

### Legal Considerations
- **Terms of Service**: Education-sector appropriate
- **Content Liability**: Clear guidelines on AI-generated content
- **Intellectual Property**: User content ownership rights
- **Age Restrictions**: Teachers only (18+ enforcement)

---

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### AI Implementation Strategy
```typescript
// Cascading AI usage for cost optimization
const generateQuestions = async (topic: string, difficulty: Level) => {
  // 1. Check cache first
  const cached = await redis.get(`questions:${topic}:${difficulty}`);
  if (cached) return cached;
  
  // 2. Use GPT-3.5 for simple tasks
  if (difficulty === 'EASY') {
    return await generateWithGPT35(topic, difficulty);
  }
  
  // 3. Use GPT-4 only for complex tasks
  return await generateWithGPT4(topic, difficulty);
};
```

### Database Optimization
- **Indexing Strategy**: Full-text search on content, tags, subjects
- **Caching Layer**: Redis for frequently accessed documents
- **File Storage**: Compression + CDN optimization
- **Query Optimization**: Prepared statements + connection pooling

### Migration Readiness
- **Service Abstraction**: All external services behind interfaces  
- **Configuration Management**: Environment-based configs
- **Database Portability**: Prisma schema works with any PostgreSQL
- **API Design**: RESTful design ready for microservices split

---

## 🎉 FUTURE EXPANSION OPPORTUNITIES

### Product Extensions
- **Mobile App**: Native iOS/Android per usage on-the-go
- **Advanced Analytics**: Student performance insights
- **Parent Integration**: Homework tracking, progress reports  
- **LMS Integration**: Moodle, Google Classroom connectors

### Market Extensions  
- **Geographic**: Spain, France, other EU markets
- **Demographic**: Expand to 40+ age group with simplified UI
- **Institutional**: Direct school/district sales
- **Adjacent Markets**: Tutoring centers, homeschooling parents

### Technology Evolution
- **Advanced AI**: Custom fine-tuned models for Italian education
- **Voice Integration**: Voice-to-text for question generation
- **AR/VR**: Immersive quiz creation tools
- **Blockchain**: Secure credential verification

---

## ⚡ CRITICAL SUCCESS FACTORS

### Must-Have Day 1
- **Intuitive UX**: Docenti devono capire tutto in 2 minuti
- **Reliable AI**: Question generation deve funzionare sempre
- **Fast Performance**: Loading time <3 secondi sempre
- **Mobile Ready**: Responsive design perfetto

### Growth Catalysts
- **Viral Features**: Easy sharing, impressive demos
- **Community Building**: User-generated content, testimonials
- **Seasonal Marketing**: Back-to-school campaigns
- **Word-of-Mouth**: Referral program effectiveness

### Risk Mitigation
- **AI Cost Control**: Usage caps + optimization algorithms
- **Competition Response**: Feature differentiation maintenance
- **Regulatory Changes**: GDPR compliance monitoring  
- **Technical Debt**: Clean architecture from day 1

---

## 💡 IMPLEMENTATION PRIORITY MATRIX

### P0 (Blockers)
- User auth + basic document upload
- Simple question generation (templates)
- Payment integration
- Core search functionality

### P1 (High Impact)
- AI-powered question generation  
- Document categorization + tagging
- Basic collaboration features
- Mobile responsive design

### P2 (Nice to Have)
- Advanced AI features
- Analytics dashboard
- Advanced search
- Enterprise features

### P3 (Future)
- Mobile app
- Advanced integrations
- International expansion
- Advanced AI/ML features

---

## 🎯 CONCLUSION

Teaching Hub ha il potenziale per diventare **il Notion per docenti italiani** - uno strumento essenziale che ogni insegnante della nuova generazione utilizzerà quotidianamente.

**Chiavi del successo**:
1. **Focus ossessivo** sull'usabilità per docenti
2. **AI implementation** intelligente e cost-effective  
3. **Viral growth** attraverso social proof e referral
4. **Execution velocity** per first-mover advantage

**Target realistico**: 50,000 docenti attivi in 4 anni = €1M ARR

---

## 🏠 DEVELOPMENT ENVIRONMENT SETUP

### Local Development Priority
**IMPORTANTE**: Per la prima fase di sviluppo, tutto deve funzionare in **localhost** sul PC di sviluppo. Nessun deploy su server esterni fino a quando non avremo un MVP funzionante e testato localmente.

### Local Stack Configuration
```bash
# Setup locale richiesto:
- Next.js dev server: http://localhost:3000
- Supabase local instance: supabase start (Docker)
- Database locale: PostgreSQL via Supabase CLI
- Redis locale: Docker container o local install
- File storage: filesystem locale (no cloud storage)
- AI testing: OpenAI API (solo service esterno necessario)
```

### Local Development Workflow
1. **Setup iniziale**: `npx create-next-app` + Supabase CLI init
2. **Database**: Supabase local con migrations
3. **Auth**: Supabase local auth (no OAuth external per ora)
4. **File uploads**: Local filesystem storage
5. **AI integration**: OpenAI API con API key in .env.local
6. **Payment testing**: Stripe test mode (webhook locale con ngrok se necessario)

### Testing Setup Completo (Zero External APIs)

#### **Seed Data per Testing**
```typescript
// prisma/seed.ts - Crea dati di test
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Test user
  const testUser = await prisma.user.create({
    data: {
      email: 'docente.test@scuola.it',
      name: 'Mario Rossi',
      school: 'Liceo Scientifico Galilei',
      subject: 'Letteratura Italiana'
    }
  });

  // Test documents
  await prisma.document.createMany({
    data: [
      {
        title: 'Verifica Dante - Inferno',
        content: { questions: ['Chi è Virgilio?', 'Descrivi il primo cerchio'] },
        type: 'QUIZ',
        subject: 'Letteratura',
        difficulty: 'MEDIUM',
        tags: ['dante', 'inferno', 'letteratura'],
        userId: testUser.id
      },
      {
        title: 'Test Promessi Sposi',
        content: { questions: ['Analizza Renzo', 'Il tema della Provvidenza'] },
        type: 'TEST',
        subject: 'Letteratura',
        difficulty: 'HARD',
        tags: ['manzoni', 'promessi-sposi'],
        userId: testUser.id
      }
    ]
  });
}

main();
```

```bash
# Esegui seed per popolare database
npx prisma db seed
```

#### **File Uploads Locale**
```bash
# Crea cartella per uploads
mkdir -p public/uploads

# .gitignore - aggiungi questa linea
public/uploads/*
!public/uploads/.gitkeep

# Crea .gitkeep per mantenere la cartella
touch public/uploads/.gitkeep
```

#### **Testing UI Components**
```typescript
// components/TestingPanel.tsx - Panel per testing rapido
export function TestingPanel() {
  const [isVisible, setIsVisible] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-500 text-white p-2 rounded"
      >
        🧪 Test
      </button>
      
      {isVisible && (
        <div className="bg-white border p-4 rounded shadow-lg">
          <h3>Testing Panel</h3>
          <button onClick={() => mockAIService.generateQuestions('Dante', 'medium')}>
            Test AI Generation
          </button>
          <button onClick={() => mockPaymentService.createPayment(1999)}>
            Test Payment
          </button>
        </div>
      )}
    </div>
  );
}
```

### Troubleshooting Common Issues

#### **Supabase Issues**
```bash
# Se supabase start non funziona:
supabase stop
docker system prune -f
supabase start

# Se Database connection fails:
# Verifica che Docker sia in running
docker ps
```

#### **Redis Issues**
```bash
# Se Redis non si avvia:
docker stop teaching-hub-redis
docker rm teaching-hub-redis  
docker run -d --name teaching-hub-redis -p 6379:6379 redis:alpine
```

#### **Next.js Issues**
```bash
# Se hot reload non funziona:
rm -rf .next
npm run dev

# Se Prisma genera errori:
npx prisma generate
npx prisma db push
```

### Daily Development Routine
```bash
# Script per avviare tutto (crea start-dev.sh)
#!/bin/bash
echo "🚀 Starting Teaching Hub Development Environment..."

# Check Docker
if ! docker ps &> /dev/null; then
    echo "❌ Docker not running. Please start Docker Desktop."
    exit 1
fi

# Start Supabase
echo "📀 Starting Supabase..."
supabase start

# Start Redis
echo "🔴 Starting Redis..."
docker start teaching-hub-redis || docker run -d --name teaching-hub-redis -p 6379:6379 redis:alpine

# Start Next.js
echo "⚛️  Starting Next.js..."
npm run dev
```

```bash
# Rendi eseguibile
chmod +x start-dev.sh

# Uso quotidiano
./start-dev.sh
```

### Production Readiness Checklist
Prima di passare ai servizi cloud, verifica che funzioni tutto in locale:

- ✅ **User Registration/Login**: Auth flow completo
- ✅ **Document CRUD**: Create, Read, Update, Delete documenti  
- ✅ **File Upload**: Upload PDF/DOC e preview
- ✅ **AI Mock**: Question generation con mock responses
- ✅ **Search**: Ricerca nei documenti e tag
- ✅ **Payment Mock**: Payment flow UI completo
- ✅ **Responsive Design**: Mobile + desktop
- ✅ **Error Handling**: Gestione errori graceful
- ✅ **Performance**: < 3 secondi load time
- ✅ **Data Persistence**: Dati salvati correttamente in DB

**Solo quando tutto questo checklist è ✅ passa a servizi cloud e account reali!**

### Quando Passare a Production
Solo dopo che:
- ✅ Tutte le funzionalità core funzionano in locale
- ✅ UI/UX è soddisfacente
- ✅ Performance locali sono buone
- ✅ Testing completo delle user journey
- ✅ Sistema di autenticazione solido

**Con questo brief, Claude Code ha tutto il necessario per iniziare lo sviluppo immediatamente in localhost!** 🚀