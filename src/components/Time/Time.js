import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input,
  Pagination as AntPagination,
  DatePicker, // Import DatePicker
} from "antd";
import TimeForm from "../Time/TimeForm";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import locale from "antd/es/date-picker/locale/en_US";

// import "../Home/InternList.scss"; // Import the SCSS file

const Time = () => {
  const [interns, setInterns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Thêm một state để theo dõi giá trị nhập vào ô tìm kiếm

  const internsPerPage = 5;

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch(
          "https://658dd4397c48dce94739c216.mockapi.io/timeline"
        );
        if (response.ok) {
          const data = await response.json();
          // Thêm trường 'status' vào dữ liệu intern
          const internsWithStatus = data.map((intern) => ({
            ...intern,
            status: isInternInCurrentTime(intern.startDate, intern.endDate),
          }));
          setInterns(internsWithStatus);
        } else {
          console.error(
            "Failed to fetch data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInterns();
  }, []);

  // Hàm kiểm tra xem thời gian của intern có nằm trong thời gian hiện tại không
  const isInternInCurrentTime = (startDate, endDate) => {
    const currentTime = new Date();
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    return startDateTime <= currentTime && currentTime <= endDateTime;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSearchInput(""); // Reset giá trị nhập vào ô tìm kiếm
  };

  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleAddNewIntern = () => {
    setFormType("add");
    setAddModalVisible(true);
  };

  const handleAddInternCancel = () => {
    setAddModalVisible(false);
  };

  const handleAddInternSubmit = async (newInternData) => {
    try {
      const response = await fetch(
        "https://658dd4397c48dce94739c216.mockapi.io/timeline",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInternData),
        }
      );

      if (response.ok) {
        setInterns((prevInterns) => [...prevInterns, newInternData]);
        message.success("Intern added successfully");
      } else {
        console.error("Failed to add intern:", response.statusText);
        message.error("Failed to add intern");
      }
    } catch (error) {
      console.error("Error adding intern:", error);
      message.error("Failed to add intern");
    } finally {
      setAddModalVisible(false);
      setFormType(null);
    }
  };

  const handleUpdateIntern = (intern) => {
    setFormType("update");
    setUpdateModalVisible(true);
    setSelectedIntern(intern);
  };

  const handleUpdateCancel = () => {
    setUpdateModalVisible(false);
    setSelectedIntern(null);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const response = await fetch(
        `https://658dd4397c48dce94739c216.mockapi.io/timeline/${selectedIntern.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        setInterns((prevInterns) =>
          prevInterns.map((intern) =>
            intern.id === selectedIntern.id
              ? {
                  ...intern,
                  ...updatedData,
                  status: isInternInCurrentTime(
                    updatedData.startDate,
                    updatedData.endDate
                  ),
                }
              : intern
          )
        );

        message.success("Intern updated successfully");
      } else {
        console.error(
          "Failed to update intern:",
          response.status,
          response.statusText
        );
        message.error("Failed to update intern. Please try again.");
      }
    } catch (error) {
      console.error("Error updating intern:", error);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setUpdateModalVisible(false);
      setSelectedIntern(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://658dd4397c48dce94739c216.mockapi.io/timeline/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setInterns((prevInterns) =>
          prevInterns.filter((intern) => intern.id !== id)
        );
        message.success("Intern deleted successfully");
      } else {
        console.error("Failed to delete intern:", response.statusText);
        message.error("Failed to delete intern");
      }
    } catch (error) {
      console.error("Error deleting intern:", error);
      message.error("Failed to delete intern");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredInterns = interns.filter((intern) =>
    Object.values(intern).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleDatePickerChange = (date, record, fieldName) => {
    // Placeholder function for handling date picker changes
    // You can customize this function based on your requirements
    console.log(`Date picker changed for ${fieldName}:`, date);
    console.log("Record:", record);
  };

  const startIndex = (currentPage - 1) * internsPerPage;
  const endIndex = startIndex + internsPerPage;
  const displayedInterns = filteredInterns.slice(startIndex, endIndex);

  const columns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + startIndex + 1,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 150,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (startDate, record) => (
        <DatePicker
          value={moment(startDate)}
          className="date-time-inp"
          placeholder="Select start date"
          locale={locale} // Provide the locale
          format={"DD/MM/YYYY"}
          onChange={(date) => handleDatePickerChange(date, record, "startDate")}
          key={`startDate-${record.id}`}
        />
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (endDate, record) => (
        <DatePicker
          value={moment(endDate)}
          className="date-time-inp"
          placeholder="Select end date"
          locale={locale} // Provide the locale
          format={"DD/MM/YYYY"}
          onChange={(date) => handleDatePickerChange(date, record, "endDate")}
          key={`endDate-${record.id}`}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const currentTime = moment();
        const startDateTime = moment(record.startDate);
        const endDateTime = moment(record.endDate);

        const isActive = currentTime.isBetween(startDateTime, endDateTime);

        return (
          <span style={{ color: isActive ? "green" : "red" }}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => handleUpdateIntern(record)}
            className="update-button"
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this intern?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" className="delete-button">
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
      width: 150,
    },
  ];

  return (
    <div>
      <div className="search-add">
        <div className="search-bar">
          <Input.Search
            placeholder="Search by name, position, phone, or email"
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            suffix={<CloseCircleOutlined onClick={handleResetSearch} />}
            value={searchInput}
            onChange={onSearchInputChange}
          />
        </div>
        <div className="add-new-button">
          <Button type="primary" onClick={handleAddNewIntern}>
            Add New
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={displayedInterns}
        pagination={false}
        rowKey="id"
        className="intern-list-container"
      />
      <AntPagination
        total={filteredInterns.length}
        pageSize={internsPerPage}
        current={currentPage}
        onChange={handlePageChange}
        className="intern-list-pagination"
      />

      {selectedIntern && (
        <TimeForm
          visible={updateModalVisible}
          onCancel={handleUpdateCancel}
          onSubmit={handleUpdateSubmit}
          isUpdate={true}
          internData={selectedIntern}
        />
      )}

      {addModalVisible && (
        <TimeForm
          visible={addModalVisible}
          onCancel={handleAddInternCancel}
          onSubmit={handleAddInternSubmit}
          isUpdate={false}
        />
      )}
    </div>
  );
};

export default Time;
