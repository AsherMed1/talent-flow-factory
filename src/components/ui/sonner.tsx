
import React from "react"
import { Toaster as Sonner, toast } from "sonner"

// Ensure React is available globally before component initialization
if (typeof window !== 'undefined') {
  const contexts = [window as any, globalThis as any];
  
  if (typeof global !== 'undefined') {
    contexts.push(global as any);
  }
  
  contexts.forEach(context => {
    if (context && !context.React) {
      context.React = React;
      Object.assign(context, {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useContext: React.useContext,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useRef: React.useRef,
        useReducer: React.useReducer,
        useLayoutEffect: React.useLayoutEffect,
        createElement: React.createElement,
        Component: React.Component,
        Fragment: React.Fragment,
        forwardRef: React.forwardRef,
        createContext: React.createContext
      });
    }
  });
}

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Safety check for React hooks availability
  if (!React || !React.useContext || !React.useState) {
    console.warn('React hooks not available in Sonner Toaster, skipping render');
    return null;
  }

  // Use a simple system theme without next-themes dependency to avoid useContext issues
  const theme = "system";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
