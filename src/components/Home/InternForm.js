// InternForm.js

import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const InternForm = ({ visible, onCancel, onSubmit, isUpdate, internData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(internData);
  }, [internData, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onSubmit(values);
      })
      .catch((info) => {
        console.log("Submission failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={isUpdate ? "Update Intern" : "Add New Intern"}
      onCancel={onCancel}
      onOk={handleSubmit}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isUpdate ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name={isUpdate ? "update_form" : "add_form"}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter intern's name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter intern's email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please enter intern's phone" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={isUpdate ? [{ required: true, message: "Please enter intern's position" }] : []}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InternForm;
