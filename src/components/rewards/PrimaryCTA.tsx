import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/design-system';

export function PrimaryCTA() {
  return (
    <Link href="/rewards" onClick={() => console.log('home_redeem_cta_clicked')}>
      <Button className="ml-2">Redeem</Button>
    </Link>
  );
}


