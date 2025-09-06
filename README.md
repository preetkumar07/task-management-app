# TaskFlow - Modern Task Management System

*A comprehensive multi-page task management application built with Next.js 14 and TypeScript*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/preetkumar1970-9232s-projects/v0-task-management-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/TiRFloNl4xs)

## 🚀 Overview

TaskFlow is a modern, responsive task management system designed for productivity and ease of use. Built with Next.js 14 and featuring a clean, professional interface with dark/light mode support, it provides comprehensive task organization capabilities with client-side data persistence.

## ✨ Features

### Core Functionality
- **Complete CRUD Operations** - Create, read, update, and delete tasks with full validation
- **Multi-page Architecture** - Dedicated pages for dashboard, task list, creation, and editing
- **Advanced Filtering & Search** - Filter by status, priority, category with real-time search
- **Smart Sorting** - Sort tasks by date, title, priority, or due date
- **Progress Tracking** - Visual progress indicators and completion statistics

### User Experience
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Theme toggle with persistent user preferences
- **Intuitive Navigation** - Clean, accessible navigation with loading states
- **Form Validation** - Comprehensive validation with helpful error messages
- **Local Storage** - Client-side data persistence without requiring a database

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **Modern UI Components** - Built with Radix UI and Shadcn/ui
- **Performance Optimized** - Fast loading with Next.js 14 App Router
- **Accessibility** - WCAG compliant with proper ARIA attributes

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI + Shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Theme**: Next Themes for dark/light mode
- **Icons**: Lucide React
- **Storage**: Browser localStorage

## 📁 Project Structure

\`\`\`
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and design tokens
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Dashboard/home page
│   └── tasks/                   # Task management routes
│       ├── page.tsx             # All tasks list view
│       ├── loading.tsx          # Loading UI component
│       ├── new/page.tsx         # Create new task form
│       └── [id]/edit/page.tsx   # Edit existing task form
├── components/                   # Reusable components
│   ├── navigation.tsx           # Main navigation component
│   ├── theme-provider.tsx       # Theme context provider
│   ├── theme-toggle.tsx         # Dark/light mode toggle
│   └── ui/                      # Shadcn/ui component library
├── types/                       # TypeScript definitions
│   └── task.ts                  # Task interface and enums
├── lib/                         # Utility functions
└── hooks/                       # Custom React hooks
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/task-management-app.git
   cd task-management-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 Usage

### Dashboard
- View task statistics and progress overview
- Quick access to recent tasks and actions
- Visual progress indicators for different task categories

### Task Management
- **Create Tasks**: Use the "New Task" page to add tasks with title, description, priority, category, and due date
- **View Tasks**: Browse all tasks with filtering and sorting options
- **Edit Tasks**: Click on any task to modify its details
- **Delete Tasks**: Remove completed or unnecessary tasks
- **Filter & Search**: Use the search bar and filters to find specific tasks

### Customization
- **Theme**: Toggle between light and dark modes using the theme switcher
- **Categories**: Organize tasks by custom categories (Work, Personal, Shopping, etc.)
- **Priorities**: Set task priorities (Low, Medium, High) for better organization

## 🎨 Design System

The application uses a carefully crafted design system with:
- **Primary Colors**: Gray-800 (#1f2937) with purple accents (#8b5cf6)
- **Typography**: Work Sans for headings, Open Sans for body text
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible, reusable UI components

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Style
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commit messages
- Component-based architecture

## 📄 Data Model

Tasks are structured with the following properties:
\`\`\`typescript
interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Drag and drop the `out` folder after running `npm run build`
- **GitHub Pages**: Use `next export` for static deployment
- **Docker**: Use the included Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) for rapid development
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

---

**Live Demo**: [https://vercel.com/preetkumar1970-9232s-projects/v0-task-management-app](https://vercel.com/preetkumar1970-9232s-projects/v0-task-management-app)

**Continue Development**: [https://v0.app/chat/projects/TiRFloNl4xs](https://v0.app/chat/projects/TiRFloNl4xs)
