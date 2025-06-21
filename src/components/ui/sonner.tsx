
import React from "react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Safety check for React hooks availability
  if (!React || !React.useEffect || !React.useState || !React.useContext) {
    console.warn('React hooks not available in Sonner Toaster, skipping render');
    return null;
  }

  // Additional safety check for global React availability
  const globalReactAvailable = !!(window as any)?.React && !!(window as any)?.useContext;
  if (!globalReactAvailable) {
    console.warn('Global React context not available, skipping Sonner render');
    return null;
  }

  // Use a fixed theme to avoid next-themes dependency issues
  const theme = "light";

  try {
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
    );
  } catch (error) {
    console.error('Sonner Toaster error:', error);
    return null;
  }
}

export { Toaster, toast }
