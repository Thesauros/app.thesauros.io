import Image from 'next/image';
import CopySvg from './copy.svg';
import CopiedSvg from './copied.svg';
import { useCopyToClipboard } from '@/shared/browser/useCopyToClipboard';
import { FlexBlock } from '../flex-block';
import { ReactNode } from 'react';

export const CopyButton = ({ value, text }: { value: string; text?: ReactNode }) => {
  const { copy, isCopying } = useCopyToClipboard();

  const onClickCopy = () => {
    copy(value ?? '');
  };

  if (text) {
    return (
      <FlexBlock
        direction="column"
        gap={4}
        onClick={onClickCopy}
        justifyContent="center"
        alignItems="center"
        block
      >
        <Image
          style={{ cursor: 'pointer' }}
          src={isCopying ? CopiedSvg : CopySvg}
          alt="copyButton"
        />
        {text}
      </FlexBlock>
    );
  }

  return (
    <Image
      onClick={onClickCopy}
      style={{ cursor: 'pointer' }}
      src={isCopying ? CopiedSvg : CopySvg}
      alt="copyButton"
    />
  );
};
