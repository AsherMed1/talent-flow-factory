
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// Ensure React and hooks are available for Radix UI - more comprehensive approach
if (typeof window !== 'undefined') {
  const setupReactForRadix = () => {
    const contexts = [window as any, globalThis as any];
    
    contexts.forEach(context => {
      if (context && !context.React) {
        context.React = React;
        context.useState = React.useState;
        context.useEffect = React.useEffect;
        context.useContext = React.useContext;
        context.useCallback = React.useCallback;
        context.useMemo = React.useMemo;
        context.useRef = React.useRef;
        context.createContext = React.createContext;
        context.forwardRef = React.forwardRef;
      }
    });
  };
  
  setupReactForRadix();
}

// Safe TooltipProvider with fallback
const SafeTooltipProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  // Additional safety check
  if (!React.useState || !React.useContext) {
    console.error('React hooks not available in TooltipProvider');
    return <>{children}</>;
  }

  try {
    return <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
  } catch (error) {
    console.error('TooltipProvider error:', error);
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
