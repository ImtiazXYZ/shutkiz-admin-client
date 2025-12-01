import { useState } from 'react';
import { Modal } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import type { FormProps } from 'antd';
import { Button, Select, Form, Input } from 'antd';
import AdminAuth from '../../components/Admin/AdminAuth';
import { toast } from 'react-toastify';
function CreateStaff({refreshData}) {
    const {http} = AdminAuth();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };




    type FieldType = {
        role?: string;
        name?: string;
        email?: string;
        password?: string;
      };
      
      const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        http.post("/admin/staffs",values)
        .then(()=>{
            form.resetFields();
            setIsModalOpen(false);
            toast.success("Staff Created", { autoClose: 2000 });
            refreshData();
        })
        .catch((error)=>{
            console.log(error);
        })
      };
      
      const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
  return (
    <div>
     <StyleProvider hashPriority="high">
     <Button type="primary" onClick={showModal}>
        Create Staff
      </Button>
      <Modal title="Create Staff" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
      <div className='py-4'>
      <Form
    name="basic"
    form={form}
    labelCol={{ span: 5 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
        label="Role" 
        name="role"
        rules={[{ required: true, message: 'Please select role!' }]}>
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
      rules={[{ required: true, message: 'Please input password!' }]}
    >
      <Input.Password />
    </Form.Item>

    

    <Form.Item>
      <div className='md:ml-26'>
      <Button type="primary" htmlType="submit" >
        Submit
      </Button>
      </div>
    </Form.Item>
  </Form>
      </div>
      </Modal>
     </StyleProvider>
    </div>
  )
}

export default CreateStaff
