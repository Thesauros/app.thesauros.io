import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TAddress, useAccount } from '@/shared/blockchain';
import { fetchRegisterReferral } from './fetch-refferal';
import { LocalStorageKey, useLocalStorageState } from '@/shared/browser/localStorage';

const ReferralContext = createContext<{
  referral: TAddress | null;
  setReferral: (referral: TAddress) => void;
} | null>(null);

export const ReferralProvider = ({ children }: { children: React.ReactNode }) => {
  const [referral, setReferral] = useState<TAddress | null>(null);
  const { address } = useAccount();
  const router = useRouter();

  const [refferalLS, setRefferalLS] = useLocalStorageState(LocalStorageKey.REGISTERED_REFERRALS);

  useEffect(() => {
    if (!address) return;

    const referralID = router.query.refferalID;

    if (!referralID || typeof referralID !== 'string') return;

    if (refferalLS) {
      return;
    } else {
      fetchRegisterReferral(address, referralID)
        .then(() => {
          setRefferalLS('true');
        })
        .catch(error => {
          console.error('Failed to register referral:', error);
        });
    }
  }, [address, router.query.refferalID, refferalLS, setRefferalLS]);

  return (
    <ReferralContext.Provider value={{ referral, setReferral }}>
      {children}
    </ReferralContext.Provider>
  );
};
