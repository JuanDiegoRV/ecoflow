import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoadingState } from './components/ui/AsyncState'
import { AuthProvider } from './features/auth/AuthProvider'

const DiagnosticPage = lazy(() => import('./features/auth/DiagnosticPage').then((module) => ({ default: module.DiagnosticPage })))
const LoginPage = lazy(() => import('./features/auth/LoginPage').then((module) => ({ default: module.LoginPage })))
const CreateProjectPage = lazy(() => import('./features/projects/CreateProjectPage').then((module) => ({ default: module.CreateProjectPage })))
const ProjectDetailPage = lazy(() => import('./features/projects/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })))
const ProjectsPage = lazy(() => import('./features/projects/ProjectsPage').then((module) => ({ default: module.ProjectsPage })))
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const MaterialsPage = lazy(() => import('./features/materials/MaterialsPage').then((module) => ({ default: module.MaterialsPage })))

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })

function App() { return <QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider><Suspense fallback={<LoadingState label="Cargando EcoFlow…" />}><Routes><Route path="/login" element={<LoginPage />} /><Route path="/diagnostic" element={<DiagnosticPage />} /><Route element={<ProtectedRoute />}><Route element={<AppShell />}><Route index element={<DashboardPage />} /><Route path="projects" element={<ProjectsPage />} /><Route path="projects/new" element={<CreateProjectPage />} /><Route path="projects/:projectId" element={<ProjectDetailPage />} /><Route path="materials" element={<MaterialsPage />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></Suspense></AuthProvider></BrowserRouter></QueryClientProvider> }

export default App
