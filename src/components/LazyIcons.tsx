
import { lazy } from 'react';

// Lazy load commonly used Lucide icons to reduce bundle size
export const LazyUsers = lazy(() => import('lucide-react').then(mod => ({ default: mod.Users })));
export const LazyCalendar = lazy(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));
export const LazyUserCheck = lazy(() => import('lucide-react').then(mod => ({ default: mod.UserCheck })));
export const LazyTrendingUp = lazy(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })));
export const LazyGitBranch = lazy(() => import('lucide-react').then(mod => ({ default: mod.GitBranch })));
export const LazyCalendarDays = lazy(() => import('lucide-react').then(mod => ({ default: mod.CalendarDays })));
export const LazyClock = lazy(() => import('lucide-react').then(mod => ({ default: mod.Clock })));
export const LazyUser = lazy(() => import('lucide-react').then(mod => ({ default: mod.User })));
export const LazyExternalLink = lazy(() => import('lucide-react').then(mod => ({ default: mod.ExternalLink })));
export const LazyLink = lazy(() => import('lucide-react').then(mod => ({ default: mod.Link })));
export const LazyChevronLeft = lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronLeft })));
export const LazyChevronRight = lazy(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })));
export const LazyBrain = lazy(() => import('lucide-react').then(mod => ({ default: mod.Brain })));
