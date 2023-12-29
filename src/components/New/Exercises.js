import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input,
  Pagination as AntPagination,
  Tag,
} from "antd";
import callApi from "../Utils/APICaller";
import {
  SearchOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ExercisesForm from "./ExercisesForm";

const Exercises = () => {
  const [interns, setInterns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formType, setFormType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const internsPerPage = 5;
  

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await callApi("exercises", "GET", null);
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
    setSearchInput("");
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
        "https://65894c92324d41715258b992.mockapi.io/exercises",
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
      // Extract status value from the select input
      const status = updatedData.status === "true" ? true : false;
  
      // Adjust updatedData object
      const adjustedData = { ...updatedData, status };
  
      const response = await fetch(
        `https://65894c92324d41715258b992.mockapi.io/exercises/${selectedIntern.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adjustedData),
        }
      );
  
      if (response.ok) {
        setInterns((prevInterns) =>
          prevInterns.map((intern) =>
            intern.id === selectedIntern.id ? { ...intern, ...adjustedData } : intern
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
        `https://65894c92324d41715258b992.mockapi.io/exercises/${id}`,
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
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
      width: 150,
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      width: 200,
    },
    {
      title: "forUser",
      dataIndex: "forUser",
      key: "forUser",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
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
            icon={<EditOutlined />}
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

      <ExercisesForm
        visible={addModalVisible}
        onCancel={handleAddInternCancel}
        onSubmit={handleAddInternSubmit}
        isUpdate={false}
        internData={null}
      />

      {/* Update Form */}
      {selectedIntern && (
        <ExercisesForm
          visible={updateModalVisible}
          onCancel={handleUpdateCancel}
          onSubmit={handleUpdateSubmit}
          isUpdate={true}
          internData={selectedIntern}
        />
      )}
    </div>
  );
};

export default Exercises;
