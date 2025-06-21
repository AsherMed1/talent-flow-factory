
import { lazy } from 'react';

// Lazy load all main route components EXCEPT Index to avoid timing issues
export const LazyApplyPage = lazy(() => import('../pages/ApplyPage').then(module => ({ default: module.ApplyPage })));
export const LazyVideoEditorApplicationPage = lazy(() => import('../pages/VideoEditorApplicationPage').then(module => ({ default: module.VideoEditorApplicationPage })));
export const LazyAppointmentSetterApplicationPage = lazy(() => import('../pages/AppointmentSetterApplicationPage').then(module => ({ default: module.AppointmentSetterApplicationPage })));
export const LazyThankYouPage = lazy(() => import('../pages/ThankYouPage').then(module => ({ default: module.ThankYouPage })));
export const LazyPublicJobBoard = lazy(() => import('../components/PublicJobBoard').then(module => ({ default: module.PublicJobBoard })));
export const LazyGmailCallbackPage = lazy(() => import('../pages/GmailCallbackPage'));
export const LazyNotFound = lazy(() => import('../pages/NotFound'));
