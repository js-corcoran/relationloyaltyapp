"use client";
import * as React from 'react';
import { Card, CardContent, Button } from '@/design-system';
import { LanguageCard } from '@/components/settings/LanguageCard';
import { NotificationsCard } from '@/components/settings/NotificationsCard';
import { QuietHoursCard } from '@/components/settings/QuietHoursCard';
import { InterestsCard } from '@/components/settings/InterestsCard';
import { PrivacyCard } from '@/components/settings/PrivacyCard';
import { SaveBar } from '@/components/settings/SaveBar';
import { preferencesService } from '@/services/preferences.service';
import type { Preferences, Language, NudgeSensitivity, Interest, QuietHours } from '@/services/preferences.service';
import { useToast } from '@/components/common/ToastHost';

type Status = 'idle' | 'loading' | 'success' | 'error';

// Feature flags (hardcoded for MVP)
const ENABLE_LANGUAGE = true;
const ENABLE_NOTIFICATIONS = true;
const ENABLE_QUIET_HOURS = true;
const ENABLE_MARKETING_PREFS = true;
const ENABLE_DATA_EXPORT = true;

export default function SettingsPage() {
  const { addToast } = useToast();

  const [status, setStatus] = React.useState<Status>('idle');
  const [preferences, setPreferences] = React.useState<Preferences | null>(null);
  const [draftPreferences, setDraftPreferences] = React.useState<Preferences | null>(null);
  const [saving, setSaving] = React.useState(false);

  const loadPreferences = React.useCallback(async () => {
    setStatus('loading');
    try {
      const data = await preferencesService.get();
      setPreferences(data);
      setDraftPreferences(data);
      setStatus('success');
      console.log('settings_viewed', {
        language: data.language,
        nudgeSensitivity: data.nudgeSensitivity,
        interestsCount: data.interests.length,
      });
    } catch (e) {
      setStatus('error');
      console.error('Failed to load preferences:', e);
    }
  }, []);

  React.useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Calculate if there are unsaved changes
  const isDirty = React.useMemo(() => {
    if (!preferences || !draftPreferences) return false;
    return JSON.stringify(preferences) !== JSON.stringify(draftPreferences);
  }, [preferences, draftPreferences]);

  // Track which fields changed for telemetry
  const getChangedFields = (): string[] => {
    if (!preferences || !draftPreferences) return [];
    const changed: string[] = [];
    
    if (preferences.language !== draftPreferences.language) changed.push('language');
    if (preferences.nudgeSensitivity !== draftPreferences.nudgeSensitivity) changed.push('nudgeSensitivity');
    if (JSON.stringify(preferences.interests) !== JSON.stringify(draftPreferences.interests)) changed.push('interests');
    if (JSON.stringify(preferences.quietHours) !== JSON.stringify(draftPreferences.quietHours)) changed.push('quietHours');
    
    return changed;
  };

  const handleLanguageChange = (language: Language) => {
    if (!draftPreferences) return;
    setDraftPreferences({ ...draftPreferences, language });
  };

  const handleSensitivityChange = (nudgeSensitivity: NudgeSensitivity) => {
    if (!draftPreferences) return;
    setDraftPreferences({ ...draftPreferences, nudgeSensitivity });
  };

  const handleQuietHoursChange = (quietHours: QuietHours) => {
    if (!draftPreferences) return;
    setDraftPreferences({ ...draftPreferences, quietHours });
  };

  const handleInterestsChange = (interests: Interest[]) => {
    if (!draftPreferences) return;
    setDraftPreferences({ ...draftPreferences, interests });
  };

  const handleSave = async () => {
    if (!preferences || !draftPreferences) return;

    // Validate quiet hours if enabled
    if (draftPreferences.quietHours.enabled) {
      if (!draftPreferences.quietHours.start || !draftPreferences.quietHours.end) {
        addToast('Please set both start and end times for quiet hours', 'error');
        return;
      }
      if (draftPreferences.quietHours.start === draftPreferences.quietHours.end) {
        addToast("Quiet hours start and end can't be the same", 'error');
        return;
      }
    }

    setSaving(true);
    try {
      // Calculate patch (only send changed fields)
      const patch: Partial<Preferences> = {};
      if (preferences.language !== draftPreferences.language) patch.language = draftPreferences.language;
      if (preferences.nudgeSensitivity !== draftPreferences.nudgeSensitivity) patch.nudgeSensitivity = draftPreferences.nudgeSensitivity;
      if (JSON.stringify(preferences.interests) !== JSON.stringify(draftPreferences.interests)) patch.interests = draftPreferences.interests;
      if (JSON.stringify(preferences.quietHours) !== JSON.stringify(draftPreferences.quietHours)) patch.quietHours = draftPreferences.quietHours;

      const updated = await preferencesService.save(patch);
      setPreferences(updated);
      setDraftPreferences(updated);
      
      const changedFields = getChangedFields();
      console.log('settings_saved', { changed: changedFields });
      
      // Special handling for language change
      if (changedFields.includes('language')) {
        const languageNames = { en: 'English', es: 'Spanish', fr: 'French' };
        addToast(`Language changed to ${languageNames[updated.language]}`, 'success');
      } else {
        addToast('Preferences saved successfully', 'success');
      }
    } catch (e: any) {
      addToast(`Failed to save preferences: ${e.message}`, 'error');
      console.error('Failed to save preferences:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (preferences) {
      setDraftPreferences({ ...preferences });
      addToast('Changes discarded', 'info');
    }
  };

  const handleExport = async () => {
    console.log('settings_export_started', {});
    try {
      const blob = await preferencesService.export();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('settings_export_completed', { bytes: blob.size });
      addToast('Data exported successfully', 'success');
    } catch (e: any) {
      addToast(`Failed to export data: ${e.message}`, 'error');
      console.error('Failed to export data:', e);
    }
  };

  const handleClearLocal = async () => {
    console.log('settings_clear_local_confirmed', {});
    try {
      await preferencesService.clearLocal();
    } catch (e: any) {
      addToast(`Failed to clear data: ${e.message}`, 'error');
      console.error('Failed to clear data:', e);
    }
  };

  if (status === 'loading' || !preferences || !draftPreferences) {
    return (
      <main className="min-h-dvh p-6 gradient-page" aria-busy="true">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-pulse h-64"></Card>
            <Card className="animate-pulse h-64"></Card>
            <Card className="animate-pulse h-64"></Card>
            <Card className="animate-pulse h-64"></Card>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="min-h-dvh p-6 gradient-page flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-xl font-semibold">Error loading settings</h2>
            <p className="text-muted-foreground">Failed to fetch preferences.</p>
            <Button onClick={loadPreferences}>Retry</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6 gradient-page pb-24 md:pb-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {ENABLE_LANGUAGE && (
              <LanguageCard
                selectedLanguage={draftPreferences.language}
                onLanguageChange={handleLanguageChange}
                disabled={saving}
              />
            )}

            {ENABLE_NOTIFICATIONS && (
              <NotificationsCard
                selectedSensitivity={draftPreferences.nudgeSensitivity}
                onSensitivityChange={handleSensitivityChange}
                disabled={saving}
              />
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {ENABLE_QUIET_HOURS && (
              <QuietHoursCard
                quietHours={draftPreferences.quietHours}
                onQuietHoursChange={handleQuietHoursChange}
                disabled={saving}
              />
            )}

            {ENABLE_MARKETING_PREFS && (
              <InterestsCard
                selectedInterests={draftPreferences.interests}
                onInterestsChange={handleInterestsChange}
                disabled={saving}
              />
            )}
          </div>
        </div>

        {/* Privacy section - full width */}
        {ENABLE_DATA_EXPORT && (
          <PrivacyCard
            onExport={handleExport}
            onClearLocal={handleClearLocal}
            disabled={saving}
          />
        )}

        {/* Save Bar */}
        <SaveBar
          show={isDirty}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>

      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </main>
  );
}

