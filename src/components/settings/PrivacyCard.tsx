"use client";
import * as React from 'react';
import { Card, CardContent, Button, Input, Label } from '@/design-system';
import { cn } from '@/design-system';
import { Download, Trash2, X } from 'lucide-react';

export interface PrivacyCardProps {
  onExport: () => void;
  onClearLocal: () => void;
  disabled?: boolean;
}

export function PrivacyCard({ onExport, onClearLocal, disabled }: PrivacyCardProps) {
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const [clearInput, setClearInput] = React.useState('');
  const [showExportConfirm, setShowExportConfirm] = React.useState(false);

  const handleExportClick = () => {
    setShowExportConfirm(true);
  };

  const handleExportConfirm = () => {
    onExport();
    setShowExportConfirm(false);
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const handleClearConfirm = () => {
    if (clearInput === 'CLEAR') {
      onClearLocal();
    }
  };

  const handleClearCancel = () => {
    setShowClearConfirm(false);
    setClearInput('');
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Privacy & Data</h2>
        <p className="text-sm text-muted-foreground">
          Manage your data and privacy settings
        </p>

        <div className="space-y-3">
          {/* Export Data */}
          <div className="flex items-start justify-between gap-4 p-4 border rounded-md">
            <div className="flex-1">
              <h3 className="font-medium">Export My Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download a JSON file with your preferences and account snapshot
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportClick}
              disabled={disabled}
              className="flex-shrink-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Clear Local Data (Design-mode only) */}
          <div className="flex items-start justify-between gap-4 p-4 border border-destructive/50 rounded-md bg-destructive/5">
            <div className="flex-1">
              <h3 className="font-medium text-destructive">Clear Local Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reset all mock data and reload the app (design-mode only)
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearClick}
              disabled={disabled}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Export Confirmation Dialog */}
        {showExportConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background shadow-lg rounded-lg p-6 w-full max-w-md space-y-4">
              <h3 className="text-lg font-semibold">Export Data</h3>
              <p className="text-sm text-muted-foreground">
                This will download a JSON file containing your preferences and account information.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowExportConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleExportConfirm}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Confirmation Dialog */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background shadow-lg rounded-lg p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-destructive">Clear Local Data</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearCancel}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This will clear all local mock data and reload the app. This action cannot be undone.
                </p>
                <div>
                  <Label htmlFor="clear-confirm">Type <span className="font-mono font-bold">CLEAR</span> to confirm</Label>
                  <Input
                    id="clear-confirm"
                    value={clearInput}
                    onChange={(e) => setClearInput(e.target.value)}
                    placeholder="CLEAR"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleClearCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleClearConfirm}
                  disabled={clearInput !== 'CLEAR'}
                >
                  Clear Data
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

