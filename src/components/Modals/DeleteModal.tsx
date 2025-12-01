import { Modal } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';
interface DeleteModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  content?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  title = "Are you sure you want to delete this item?",
  content = "This action cannot be undone.",
}) => {
  return (
    <StyleProvider hashPriority="high">
        <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined style={{ color: '#faad14',fontSize:"20px" }} />
          {title}
        </div>
      }
      open={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
      width="450px"
    >
      <p>{content}</p>
    </Modal>
    </StyleProvider>
  );
};

export default DeleteModal;
