import { ReactNode, useCallback, useState } from 'react';
import ModalContext, { TOpenOptions } from './modal.context';
import styles from './modal.module.scss';
import classNames from 'classnames';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [onCloseHandler, setOncloseHandler] = useState<(() => void) | undefined>(undefined);
  const [withLayout, setWithLayout] = useState(true);
  const [smallPaddings, setSmallPaddings] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined);
  const [padding, setPadding] = useState<string | undefined>(undefined);

  const open = useCallback((content: ReactNode, options?: TOpenOptions) => {
    setModalContent(content);

    setWithLayout(options?.withLayout ?? true);
    setSmallPaddings(options?.smallPaddings ?? false);
    setBackgroundColor(options?.backgroundColor ?? undefined);
    setPadding(options?.padding ?? undefined);

    const handler = options?.onClose ? options.onClose : null;
    if (handler) {
      setOncloseHandler(() => handler);
    }
  }, []);

  const close = useCallback(() => {
    if (!!onCloseHandler) {
      onCloseHandler();
    }

    setModalContent(null);
  }, [onCloseHandler]);

  return (
    <ModalContext.Provider value={{ open, close }}>
      <div className={classNames(styles.container, !!modalContent && styles.visible)}>
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
                  backgroundColor: backgroundColor ?? undefined,
                  padding: padding ?? undefined,
                }}
              >
                {modalContent}
              </div>
            ) : (
              <div>{modalContent}</div>
            )}
          </div>
        </div>
      </div>
      {children}
    </ModalContext.Provider>
  );
};
