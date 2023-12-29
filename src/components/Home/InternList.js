import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input,
  Pagination as AntPagination,
} from "antd";
import callApi from "../Utils/APICaller";
import InternForm from "./InternForm";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

import "./InternList.scss"; // Import the SCSS file

const InternList = () => {
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
        const response = await callApi("users", "GET", null);
        setInterns(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInterns();
  }, []);

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
        "https://65894c92324d41715258b992.mockapi.io/users",
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
        `https://65894c92324d41715258b992.mockapi.io/users/${selectedIntern.id}`,
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
            intern.id === selectedIntern.id ? { ...intern, ...updatedData } : intern
          )
        );
  
        message.success("Intern updated successfully");
      } else {
        console.error("Failed to update intern:", response.status, response.statusText);
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
        `https://65894c92324d41715258b992.mockapi.io/users/${id}`,
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
      <Button
        type="primary"
        onClick={handleAddNewIntern}
        
      >
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
        <InternForm
          visible={updateModalVisible}
          onCancel={handleUpdateCancel}
          onSubmit={handleUpdateSubmit}
          isUpdate={true}
          internData={selectedIntern}
        />
      )}

      {addModalVisible && (
        <InternForm
          visible={addModalVisible}
          onCancel={handleAddInternCancel}
          onSubmit={handleAddInternSubmit}
          isUpdate={false}
        />
      )}
    </div>
  );
};

export default InternList;
