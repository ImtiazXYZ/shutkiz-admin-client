import { Modal } from "antd";
import "antd/dist/reset.css"; // Ant Design CSS
function ImagePreviewModal({ visible, onClose, imgSrc }) {
  return (
    <div>
      <Modal
      title="Image Preview"
      open={visible}
      footer={null}
      onCancel={onClose}
      centered
      width="500px"
    >
      <img src={imgSrc} alt="Preview" style={{ width: "50%" }} className="mx-auto p-5" />
    </Modal>
    </div>
  )
}

export default ImagePreviewModal
