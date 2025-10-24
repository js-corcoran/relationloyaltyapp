"use client";
import * as React from 'react';
import { TierChip } from '@/components/relationship/TierChip';
import { Card, CardContent, Button } from '@/design-system';
import { PriorityLineCard } from '@/components/support/PriorityLineCard';
import { CallbackCard } from '@/components/support/CallbackCard';
import { SecureMessageCard } from '@/components/support/SecureMessageCard';
import { CallConfirmDialog } from '@/components/support/CallConfirmDialog';
import { CallbackDialog } from '@/components/support/CallbackDialog';
import { SecureMsgDialog } from '@/components/support/SecureMsgDialog';
import { FAQSearchBar } from '@/components/support/FAQSearchBar';
import { FAQResultsList } from '@/components/support/FAQResultsList';
import { supportService } from '@/services/support.service';
import type { SupportProfile, FaqArticle, CallbackRequest, CallbackResponse } from '@/services/support.service';
import { useToast } from '@/components/common/ToastHost';

type Status = 'idle' | 'loading' | 'success' | 'error';

// Feature flags (hardcoded for MVP)
const SHOW_PRIORITY_LINE = true;
const SHOW_CALLBACK = true;
const SHOW_SECURE_MSG = true;
const SHOW_FAQ = true;

export default function SupportPage() {
  const { addToast } = useToast();

  const [status, setStatus] = React.useState<Status>('idle');
  const [profile, setProfile] = React.useState<SupportProfile | null>(null);
  const [faqArticles, setFaqArticles] = React.useState<FaqArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = React.useState<FaqArticle[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Dialog states
  const [isCallConfirmOpen, setIsCallConfirmOpen] = React.useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = React.useState(false);
  const [isSecureMsgOpen, setIsSecureMsgOpen] = React.useState(false);

  // Debounce search
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const loadProfile = React.useCallback(async () => {
    setStatus('loading');
    try {
      const [profileData, articles] = await Promise.all([
        supportService.getProfile(),
        supportService.searchFaq(''),
      ]);
      setProfile(profileData);
      setFaqArticles(articles);
      setFilteredArticles(articles);
      setStatus('success');
      console.log('support_viewed', { tier: profileData.tier, hasPriorityLine: profileData.hasPriorityLine });
    } catch (e) {
      setStatus('error');
      console.error('Failed to load support profile:', e);
    }
  }, []);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await supportService.searchFaq(query);
        setFilteredArticles(results);
        console.log('support_faq_searched', { query, results: results.length });
      } catch (e) {
        console.error('Failed to search FAQ:', e);
      }
    }, 250);
  }, []);

  const handleCallClick = () => {
    setIsCallConfirmOpen(true);
  };

  const handleCallConfirm = () => {
    console.log('support_call_initiated', { tier: profile?.tier, priority: true });
    addToast('Opening dialer...', 'info');
  };

  const handleCallbackSubmit = async (req: CallbackRequest) => {
    try {
      const response: CallbackResponse = await supportService.requestCallback(req);
      const windowEnd = new Date(response.windowEnd).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      addToast(`Callback scheduled! We'll call you by ${windowEnd}`, 'success');
      console.log('support_callback_requested', { reason: req.reason, window: req.window });
    } catch (e: any) {
      addToast(`Failed to request callback: ${e.message}`, 'error');
      throw e;
    }
  };

  const handleSecureMsgSubmit = async (subject: string, body: string) => {
    try {
      const response = await supportService.createSecureMessage(subject, body);
      addToast(`Message sent! Case ID: ${response.id}`, 'success');
      const hasKeywords = /urgent|important|asap/i.test(subject + body);
      console.log('support_secure_message_created', { length: body.length, hasKeywords });
    } catch (e: any) {
      addToast(`Failed to send message: ${e.message}`, 'error');
      throw e;
    }
  };

  const handleArticleToggle = (articleId: string) => {
    console.log('support_faq_article_viewed', { articleId });
  };

  if (status === 'loading' || !profile) {
    return (
      <main className="min-h-dvh p-6 gradient-page" aria-busy="true">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="animate-pulse h-48"></Card>
              <Card className="animate-pulse h-48"></Card>
              <Card className="animate-pulse h-48"></Card>
            </div>
            <div className="space-y-6">
              <Card className="animate-pulse h-12"></Card>
              <Card className="animate-pulse h-64"></Card>
            </div>
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
            <h2 className="text-xl font-semibold">Error loading support</h2>
            <p className="text-muted-foreground">Failed to fetch support information.</p>
            <Button onClick={loadProfile}>Retry</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Support</h1>
          <TierChip tier={profile.tier} size="sm" />
        </div>

        {/* Two-column layout: Contact methods + FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Contact methods */}
          <div className="space-y-6">
            {SHOW_PRIORITY_LINE && profile.hasPriorityLine && (
              <PriorityLineCard
                phone={profile.phone}
                hours={profile.hours}
                slaMinutes={profile.slaMinutes}
                onCallClick={handleCallClick}
              />
            )}

            {SHOW_CALLBACK && (
              <CallbackCard
                hours={profile.hours}
                onRequestClick={() => setIsCallbackOpen(true)}
              />
            )}

            {SHOW_SECURE_MSG && (
              <SecureMessageCard
                onStartClick={() => setIsSecureMsgOpen(true)}
              />
            )}
          </div>

          {/* Right column: FAQ */}
          {SHOW_FAQ && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Help Articles</h2>
                  <FAQSearchBar
                    query={searchQuery}
                    onQueryChange={handleSearch}
                  />
                </CardContent>
              </Card>

              <FAQResultsList
                articles={filteredArticles}
                query={searchQuery}
                onClearSearch={() => handleSearch('')}
                onArticleToggle={handleArticleToggle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CallConfirmDialog
        open={isCallConfirmOpen}
        onClose={() => setIsCallConfirmOpen(false)}
        phone={profile.phone}
        slaMinutes={profile.slaMinutes}
        onConfirm={handleCallConfirm}
      />

      <CallbackDialog
        open={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        onSubmit={handleCallbackSubmit}
      />

      <SecureMsgDialog
        open={isSecureMsgOpen}
        onClose={() => setIsSecureMsgOpen(false)}
        onSubmit={handleSecureMsgSubmit}
      />

      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </main>
  );
}

