import { ReactNode, useCallback, useRef, useState } from 'react';
import ModalContext, { TOpenOptions } from './modal.context';
import styles from './modal.module.scss';
import classNames from 'classnames';

type TModalState = {
  content: ReactNode;
  withLayout: boolean;
  smallPaddings: boolean;
  backgroundColor?: string;
  padding?: string;
  maxWidth?: number;
};

const initialState: TModalState = {
  content: null,
  withLayout: true,
  smallPaddings: false,
  backgroundColor: undefined,
  padding: undefined,
  maxWidth: undefined,
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<TModalState>(initialState);
  const onCloseRef = useRef<(() => void) | undefined>(undefined);

  const open = useCallback((content: ReactNode, options?: TOpenOptions) => {
    onCloseRef.current = options?.onClose;
    setModalState({
      content,
      withLayout: options?.withLayout ?? true,
      smallPaddings: options?.smallPaddings ?? false,
      backgroundColor: options?.backgroundColor,
      padding: options?.padding,
      maxWidth: options?.maxWidth,
    });
  }, []);

  const close = useCallback(() => {
    onCloseRef.current?.();
    onCloseRef.current = undefined;
    setModalState(initialState);
  }, []);

  const { content, withLayout, smallPaddings, backgroundColor, padding, maxWidth } = modalState;

  return (
    <ModalContext.Provider value={{ open, close }}>
      <div className={classNames(styles.container, !!content && styles.visible)}>
        <div className={styles.modalWrapper}>
          <div
            className={styles.overlay}
            onClick={close}
            role="button"
            aria-label="overlay"
            tabIndex={0}
          />
          <div className={styles.content}>
            {withLayout ? (
              <div
                className={classNames(styles.modalContainer, smallPaddings && styles.smallPaddings)}
                style={{
                  backgroundColor: backgroundColor,
                  padding: padding,
                  maxWidth: maxWidth ? `${maxWidth}px` : undefined,
                }}
              >
                {content}
              </div>
            ) : (
              <div>{content}</div>
            )}
          </div>
        </div>
      </div>
      {children}
    </ModalContext.Provider>
  );
};
