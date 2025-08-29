import styles from './modal.module.scss';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { useModal } from './useModal';

type TModalSize = 'large' | 'medium' | 'small';

type TProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  withCloseButton?: boolean;
  noBackground?: boolean;
  onClickBack?: () => void;
  size?: TModalSize;
};

export const Modal = ({
  title,
  subtitle,
  children,
  onClickBack,
  withCloseButton = true,
  noBackground = false,
  size = 'medium',
}: TProps) => {
  const { close } = useModal();

  return (
    <div
      className={classNames(
        styles.modalContainer,
        styles[size],
        !withCloseButton && styles.noCloseButton,
        noBackground && styles.noBackground
      )}
    >
      {!noBackground && (
        <div className={styles.header}>
          {!!onClickBack && <button onClick={onClickBack} />}
          <div className={styles.titleWithSubtitle}>
            <h3>{title ?? ''}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          {withCloseButton && <button onClick={() => close()}>X</button>}
        </div>
      )}
      <div className={styles.modalContent}>{children}</div>
    </div>
  );
};
