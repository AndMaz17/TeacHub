# Teaching Hub 📚

Il tuo hub intelligente per tagliare i tempi morti nella preparazione didattica. Genera, archivia, correggi e riusa verifiche e materiali didattici con l'intelligenza artificiale.

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+ 
- Docker Desktop (opzionale, per servizi completi)
- Git

### Avvio Rapido (Locale)
```bash
# Clone del repository
git clone <repository-url>
cd teaching-hub

# Avvio automatico ambiente di sviluppo
./start-dev.sh
```

L'applicazione sarà disponibile su **http://localhost:3000**

### Avvio Manuale
```bash
# Installa dipendenze
npm install

# Avvia servizi (opzionali per il testing)
docker run -d --name teaching-hub-redis -p 6379:6379 redis:alpine

# Avvia Next.js
npm run dev
```

## 🎯 Funzionalità Principali

### ✅ Implementato (MVP)
- **🏠 Dashboard**: Panoramica attività e statistiche
- **📄 Gestione Documenti**: Interface per visualizzare e organizzare materiali
- **🧙‍♂️ Generatore AI**: Interface per creazione verifiche personalizzate
- **📋 Template**: Modelli riutilizzabili e condivisibili
- **🗄️ Archivio**: Collezione completa con ricerca avanzata
- **🎨 UI/UX**: Design responsivo e moderno
- **🔐 Sistema Autenticazione**: Pagine login/registrazione

### 🔄 In Sviluppo
- Database integration (Supabase/Prisma)
- AI integration (OpenAI GPT)
- Sistema autenticazione reale
- File upload e gestione
- Sistema di caching (Redis)

## 🏗️ Stack Tecnologico

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase + Prisma ORM  
- **Autenticazione**: Supabase Auth
- **Storage**: Local filesystem (development)
- **AI**: OpenAI GPT-4 (configurazione necessaria)
- **Cache**: Redis (opzionale)

## 📁 Struttura Progetto

```
teaching-hub/
├── src/
│   ├── app/                 # Pages (App Router)
│   │   ├── page.tsx        # Homepage
│   │   ├── dashboard/      # Dashboard docente
│   │   ├── documents/      # Gestione documenti
│   │   ├── generator/      # AI Generator
│   │   ├── templates/      # Template condivisi
│   │   ├── archive/        # Archivio materiali
│   │   └── login/          # Autenticazione
│   ├── components/         # Componenti riutilizzabili
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Layout components
│   ├── types/             # TypeScript types
│   └── lib/               # Utilities
├── prisma/                # Database schema
├── public/                # Static assets
└── start-dev.sh          # Script di avvio
```

## 🧪 Testing & Development

### Dati Mock
L'applicazione include dati di esempio per testare tutte le funzionalità senza bisogno di database o API esterne.

### Environment Variables
Crea un file `.env.local`:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/teaching_hub"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# OpenAI (per AI features)
OPENAI_API_KEY="your-openai-api-key"

# Stripe (per pagamenti)
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable"
```

### Comandi Utili
```bash
# Development server
npm run dev

# Build per production
npm run build

# Linting
npm run lint

# Prisma commands
npx prisma generate
npx prisma db push
npx prisma studio

# Supabase (se configurato)
supabase start
supabase stop
```

## 🎨 Design System

Il progetto utilizza un design system consistente basato su:
- **Colori**: Palette blu/indaco per elementi primari
- **Tipografia**: Sistema gerarchico chiaro
- **Spaziatura**: Sistema di spacing consistente
- **Componenti**: shadcn/ui per consistenza
- **Icone**: Lucide React per icone moderne

## 📋 TODO List

### Priorità Alta (P0)
- [ ] Integrazione database Supabase
- [ ] Sistema autenticazione funzionante
- [ ] AI integration per generazione contenuti
- [ ] File upload e storage

### Priorità Media (P1)  
- [ ] Sistema di cache Redis
- [ ] Search avanzato con filtri
- [ ] Sistema di notifiche
- [ ] Condivisione e collaborazione

### Priorità Bassa (P2)
- [ ] Analytics e reporting
- [ ] Sistema di pagamenti
- [ ] Export in vari formati
- [ ] Mobile app

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/nome-feature`)
3. Commit delle modifiche (`git commit -am 'Add nome-feature'`)
4. Push del branch (`git push origin feature/nome-feature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🆘 Support

Per problemi o domande:
- 🐛 **Bug**: Apri una issue su GitHub
- 💬 **Domande**: Usa le GitHub Discussions
- 📧 **Contatto**: [tuo-email@example.com]

---

Made with ❤️ for teachers who want to focus on what matters: **teaching**.
