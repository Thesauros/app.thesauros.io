import { createContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { TAddress, useAccount } from '@/shared/blockchain';
import { LocalStorageKey, useLocalStorageState } from '@/shared/browser/localStorage';
import { postReferral } from './post-referral';

const ReferralContext = createContext<{
  referral: TAddress | null;
  setReferral: (referral: TAddress) => void;
} | null>(null);

export const ReferralProvider = ({ children }: { children: React.ReactNode }) => {
  const [referral, setReferral] = useState<TAddress | null>(null);
  const { address } = useAccount();
  const router = useRouter();
  const isPostingRef = useRef(false);

  const [refferalLS, setRefferalLS] = useLocalStorageState(LocalStorageKey.REGISTERED_REFERRALS);

  useEffect(() => {
    if (!address) return;

    const referralID = router.query.ref;

    if (!referralID || typeof referralID !== 'string') return;

    if (refferalLS || isPostingRef.current) {
      return;
    }

    isPostingRef.current = true;

    postReferral({ address, referrer_address: referralID })
      .then(() => {
        setRefferalLS('true');
      })
      .catch(error => {
        console.error('Failed to register referral:', error);
        isPostingRef.current = false;
      });
  }, [address, router.query.ref, refferalLS, setRefferalLS]);

  return (
    <ReferralContext.Provider value={{ referral, setReferral }}>
      {children}
    </ReferralContext.Provider>
  );
};
