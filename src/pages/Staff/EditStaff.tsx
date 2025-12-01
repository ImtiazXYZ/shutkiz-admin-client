import React, { useEffect, useState } from 'react'; 
import { Modal, Button, Select, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import AdminAuth from '../../components/Admin/AdminAuth';
import { toast } from 'react-toastify';

function EditStaff({ isOpen, selectedId, onClose,refreshData }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const { http } = AdminAuth();
  const [form] = Form.useForm();

  type FieldType = {
    role?: string;
    name?: string;
    email?: string;
    password?: string;
  };

  // Show modal when `isOpen` prop is true and fetch the staff data
  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
      getStaffData();
    }
  }, [isOpen]);

  // Fetch staff data from API
  const getStaffData = () => {
    setLoading(true);
    if (!selectedId) return; // Avoid API call if no ID is provided

    http.get(`/admin/staffs/${selectedId}/edit`)
      .then((res) => {
        const { data } = res; // Assuming the API returns staff data in 'data'
        form.setFieldsValue({
          role: data.role,
          name: data.name,
          email: data.email,
          password: '', // You might want to keep the password field empty for security reasons
        });
        setLoading(false); // Stop the loading once data is fetched
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle form submission
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    http.put(`/admin/staffs/${selectedId}`, values)
      .then((res) => {
        form.resetFields();
        onClose();
        setIsModalOpen(false);
        toast.success("Staff Updated", { autoClose: 2000 });
        refreshData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Close modal and reset form on modal close
  const handleCancel = () => {
    form.resetFields(); // Reset form on cancel
    onClose(); // Trigger parent close method
    setIsModalOpen(false);
  };

  return (
    <Modal 
    loading={loading}
      title="Edit Staff"
      open={isModalOpen}
      onCancel={handleCancel} // Close on cancel
      footer={null}
      confirmLoading={loading}
    >
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
            label="Role" 
            name="role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select>
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="Accounts">Accounts</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            
          >
            <Input.Password />
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

export default EditStaff;
