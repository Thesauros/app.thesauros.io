import { createContext, ReactNode } from 'react';

export type TOpenOptions = {
  onClose?: () => void;
  withLayout?: boolean;
  smallPaddings?: boolean;
};

type TModalState = {
  open: (content: ReactNode, options?: TOpenOptions) => void;
  close: () => void;
};

const ModalContext = createContext<TModalState | null>(null);
export default ModalContext;
