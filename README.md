
# ⏰ Timely - Task & Time Tracking App

A modern, full-stack productivity application that helps you manage tasks, track time spent using real-time timers, and view AI-powered daily productivity summaries.


## 🌟 Live Demo
https://timely-m2li.vercel.app/

## Test Credentials
Email: testuser@gmail.com

Password: test@1104
## 📸 Screenshots

#### Dashboard View
<img width="1846" height="976" alt="Dashboard" src="https://github.com/user-attachments/assets/73b303a9-0400-41c7-933c-d2c498a5875d" />

*Manage all your tasks with an intuitive drag-and-drop interface*

#### Time Tracking
<img width="1846" height="976" alt="TimeTracking" src="https://github.com/user-attachments/assets/e93da583-cec1-4c3f-aac2-e8de93938b21" />

*Track time with precision using our real-time timer*

#### Daily Summary
<img width="1846" height="976" alt="DailySummary1" src="https://github.com/user-attachments/assets/0235977c-c2c1-4a05-83c3-9795111dc858" />

*Comprehensive productivity insights and statistics*

#### AI Insights
<img width="1846" height="976" alt="AIInsights" src="https://github.com/user-attachments/assets/f58d57d0-aac0-4e5e-bf71-00f3183d73f9" />

*Get personalized productivity recommendations powered by Google Gemini*

#### AI Suggestions
<img width="1846" height="976" alt="TastCreate" src="https://github.com/user-attachments/assets/9361cabf-dcad-450d-ab2f-ee8f5e1bc8ea" />

*Enhance your task content with Gemini-powered title and description ideas*

## Features


#### 🔐 Authentication
- Secure user authentication with **NextAuth v4**
- Multiple sign-in options:
  - Email/Password (Credentials)
  - Google OAuth
- Protected routes and API endpoints
- User-specific data isolation

#### 📝 Task Management
- **Create** tasks using natural language input
- **Edit** task details (title, description)
- **Update** task status: `Pending` → `In Progress` → `Completed`
- **Delete** tasks 
- Visual status indicators with color coding
- Inline editing with auto-save

#### ⏱️ Real-Time Time Tracking
- Start/Stop timer for any task
- Live elapsed time display (HH:MM:SS format)
- Multiple time log sessions per task
- Automatic status updates when tracking
- Total time calculation per task
- Prevent multiple active timers
- Session history with timestamps

#### 📊 Daily Summary
- **Date selector** for any historical day
- **Statistics dashboard:**
  - Total time tracked
  - Tasks worked on
  - Completed tasks count
  - In-progress tasks count
- **Task breakdown** with time spent and session count
- **Activity log** with detailed time entries

#### 🤖 AI-Powered Insights (Powered by Google Gemini)
- **Productivity score** (0-100) with reasoning
- **Task-specific Highlights** with session breakdowns
- **Task-Specific Recommendations**
- **Focus & Context Switching Analysis** based on work patterns
- **Time distribution analysis** 
- **Areas for Improvement**  (Actionable)
- **Tomorrow's strategic plan** with recommendations
- **Pattern recognition** for optimal productivity


## 🛠️ Tech Stack

#### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components

#### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - RESTful API
- **[Prisma ORM](https://www.prisma.io/)** - Database management
- **[PostgreSQL](https://www.postgresql.org/)** (via NeonDB) - Database
- **[NextAuth v4](https://next-auth.js.org/)** - Authentication

#### AI & Analytics
- **[Google Gemini AI](https://ai.google.dev/)** - AI-powered insights

#### Deployment & Infrastructure
- **[Vercel](https://vercel.com/)** - Hosting and deployment
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL

## Project Structure
```
timely/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts   # NextAuth handler
│   │   │   │   └── signup/
│   │   │   │       └── route.ts   # User registration
│   │   │   ├── ai/
│   │   │   │   └── generate/
│   │   │   │       └── route.ts   # Title and description suggestion
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts       # CRUD for tasks
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts   # Single task operations
│   │   │   ├── timelogs/
│   │   │   │   ├── route.ts       # Start/get time logs
│   │   │   │   ├── active/
│   │   │   │   │   └── route.ts   # Get active timer
│   │   │   │   └── [id]/
│   │   │   │       └── stop/
│   │   │   │           └── route.ts # Stop timer
│   │   │   └── summary/
│   │   │       ├── daily/
│   │   │       │   └── route.ts   # Daily summary
│   │   │       └── insights/
│   │   │           └── route.ts   # AI insights
│   │   │
│   │   ├── (auth)/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx       # Sign in page
│   │   │   └── signup/
│   │   │       └── page.tsx       # Sign up page
│   │   │
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │       └── page.tsx       # Main Dashboard
│   │   │
│   │   ├── providers/
│   │   │   └── providers.tsx      # Session Provider
│   │   │
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Global styles
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── CreateTaskDialog.tsx
│   │   │   ├── DailySummary.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   └── TaskLogPanel.tsx
│   │   │
│   │   ├── TaskLog/
│   │   │   ├── TaskLogHeader.tsx
│   │   │   ├── TaskLogStats.tsx
│   │   │   ├── TaskLogList.tsx
│   │   │   ├── TaskLogItem.tsx
│   │   │   └── EmptyLogState.tsx
│   │   │
│   │   └── ui/                    # shadcn/ui components
│   │       ├── button.tsx
│   │       └── ...
│   │
│   ├── hooks/
│   │   └── useDashboardData.ts    # Main dashboard hook
│   │
│   ├── lib/
│   │   ├── nextauth.ts            # NextAuth config 
│   │   ├── db.ts                  # Prisma client
│   │   └── utils.ts               # Utils 
│   │
│   ├── prisma/
│   │   └── schema.prisma          # Schema
│   │
│   ├── types/
│   │   ├── index.ts               # Shared types
│   │   └── next-auth.d.ts         # NextAuth types
│   │
│   ├── utils/
│   │   ├── timeFormat.ts          # Time formatting
│   │   └── statusColors.ts        # Status color utils
│   │
│   └── middleware.ts              # Route protection
│
├── .env                           # Environment variables
├── .env.example                   # Example env file
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```
## 🗄️ Database Schema

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  tasks         Task[]
  timeLogs      TimeLog[]
}
```

#### Task
```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      Status    @default(PENDING)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  
  timeLogs    TimeLog[]
}
```

#### TimeLog
```prisma
model TimeLog {
  id          String    @id @default(cuid())
  startTime   DateTime
  endTime     DateTime? 
  duration    Int?      
  createdAt   DateTime  @default(now())

  taskId      String
  task        Task      @relation(fields: [taskId], references: [id])
  
  userId      String
  user        User      @relation(fields: [userId], references: [id])
}
```

---
## 🔌 API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Sign in user |
| POST | `/api/auth/signout` | Sign out user |

#### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/[id]` | Get single task |
| PATCH | `/api/tasks/[id]` | Update task |
| DELETE | `/api/tasks/[id]` | Delete task |

#### Time Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timelogs` | Get all time logs |
| GET | `/api/timelogs?taskId=[id]` | Get logs for specific task |
| GET | `/api/timelogs/active` | Get active timer |
| POST | `/api/timelogs` | Start time tracking |
| PATCH | `/api/timelogs/[id]/stop` | Stop time tracking |

#### Title and Description Suggestion
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Get ai suggestions for title/description |

#### Summary & Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/summary/daily?date=YYYY-MM-DD` | Get daily summary |
| POST | `/api/summary/insights` | Generate AI insights |

---
## 📝 Usage Guide

#### Creating a Task
- Click "**+ New Task**" button
- Enter task title (e.g., "Review pull requests")
- Add description
- Click "Create"

#### Starting a Timer
- Find your task in the dashboard
- Click "**Start Timer**" button
- Timer begins counting immediately

#### Stopping a Timer
- Click "**Stop Timer**" button on active task
- Time log is saved automatically
- Total time updates

#### Viewing Daily Summary
- Click "**Summary**" tab
- Select date using date picker
- View stats, task breakdown, and activity log
- Click "**Generate Insights**" for AI analysis

#### Getting AI Insights
- Go to Summary page
- Select the date you want to analyze
- Click "**Generate Insights**"
- Wait for Gemini AI to analyze your data
- Read personalized recommendations

---
## Run Locally

#### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** database (local or [Neon](https://neon.tech/) account)
- **Google Cloud Account** (for OAuth)
- **Google AI Studio Account** (for Gemini API)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/timely.git
cd timely
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth v4
AUTH_SECRET="your-super-secret-key-here-change-this-in-production"

# Google OAuth (Optional)
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Google Gemini AI
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"

# App URL
NEXTAUTH_URL="http://localhost:3000"
```

#### Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

#### Get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Get Google Gemini API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `.env`

### 4. Setup Database

#### Initialize Prisma:
```bash
npx prisma generate
```

#### Run Migrations:
```bash
npx prisma migrate dev --name init
```

#### (Optional) Seed Database:
```bash
npx prisma db seed
```

#### (Optional) Open Prisma Studio:
```bash
npx prisma studio
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Author
- GitHub: [@SomuSingh11](https://github.com/SomuSingh11)
- LinkedIn: [Somu Singh](https://www.linkedin.com/in/somu-singh-0b3b32247/)
- Portfolio: [codex](https://codex-portfolio-11.vercel.app/)
