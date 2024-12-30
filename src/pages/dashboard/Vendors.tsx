import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../api";
import ButtonCustom from "../../components/button/ButtonCustom";
import Table from "../../components/table/Table";
import useAuth from "../../hooks/useAuth";
import useDeleteItem from "../../hooks/useDeleteItem";
import axios from "axios";

interface Vendor {
  id: number;
  name: string;
  thumbnail?: any | null;
  createdAt: string;
}
const Vendors: React.FC = () => {
  const { token } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newVendor, setNewVendor] = useState<{
    name: string;
    thumbnail?: any | null;
  }>({
    name: "",
    thumbnail: null,
  });
  // const { addItem } = useAddItem(
  //   "http://localhost:3000/vendors",
  //   token,
  //   setVendors
  // );
  const { deleteItem } = useDeleteItem(
    "http://localhost:3000/vendors",
    token,
    setVendors
  );

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/vendors");
        setVendors(response.data);
      } catch (err) {
        setError("Failed to fetch vendors.");
      }
    };
    fetchVendors();
  }, []);

  const handleAddVendor = async () => {
    try {
      const formData = new FormData();
      console.log("form", formData);
      formData.append("file", newVendor.thumbnail);
      console.log("thumbnail", newVendor.thumbnail);
      const uploadResponse = await api.postForm("upload", formData);

      const imageUrl = uploadResponse.data.url;
      console.log(imageUrl);

      const newVendorData = {
        name: newVendor.name,
        thumbnail: imageUrl,
      };

      const addVendorResponse = await api.post("/vendors", newVendorData);

      console.log("work");
      setVendors((prevVendors) => [...prevVendors, addVendorResponse.data]);

      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding vendor:", err);
      setError("Failed to add vendor.");
    }
  };

  // const handleDeleteVendor = async (id: number) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this vendor?",
  //     onOk: async () => {
  //       try {
  //         await axios.delete(`http://localhost:3000/vendors/${id}`, {
  //           headers: {
  //             Authorization: `Bearer ${token} `,
  //           },
  //         });
  //         setVendors(vendors.filter((vendor) => vendor.id !== id));
  //       } catch (err: any) {
  //         if (err.response) {
  //           console.error("Response error:", err.response.data);
  //           setError(err.response.data.message || "Failed to delete vendor.");
  //         } else if (err.request) {
  //           console.error("Request error:", err.request);
  //           setError("No response received from server.");
  //         } else {
  //           console.error("Error:", err.message);
  //           setError("An unexpected error occurred.");
  //         }
  //       }
  //     },
  //   });
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);

      setNewVendor({ ...newVendor, thumbnail: file });
      console.log(newVendor);
    }
  };

  const handleDeleteVendor = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this vendor?",
      onOk: () => {
        deleteItem(id);
      },
    });
  };
  // const handleSaveVendor = async (values: {
  //   name: string;
  //   thumbnail: string;
  // }) => {
  //   if (editingVendor) {
  //     try {
  //       await axios.patch(
  //         `http://localhost:3000/vendors/${editingVendor.id}`,
  //         values,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Đảm bảo token không chứa khoảng trắng thừa
  //           },
  //         }
  //       );
  //       setVendors(
  //         vendors.map((vendor) =>
  //           vendor.id === editingVendor.id ? { ...vendor, ...values } : vendor
  //         )
  //       );
  //       setEditingVendor(null); // Đóng modal
  //     } catch {
  //       console.error("Error while saving vendor:");
  //       setError("Failed to save vendor.");
  //     }
  //   }
  // };

  const handleSaveVendor = async (values: {
    name: string;
    thumbnail: File;
  }) => {
    const formData = new FormData();
    formData.append("file", values.thumbnail); // Key phải khớp với backend

    try {
      const uploadResponse = await api.post("/upload", formData);

      const updatedVendor = {
        ...values,
        thumbnail: uploadResponse.data.url, // URL từ server
      };

      console.log(updatedVendor);

      // Cập nhật vendor
      await api.patch(`/vendors/${editingVendor?.id}`, updatedVendor);

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.id === editingVendor?.id ? updatedVendor : vendor
        )
      );
      setEditingVendor(null); // Đóng modal
    } catch (err) {
      console.error(err);
      setError("Failed to save vendor.");
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
  };
  return (
    <>
      <div className="flex justify-between ">
        <h1 className="mb-10 text-3xl font-bold">Vendors</h1>

        <ButtonCustom
          text=" Add Vendor"
          className="p-4"
          onClick={() => setShowAddModal(true)}
        ></ButtonCustom>
      </div>
      <Table>
        <thead className="bg-gray-200">
          <tr className="text-[14px] leading-[21px] font-bold text-[#00152a]">
            <th className="p-2 text-left">Id</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Thumbnail</th>
            <th className="p-2 text-left">CreatedAt</th>
            <th className="p-2 text-left"> Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length > 0 &&
            vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="text-lg border-b font-normal text-[14px] leading-[21px] hover:bg-gray-100"
              >
                <td className="p-4">{vendor.id}</td>
                <td>{vendor.name}</td>
                <td>
                  <img
                    className="w-[50px] h-[50px] rounded-lg "
                    src={vendor.thumbnail}
                    alt=""
                  />
                </td>
                <td className="italic text-gray-400">{vendor.createdAt}</td>
                <td>
                  <div className="flex items-center text-gray-500 cursor-pointer gap-x-3">
                    <EditOutlined
                      onClick={() => handleEditVendor(vendor)}
                      className="p-2 text-2xl text-blue-400 border border-gray"
                    />
                    <DeleteOutlined
                      className="p-2 text-2xl text-red-400 border border-gray"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* modal edit vendor */}
      {/* <Modal
        title="Edit Vendor"
        visible={!!editingVendor}
        onCancel={() => setEditingVendor(null)}
        footer={null}
      >
        {editingVendor && (
          <Form
            initialValues={editingVendor}
            onFinish={handleSaveVendor}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Thumbnail"
              name="thumbnail"
              rules={[
                { required: true, message: "Please enter the thumbnail URL" },
              ]}
            >
              <Input />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                className="mr-[8px]"
                onClick={() => setEditingVendor(null)}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Modal> */}

      <Modal
        title="Edit Vendor"
        visible={!!editingVendor}
        onCancel={() => setEditingVendor(null)}
        footer={null}
      >
        {editingVendor && (
          <Form
            initialValues={editingVendor}
            onFinish={(values) => {
              const updatedValues = {
                ...values,
                thumbnail: editingVendor?.thumbnail,
              };
              handleSaveVendor(updatedValues);
            }}
            layout="vertical"
          >
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Thumbnail">
              <div className="flex flex-col items-start gap-4">
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditingVendor({
                        ...editingVendor,
                        thumbnail: file,
                      });
                    }
                  }}
                />

                {editingVendor.thumbnail && (
                  <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-lg shadow-md">
                    <img
                      src={editingVendor.thumbnail}
                      alt="Thumbnail Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                className="mr-[8px]"
                onClick={() => setEditingVendor(null)}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      <Modal
        title="Add New Vendor"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={handleAddVendor}
      >
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input
              value={newVendor.name}
              onChange={(e) =>
                setNewVendor({ ...newVendor, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Thumbnail">
            <div className="flex flex-col items-start gap-4">
              <Input type="file" onChange={handleFileChange} />
              {newVendor.thumbnail && (
                <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-lg shadow-md">
                  {newVendor.thumbnail && (
                    <img
                      src={URL.createObjectURL(newVendor.thumbnail)}
                      alt="Thumbnail Preview"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Vendors;
