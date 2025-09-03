import { CopyButton } from '@/shared/ui/copy-button';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';

export const GenerateLinkModal = () => {
  return (
    <FlexBlock direction="column" gap={16}>
      <Texting level={2} weight="semibold">
        Your referral link:
      </Texting>
      <FlexBlock gap={16}>
        <Texting level={3} weight="regular">
          https://thesauros.io/referral/1234567890
        </Texting>
        <CopyButton value="https://thesauros.io/referral/1234567890" />
      </FlexBlock>
    </FlexBlock>
  );
};
