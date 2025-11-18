import Image from 'next/image';
import { Card } from '../new-card';
import BannerImage from '../images/point-program-image.png';
import { FlexBlock } from '../flex-block';
import { Subtitle } from '../new-typography/subtitle';
import Link from 'next/link';
import { Caption } from '../new-typography/caption';
import styles from './point-program-banner.module.scss';

export const PointProgramBanner = () => {
  return (
    <Card className={styles.bannerCard}>
      <FlexBlock gap={16} direction="column">
        <Image src={BannerImage} width={174} height={220} alt="Point program banner" />
        <FlexBlock direction="column" gap={2}>
          <Subtitle weight="bold">Season 1 Started!</Subtitle>
          <Link href={'/point-program'}>
            <Caption>Click here for details</Caption>
          </Link>
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};
