import { ReactNode, useCallback, useState } from 'react';
import ModalContext, { TOpenOptions } from './modal.context';
import styles from './modal.module.scss';
import classNames from 'classnames';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [onCloseHandler, setOncloseHandler] = useState<(() => void) | undefined>(undefined);

  const open = useCallback((content: ReactNode, options?: TOpenOptions) => {
    setModalContent(content);

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
            <div className={styles.modalContainer}>{modalContent}</div>
          </div>
        </div>
      </div>
      {children}
    </ModalContext.Provider>
  );
};
