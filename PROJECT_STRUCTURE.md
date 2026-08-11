/**
 * KnowFlow — Texnik Loyiha Tuzilmasi
 * ==================================
 * Frontend: React + TypeScript + Vite + TailwindCSS
 * Backend:  NestJS + PostgreSQL (pgvector) + Redis + BullMQ
 * DevOps:   Docker + Docker Compose
 *
 * Monorepo (frontend + backend bitta repo da) — CV loyiha uchun aniq tuzilma.
 */

knowflow/
├── client/                      # React + TSX frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                 # HTTP layer — backend bilan aloqa
│   │   │   ├── client.ts        # axios instance (baseURL, interceptors)
│   │   │   ├── auth.api.ts       # login, register, logout, me
│   │   │   ├── workspace.api.ts  # workspace CRUD
│   │   │   ├── document.api.ts   # upload, list, get, delete
│   │   │   ├── chat.api.ts       # conversations, messages, AI send
│   │   │   └── member.api.ts     # workspace members, invite
│   │   ├── components/           # qayta ishlanadigan UI komponentlar
│   │   │   ├── ui/               # base atoms (Button, Input, Card, Badge...)
│   │   │   ├── layout/           # AppLayout, Sidebar, Header
│   │   │   ├── document/         # DocumentCard, UploadModal, StatusBadge
│   │   │   ├── chat/             # MessageBubble, SourceCitation, ChatInput
│   │   │   └── common/           # EmptyState, LoadingSpinner, ErrorBoundary
│   │   ├── pages/               # sahifalar (route darajasi)
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Documents.tsx
│   │   │   ├── DocumentDetail.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Members.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/               # custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useWorkspace.ts
│   │   │   ├── useDocuments.ts
│   │   │   └── useChat.ts
│   │   ├── store/               # global state (Zustand / Context)
│   │   │   ├── authStore.ts
│   │   │   └── workspaceStore.ts
│   │   ├── types/               # TypeScript interfacelar — bitta manba
│   │   │   ├── user.ts
│   │   │   ├── workspace.ts
│   │   │   ├── document.ts
│   │   │   ├── conversation.ts
│   │   │   └── api.ts           # ApiResponse<T>, PaginatedResult<T>
│   │   ├── lib/                 # yordamchi funksiyalar
│   │   │   ├── utils.ts         # cn(), formatDate, formatBytes
│   │   │   └── constants.ts     # routes, file types, roles
│   │   ├── routes/              # router config
│   │   │   ├── AppRouter.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example            # VITE_API_URL=http://localhost:3000/api
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── server/                      # NestJS backend
│   ├── src/
│   │   ├── main.ts              # bootstrap — app.listen, CORS, Swagger
│   │   ├── app.module.ts        # root module
│   │   ├── common/              # cross-cutting concerns
│   │   │   ├── decorators/
│   │   │   ├── guards/          # JwtAuthGuard, RolesGuard
│   │   │   ├── interceptors/    # LoggingInterceptor, TransformInterceptor
│   │   │   ├── filters/         # AllExceptionsFilter
│   │   │   └── pipes/          # ValidationPipe wrapper
│   │   ├── config/              # konfiguratsiya
│   │   │   ├── config.module.ts
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── jwt.config.ts
│   │   ├── modules/
│   │   │   ├── auth/            # JWT auth, register, login, refresh
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── google.strategy.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       └── register.dto.ts
│   │   │   ├── users/
│   │   │   ├── workspaces/      # multi-tenant root
│   │   │   ├── members/         # workspace membership
│   │   │   ├── documents/       # upload + metadata
│   │   │   ├── processing/      # RAG pipeline (queue + embeddings)
│   │   │   │   ├── processing.module.ts
│   │   │   │   ├── processing.service.ts
│   │   │   │   ├── processors/
│   │   │   │   │   ├── document.processor.ts   # parse PDF/DOCX -> text
│   │   │   │   │   ├── chunking.service.ts     # split text -> chunks
│   │   │   │   │   └── embedding.service.ts    # OpenAI embeddings -> pgvector
│   │   │   │   └── queues/
│   │   │   │       └── document.queue.ts      # BullMQ processor
│   │   │   ├── chat/            # RAG query endpoint
│   │   │   │   ├── chat.controller.ts
│   │   │   │   ├── chat.service.ts
│   │   │   │   └── retrieval.service.ts       # pgvector similarity search
│   │   │   └── notifications/
│   │   ├── database/
│   │   │   ├── entities/        # TypeORM entities
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── workspace.entity.ts
│   │   │   │   ├── workspace-member.entity.ts
│   │   │   │   ├── document.entity.ts
│   │   │   │   ├── document-chunk.entity.ts   # pgvector column
│   │   │   │   ├── conversation.entity.ts
│   │   │   │   └── message.entity.ts
│   │   │   └── migrations/
│   │   └── prisma/              # (alternative) schema.prisma
│   ├── test/
│   ├── .env.example
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml           # postgres + redis + server + client
├── .gitignore
├── README.md
└── package.json                 # workspaces root (ixtiyoriy)

/**
 * TUSHUNTIRISH — har bir papka nima uchun:
 *
 * client/src/api/     — Barcha HTTP chaqiruvlar shu yerda. Komponentlar
 *                       to'g'ridan-to'g'ri fetch qilmaydi, faqat bu api
 *                       funksiyalarni chaqiradi. Bu "Single Source of Truth"
 *                       — agar backend URL o'zgarsa, faqat shu yerda o'zgartiriladi.
 *
 * client/src/types/   — TypeScript interfacelar bitta joyda. Frontend va
 *                       backend bir xil tiplardan foydalanadi (DTO bilan mos).
 *
 * client/src/hooks/  — Custom hook lar data fetching (React Query) va
 *                       business logic ni komponentdan ajratadi. Komponent
 *                       faqat UI ga focus qiladi.
 *
 * server/modules/    — Feature-based modullar. Har bir modul o'z
 *                       controller + service + dto + entity siga ega.
 *                       NestJS "modular architecture" — bu kelajakda
 *                       microservice ga o'tishni osonlashtiradi.
 *
 * server/modules/processing/ — Eng muhim qism: RAG pipeline. Queue (BullMQ)
 *                       async ravishda document ni parse -> chunk -> embed ->
 *                       pgvector ga saqlaydi. Sync bo'lsa user bloklanadi.
 *
 * docker-compose.yml — Bitta komanda bilan butun loyiha ishga tushadi:
 *                       `docker-compose up`. Bu portfolio/CV da juda kuchli.
 */


