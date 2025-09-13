import { useModal } from '../../modal';
import { ModalContainer } from './modal-container';

export const MobileMenu = () => {
  const { open } = useModal();

  return (
    <div onClick={() => open(<ModalContainer />)} style={{ fontSize: 32 }}>
      Ξ
    </div>
  );
};
