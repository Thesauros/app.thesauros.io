import { MenuBurgerIcon } from '../../icons/menu-burger-icon';
import { useModal } from '../../modal';
import { MobileMenuModal } from './mobile-menu-modal';

export const MobileMenu = () => {
  const { open } = useModal();

  return (
    <div
      onClick={() =>
        open(<MobileMenuModal />, { backgroundColor: '#D5EEFD', padding: '16px 12px' })
      }
      style={{ fontSize: 32 }}
    >
      <MenuBurgerIcon />
    </div>
  );
};
