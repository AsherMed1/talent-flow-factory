
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// Comprehensive React setup for Radix UI Tooltip components
if (typeof window !== 'undefined') {
  const setupReactForRadixTooltip = () => {
    const contexts = [window as any, globalThis as any];
    
    // Also check for global and self contexts
    if (typeof global !== 'undefined') {
      contexts.push(global as any);
    }
    if (typeof self !== 'undefined') {
      contexts.push(self as any);
    }
    
    contexts.forEach(context => {
      if (context && !context.React) {
        context.React = React;
        // Make all React hooks and utilities available
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
  };
  
  // Execute setup immediately
  setupReactForRadixTooltip();
  
  // Also ensure React is available in module system for Radix UI
  try {
    // @ts-ignore
    if (typeof module !== 'undefined' && module.exports) {
      module.exports.React = React;
      Object.assign(module.exports, React);
    }
  } catch (e) {
    console.warn('Tooltip module system setup warning:', e);
  }
}

// Enhanced SafeTooltipProvider with comprehensive error handling
const SafeTooltipProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  // Multiple layers of safety checks
  if (!React || !React.useState || !React.useContext || !React.useEffect) {
    console.error('React hooks not available in TooltipProvider, falling back to children only');
    return <>{children}</>;
  }

  // Verify Radix UI has access to React
  if (typeof window !== 'undefined') {
    const windowReact = (window as any).React;
    if (!windowReact || !windowReact.useState) {
      console.error('React not properly available in window context for Radix UI');
      return <>{children}</>;
    }
  }

  try {
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.error('TooltipProvider initialization error:', error);
    return <>{children}</>;
  }
};

const TooltipProvider = SafeTooltipProvider;

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
