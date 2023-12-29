import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, DatePicker } from "antd";
import moment from "moment";

const TimeForm = ({ visible, onCancel, onSubmit, isUpdate, internData }) => {
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (internData) {
      form.setFieldsValue({
        ...internData,
        startDate: internData.startDate ? moment(internData.startDate) : null,
        endDate: internData.endDate ? moment(internData.endDate) : null,
      });
      setDateRange([
        internData.startDate ? moment(internData.startDate) : null,
        internData.endDate ? moment(internData.endDate) : null,
      ]);
    }
  }, [internData, form]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          startDate: dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : null,
          endDate: dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : null,
        };
        form.resetFields();
        onSubmit(formattedValues);
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

        <Form.Item
          name="dateRange"
          label="Date Range"
          rules={[{ required: true, message: "Please select date range" }]}
        >
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TimeForm;
