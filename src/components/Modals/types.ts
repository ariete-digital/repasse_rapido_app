export interface ModalProps {
  visible: boolean;
  setModalVisible: (v: boolean) => void;
}

export interface SecurityModalProps extends ModalProps {
  onAccept?: () => void;
}
