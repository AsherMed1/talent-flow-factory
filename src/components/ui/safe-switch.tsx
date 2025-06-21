
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

// Ensure React is available for this component
if (typeof window !== 'undefined' && !(window as any).React) {
  (window as any).React = React;
  (window as any).useState = React.useState;
  (window as any).useEffect = React.useEffect;
}

const SafeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  // Additional safety check
  if (!React.useState) {
    console.error('React hooks not available in SafeSwitch');
    return (
      <div className="inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
        <div className="h-5 w-5 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
SafeSwitch.displayName = "SafeSwitch"

export { SafeSwitch }
