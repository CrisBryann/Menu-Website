import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import callApi from "../Utils/APICaller";

const { Option } = Select;

const ExercisesForm = ({ visible, onCancel, onSubmit, isUpdate, internData }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await callApi("users", "GET", null);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Set form fields when the component mounts or when internData changes
    form.setFieldsValue(internData);
  }, [internData, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Reset form fields
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
          name="taskName"
          label="Task Name"
          rules={[{ required: true, message: "Please enter task name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="task"
          label="Task"
          rules={[{ required: true, message: "Please enter task" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please enter Status" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="forUser"
          label="For User"
          rules={[{ required: true, message: "Please select a user" }]}
        >
          <Select placeholder="Select a user">
            {users.map((user) => (
              <Option key={user.id} value={user.name}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* ID field is only needed for update */}
        {isUpdate && (
          <Form.Item
            name="id"
            label="ID"
          >
            <Input disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ExercisesForm;
