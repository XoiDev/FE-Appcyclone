import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Form, Input, Modal } from "antd";
import useAuth from "../../hooks/useAuth";
import useAddItem from "../../hooks/useAddItem";
import useDeleteItem from "../../hooks/useDeleteItem";
import ButtonCustom from "../../components/button/ButtonCustom";
import api from "../../api";

interface Categories {
  id: number;
  name: string;
  thumbnail: string;
  createdAt: string;
}
const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [error, setError] = useState<string>("");
  const [editingCate, setEditingCate] = useState<Categories | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCategoies, setNewCategoies] = useState<{
    name: string;
    thumbnail: string;
  }>({
    name: "",
    thumbnail: "",
  });
  const { token } = useAuth();

  const { addItem } = useAddItem(
    "http://localhost:3000/categories",
    token,
    setCategories
  );

  const { deleteItem } = useDeleteItem(
    "http://localhost:3000/categories",
    token,
    setCategories
  );

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch {
        setError("Failed to fetch Cate.");
        console.log(error);
      }
    };
    fetchCate();
  }, [token]);

  const handleAddCate = () => {
    addItem(newCategoies);
  };

  const handleDeleteCate = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Categories?",
      onOk: () => {
        deleteItem(id);
      },
    });
  };

  const handleSaveCate = async (values: {
    name: string;
    thumbnail: string;
  }) => {
    if (editingCate) {
      try {
        await api.patch(`/categories/${editingCate.id}`, values);
        setCategories(
          categories.map((cate) =>
            cate.id === editingCate.id ? { ...cate, ...values } : cate
          )
        );
        setEditingCate(null);
      } catch {
        console.error("Error while saving vendor:");
        setError("Failed to save vendor.");
      }
    }
  };
  const handleEditCate = (cate: Categories) => {
    setEditingCate(cate);
  };
  return (
    <>
      <div className="flex justify-between ">
        <h1 className="mb-10 text-3xl font-bold">Categories</h1>
        <ButtonCustom
          className="p-4"
          text="Add Categories"
          onClick={() => setShowAddModal(true)}
        ></ButtonCustom>
      </div>
      <Table>
        <thead className="bg-gray-200 rounded-none">
          <tr className="text-[14px] leading-[21px] font-bold text-[#00152a]">
            <th className="p-2 text-left">Id</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Thumbnail</th>
            <th className="p-2 text-left">CreatedAt</th>
            <th className="p-2 text-left"> Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((cate: any) => (
              <tr
                key={cate.id}
                className="text-lg border-b font-normal text-[14px] leading-[21px] hover:bg-gray-100"
              >
                <td className="p-4">{cate.id}</td>
                <td>{cate.name}</td>
                <td>
                  <img
                    className="w-[50px] h-[50px] rounded-lg "
                    src={cate.thumbnail}
                    alt=""
                  />
                </td>
                <td className="italic text-gray-400">{cate.createdAt}</td>
                <td>
                  <div className="flex items-center text-gray-500 cursor-pointer gap-x-3">
                    <EditOutlined
                      onClick={() => handleEditCate(cate)}
                      className="p-2 text-2xl text-blue-400 border border-gray"
                    />
                    <DeleteOutlined
                      className="p-2 text-2xl text-red-400 border border-gray"
                      onClick={() => handleDeleteCate(cate.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* modal edit vendor */}
      <Modal
        title="Edit Categories"
        visible={!!editingCate}
        onCancel={() => setEditingCate(null)}
        footer={null} // Loại bỏ nút OK mặc định
      >
        {editingCate && (
          <Form
            initialValues={editingCate}
            onFinish={handleSaveCate} // Gọi khi form submit
            layout="vertical"
          >
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Thumbnail" name="thumbnail">
              <Input />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button className="mr-[8px]" onClick={() => setEditingCate(null)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* Modal add new vendor */}
      <Modal
        title="Add New Categories"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={handleAddCate}
      >
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input
              value={newCategoies.name}
              onChange={(e) =>
                setNewCategoies({ ...newCategoies, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Thumbnail">
            <Input
              value={newCategoies.thumbnail}
              onChange={(e) =>
                setNewCategoies({ ...newCategoies, thumbnail: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Categories;
