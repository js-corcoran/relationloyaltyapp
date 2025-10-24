"use client";
import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/state/app-context';
import { Badge, Button, Card, CardContent, CardTitle } from '@/design-system';
import { OffersToolbar } from '@/components/offers/OffersToolbar';
import { OffersGrid } from '@/components/offers/OffersGrid';
import { OfferTile } from '@/components/offers/OfferTile';
import { OfferDetailsDrawer } from '@/components/offers/OfferDetailsDrawer';
import { useToast } from '@/components/common/ToastHost';
import type { Category } from '@/components/offers/CategoryTabs';
import type { Offer } from '@/services/offers.service';

export default function OffersPage() {
  const { offers, offersStatus, loadOffers, activateOffer, activateAll, accountContext, setAccountContext } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('All');
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Load offers on mount
  React.useEffect(() => {
    loadOffers({ accountContext, q: searchQuery, category: selectedCategory !== 'All' ? selectedCategory : undefined });
  }, [loadOffers, accountContext, searchQuery, selectedCategory]);

  // Auto-open drawer if merchant query param is present
  React.useEffect(() => {
    const merchantId = searchParams.get('merchant');
    if (merchantId && offers && offersStatus === 'success') {
      const offer = offers.find(o => o.id === merchantId);
      if (offer) {
        setSelectedOffer(offer);
        setIsDrawerOpen(true);
        console.log('offer_details_opened', { offerId: offer.id });
        // Remove query param after opening
        router.replace('/offers', undefined);
      }
    }
  }, [searchParams, offers, offersStatus, router]);

  // Filter offers client-side
  const filteredOffers = React.useMemo(() => {
    if (!offers) return [];
    
    let filtered = offers.filter(o => new Date(o.expires) >= new Date()); // hide expired
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.merchant.toLowerCase().includes(q) || 
        o.category.toLowerCase().includes(q)
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(o => o.category === selectedCategory);
    }
    
    // Sort by valueScore desc
    return filtered.sort((a, b) => b.valueScore - a.valueScore);
  }, [offers, searchQuery, selectedCategory]);

  // Compute category counts
  const categoryCounts = React.useMemo<Record<Category, number>>(() => {
    const counts: Record<Category, number> = {
      All: 0,
      Grocery: 0,
      Dining: 0,
      Fuel: 0,
      Travel: 0,
      Retail: 0,
      Services: 0,
      Other: 0,
    };
    
    if (!offers) return counts;
    
    const validOffers = offers.filter(o => new Date(o.expires) >= new Date());
    counts.All = validOffers.length;
    
    validOffers.forEach(offer => {
      counts[offer.category] = (counts[offer.category] || 0) + 1;
    });
    
    return counts;
  }, [offers]);

  const inactiveCount = filteredOffers.filter(o => !o.active).length;

  const handleSearchSubmit = (query: string) => {
    console.log('offers_search_used', { query });
  };

  const handleCategoryChange = (category: Category) => {
    const prevCategory = selectedCategory;
    setSelectedCategory(category);
    console.log('offers_category_changed', { from: prevCategory, to: category });
  };

  const handleActivateAll = async () => {
    try {
      await activateAll({
        accountContext,
        q: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      addToast(`Activated ${inactiveCount} offer${inactiveCount === 1 ? '' : 's'}`, 'success');
    } catch (e: any) {
      console.error('Activate all failed:', e);
      addToast(`Failed to activate offers: ${e.message}`, 'error');
    }
  };

  const handleToggleOffer = async (id: string, active: boolean) => {
    try {
      await activateOffer(id, active);
      // Update drawer if it's showing the same offer
      if (selectedOffer?.id === id) {
        setSelectedOffer(prev => prev ? { ...prev, active } : null);
      }
    } catch (e: any) {
      addToast(`Failed to ${active ? 'activate' : 'deactivate'} offer`, 'error');
      throw e;
    }
  };

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDrawerOpen(true);
    console.log('offer_details_opened', { offerId: offer.id });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Loading state
  if (offersStatus === 'loading' || !offers) {
    return (
      <main className="min-h-dvh p-6 gradient-page" aria-busy="true">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-48"></Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (offersStatus === 'error') {
    return (
      <main className="min-h-dvh p-6 gradient-page flex items-center justify-center">
        <Card className="text-center">
          <CardTitle>Error loading offers</CardTitle>
          <CardContent>
            <p className="text-muted-foreground">Failed to fetch offers data.</p>
            <Button onClick={() => loadOffers({ accountContext })} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Empty catalog (no offers at all)
  if (offers.length === 0) {
    return (
      <main className="min-h-dvh p-6 gradient-page flex items-center justify-center">
        <Card className="text-center">
          <CardTitle>No Offers Available</CardTitle>
          <CardContent>
            <p className="text-muted-foreground">Check back later for new offers.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6 gradient-page">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <OffersToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categoryCounts={categoryCounts}
            inactiveCount={inactiveCount}
            onActivateAll={handleActivateAll}
          />
        </div>

        {/* Offers Grid */}
        <OffersGrid
          isEmpty={filteredOffers.length === 0}
          onClearFilters={searchQuery || selectedCategory !== 'All' ? handleClearFilters : undefined}
        >
          {filteredOffers.map(offer => (
            <OfferTile
              key={offer.id}
              offer={offer}
              onToggle={handleToggleOffer}
              onClick={handleOfferClick}
            />
          ))}
        </OffersGrid>
      </div>

      {/* Offer Details Drawer */}
      <OfferDetailsDrawer
        offer={selectedOffer}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onToggle={handleToggleOffer}
      />
    </main>
  );
}

