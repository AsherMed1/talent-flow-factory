
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { searchLocations, LocationSuggestion } from '@/utils/locationHelper';
import { MapPin } from 'lucide-react';

interface LocationInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onLocationSelect?: (location: LocationSuggestion) => void;
}

export const LocationInput = React.forwardRef<HTMLInputElement, LocationInputProps>(
  ({ className, value = '', onLocationSelect, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (ref && typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      onChange?.(e);
      
      if (query.length >= 2) {
        const results = searchLocations(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setHighlightedIndex(-1);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const handleSuggestionClick = (suggestion: LocationSuggestion) => {
      onLocationSelect?.(suggestion);
      setIsOpen(false);
      setSuggestions([]);
      
      // Create a synthetic event to trigger form updates
      const syntheticEvent = {
        target: { value: suggestion.displayName }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            handleSuggestionClick(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSuggestions([]);
          setHighlightedIndex(-1);
          break;
      }
    };

    const handleBlur = () => {
      // Delay hiding suggestions to allow for clicks
      setTimeout(() => {
        setIsOpen(false);
        setSuggestions([]);
        setHighlightedIndex(-1);
      }, 200);
    };

    return (
      <div ref={containerRef} className="relative">
        <Input
          {...props}
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (value && value.length >= 2) {
              const results = searchLocations(value);
              setSuggestions(results);
              setIsOpen(results.length > 0);
            }
          }}
          className={cn(className)}
          autoComplete="off"
        />
        
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.city}-${suggestion.country}-${index}`}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm flex items-center gap-2",
                  "hover:bg-gray-100",
                  highlightedIndex === index && "bg-gray-100"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{suggestion.displayName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

LocationInput.displayName = "LocationInput";
