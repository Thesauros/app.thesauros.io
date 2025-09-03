import Image from 'next/image';
import CopySvg from './copy.svg';
import CopiedSvg from './copied.svg';
import { useCopyToClipboard } from '@/shared/browser/useCopyToClipboard';

export const CopyButton = ({ value }: { value: string }) => {
  const { copy, isCopying } = useCopyToClipboard();

  const onClickCopy = () => {
    copy(value ?? '');
  };

  return (
    <Image
      onClick={onClickCopy}
      style={{ cursor: 'pointer' }}
      src={isCopying ? CopiedSvg : CopySvg}
      alt="copyButton"
    />
  );
};
