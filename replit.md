# America Net (美国网) - A Private Portal Simulation

## Overview

America Net is a React-based web application that creates an immersive "American Internet" experience for a single user. The project presents itself as an authentic portal offering various American lifestyle services including news, real estate, firearms marketplace, aircraft sales, dating platform, stock trading, and lottery systems. The application is designed with a Chinese language interface to create a specialized portal experience.

The system features a progression-based user system with XP and levels that unlock different services, virtual currency for transactions, and AI-powered chat interactions for the dating platform. All content and interactions are designed to maintain complete immersion without breaking the illusion of authenticity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Client-side application built with React and TypeScript
- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Context API for user authentication and global state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom Chinese-optimized design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Node.js/Express**: RESTful API server handling all business logic
- **Authentication**: Simple password-based authentication with hardcoded credentials
- **API Design**: Express routes organized by feature (auth, user, lottery, stocks, dating, etc.)
- **Error Handling**: Centralized error handling middleware
- **Data Storage**: Hybrid approach using both database and static JSON files

### Database Design
- **PostgreSQL**: Primary database using Drizzle ORM
- **Schema Structure**:
  - Users table with balance, XP, and level tracking
  - Activities table for logging user actions and rewards
  - Lottery tickets table for game state persistence
  - Stock portfolio table for trading simulation
  - Dating messages table for chat history
- **Static Data**: JSON files for product catalogs (guns, houses, aircraft, news, dating profiles)

### User Progression System
- **Level-based Access**: 5 levels unlocking different features
- **XP and Currency**: Dual reward system for engagement
- **Activity Tracking**: All user interactions logged for progression
- **Service Unlocks**: Level 2+ unlocks premium features like dating platform

### AI Integration
- **OpenAI Integration**: GPT-5 model for generating dating chat responses
- **Contextual Responses**: AI maintains character personas for dating profiles
- **Content Generation**: Dynamic news content generation capabilities
- **Immersion Maintenance**: AI responses designed to never break the simulation illusion

## External Dependencies

### Database Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connection Pooling**: Optimized database connections for scalability

### AI Services
- **OpenAI API**: GPT-5 model for conversational AI
- **Usage**: Dating platform chat responses and dynamic content generation
- **Configuration**: Environment-based API key management

### UI Component Library
- **Radix UI**: Headless component primitives for accessibility
- **Shadcn/ui**: Pre-built component system with consistent styling
- **Lucide Icons**: Icon library for modern UI elements

### Build and Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundling for production

### Deployment Platform
- **Replit**: Integrated hosting and development environment
- **Environment Variables**: Secure configuration management
- **Hot Reloading**: Development-optimized with live updates

### Data Management
- **React Query**: Server state management and caching
- **Zod**: Runtime type validation for API contracts
- **Date-fns**: Date manipulation and formatting utilities

### Authentication & Security
- **Password-based Auth**: Simple login system with hardcoded credentials
- **Session Management**: Token-based authentication state
- **Environment Security**: API keys and sensitive data in environment variables