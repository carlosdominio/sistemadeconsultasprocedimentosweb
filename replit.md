# Overview

This is a full-stack procedure management system built for client and provider workflow management. The application allows users to manage clients, providers, and their associated procedures across different types of incidents (accidents, damages, theft, exclusions). It features a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database integration using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and bundling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with TypeScript (ESM modules)
- **Framework**: Express.js for REST API endpoints
- **Development Server**: Custom Vite integration for SSR in development
- **API Design**: RESTful endpoints following CRUD patterns
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

## Data Layer
- **Database**: PostgreSQL as the primary database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Connection**: Neon serverless driver for PostgreSQL connectivity
- **Validation**: Drizzle-Zod integration for runtime type validation

### Database Schema Design
The system uses five main entities:
- **Clients**: Basic client information storage
- **Providers**: Service provider details with optional image storage
- **Client Procedures**: Text-based procedures associated with clients
- **Provider Procedures**: Incident-type specific procedures for providers
- **Additional Provider Procedures**: Secondary procedures for providers by incident type

All tables use UUID primary keys with cascade deletion for referential integrity.

## Development Experience
- **Hot Reloading**: Vite HMR integration with Express server
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Error Overlay**: Runtime error modal for development debugging
- **Code Organization**: Monorepo structure with shared types and schemas

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for PostgreSQL operations
- **express**: Web application framework for Node.js
- **react**: Frontend UI library
- **@tanstack/react-query**: Server state management

## UI and Styling
- **@radix-ui/react-***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for conditional CSS classes
- **lucide-react**: Icon library

## Development Tools
- **vite**: Frontend build tool and dev server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and introspection tool
- **tsx**: TypeScript execution for Node.js

## Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation
- **drizzle-zod**: Drizzle to Zod schema conversion

## Routing and Navigation
- **wouter**: Lightweight React router