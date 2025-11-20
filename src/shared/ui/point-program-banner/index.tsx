import Image from 'next/image';
import BannerImage from '../images/point-program-banner.svg';
import MobileBannerImage from '../images/point-program-mobile-banner.svg';
import { FlexBlock } from '../flex-block';
import { Caption } from '../new-typography/caption';
import styles from './point-program-banner.module.scss';
import { Body } from '../new-typography/body';
import { usePathname } from 'next/navigation';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

export const PointProgramBanner = () => {
  const pathname = usePathname();
  const isMobile = useCheckResolution(576);

  if (pathname === '/point-program') {
    return null;
  }

  return (
    <a href={'/point-program'} className={styles.customLink}>
      <FlexBlock direction="column" gap={0}>
        <Image
          src={isMobile ? MobileBannerImage : BannerImage}
          alt="Point program banner"
          className={styles.image}
        />
        <FlexBlock className={styles.bannerCard} direction="column">
          <Body level={2} weight="bold">
            Promo season 1 started!
          </Body>
          <Caption className={styles.secondary} weight="regular">
            Earn points daily by holding your stablecoins.
          </Caption>
        </FlexBlock>
      </FlexBlock>
    </a>
  );
};
