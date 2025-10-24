import * as React from 'react';
import { Card, CardContent, Label } from '@/design-system';
import { Check } from 'lucide-react';
import { cn } from '@/design-system';
import type { Language } from '@/services/preferences.service';

export interface LanguageCardProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  disabled?: boolean;
}

const languages: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { value: 'fr', label: 'French', nativeLabel: 'Français' },
];

export function LanguageCard({ selectedLanguage, onLanguageChange, disabled }: LanguageCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Language</h2>
        <p className="text-sm text-muted-foreground">
          UI language will update immediately after saving
        </p>

        <div role="radiogroup" aria-label="Language selection" className="space-y-2">
          {languages.map((lang) => (
            <label
              key={lang.value}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors",
                "hover:bg-muted/50",
                selectedLanguage === lang.value
                  ? "border-primary bg-primary/5"
                  : "border-border",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="radio"
                name="language"
                value={lang.value}
                checked={selectedLanguage === lang.value}
                onChange={() => onLanguageChange(lang.value)}
                disabled={disabled}
                className="sr-only"
                aria-checked={selectedLanguage === lang.value}
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedLanguage === lang.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}
              >
                {selectedLanguage === lang.value && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {lang.label} {lang.nativeLabel !== lang.label && `(${lang.nativeLabel})`}
                </div>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

