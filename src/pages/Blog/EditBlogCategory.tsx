import { useEffect, useState } from 'react'; 
import { Modal, Button, Select, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import AdminAuth from '../../components/Admin/AdminAuth';
import { toast } from 'react-toastify';

function EditBlogCategory({ isOpen, selectedId, onClose,refreshData }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const { http } = AdminAuth();
  const [form] = Form.useForm();

  type FieldType = {
    name?: string;
  };

  // Show modal when `isOpen` prop is true and fetch the staff data
  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
      getStaffData();
    }
  }, [isOpen]);

  const getStaffData = () => {
    setLoading(true);
    if (!selectedId) return;

    http.get(`/admin/blog-categories/${selectedId}/edit`)
      .then((res) => {
        const { data } = res;
        form.setFieldsValue({
          name: data.name,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle form submission
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    http.put(`/admin/blog-categories/${selectedId}`, values)
      .then((res) => {
        form.resetFields();
        onClose();
        setIsModalOpen(false);
        toast.success("Blog Category Updated", { autoClose: 2000 });
        refreshData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleCancel = () => {
    form.resetFields(); 
    onClose();
    setIsModalOpen(false);
  };

  return (
    <Modal 
    loading={loading}
      title="Edit Recipe Category"
      open={isModalOpen}
      onCancel={handleCancel} 
      footer={null}
      confirmLoading={loading}>
      <div className='py-4'>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          

          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input />
          </Form.Item>

          

          <Form.Item>
            <div className='md:ml-26'>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default EditBlogCategory;
