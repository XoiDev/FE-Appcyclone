import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import api from "../../api";
import ButtonCustom from "../../components/button/ButtonCustom";
import Table from "../../components/table/Table";
import useAuth from "../../hooks/useAuth";
import useDeleteItem from "../../hooks/useDeleteItem";

import { Select } from "antd";
import dayjs from "dayjs";

interface Discount {
  id: number;
  description: string;
  minAmount: number;
  discountRate: number;
  productIds: [];
  numberCodeApply: number;
  isActive: boolean;
  productDiscountCodes: [] | null;
  updatedAt?: string;
  code?: string;
  createdAt: string;
}

const Discount: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { token } = useAuth();
  const [page, setPage] = useState(1); // Page state
  const [pageSize, setPageSize] = useState(10); // Page size state
  const [total, setTotal] = useState(0); // Total number of discounts
  const [discountDetails, setDiscountDetails] = useState<Discount | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);

  const createdAtFormatted = dayjs(discountDetails?.createdAt).format(
    "DD/MM/YYYY HH:mm:ss"
  );
  const updatedAtFormatted = dayjs(discountDetails?.updatedAt).format(
    "DD/MM/YYYY HH:mm:ss"
  );

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get(
          `/discount-codes?page=${page}&limit=${pageSize}&sortBy=createdAt&sortOrder=asc`
        );
        setDiscounts(response.data.data);
        setTotal(response.data.total);
      } catch {
        setError("Failed to fetch discounts.");
        console.log(error);
      }
    };
    fetchDiscounts();
  }, [token, page, pageSize]); // page thay đổi call api

  const { Option } = Select;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "/products?page=1&limit=10&sortBy=price&sortOrder=desc&vendorId=1&categoryId=2"
        );
        setProducts(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error(err);
      }
    };

    fetchProducts();
  }, [token]);

  const { deleteItem } = useDeleteItem(
    "http://localhost:3000/discount-codes",
    token,
    setDiscounts
  );

  const handleAddDiscount = async (values: any) => {
    try {
      const newDiscount = {
        ...values,
        productIds: values.productIds,
      };

      console.log(newDiscount);
      const response = await api.post("/discount-codes", newDiscount);
      setDiscounts([...discounts, response.data]);
      setShowAddModal(false);
    } catch (err) {
      console.log(err);
      setError("Failed to add discount.");
    }
  };

  const handleSaveDiscount = async (values: any) => {
    if (editingDiscount) {
      try {
        const updatedValues = {
          ...values,
          productIds: Array.isArray(values.productIds)
            ? values.productIds
                .map((id: any) => Number(id))
                .filter((id: number) => !isNaN(id))
            : [],
        };

        await api.patch(`/discount-codes/${editingDiscount.id}`, updatedValues);

        setDiscounts(
          discounts.map((discount) =>
            discount.id === editingDiscount.id
              ? { ...discount, ...updatedValues }
              : discount
          )
        );
        setEditingDiscount(null);
      } catch (err) {
        console.error(err);
        setError("Failed to save discount.");
      }
    }
  };

  // const handleSaveDiscount = async (values: any) => {
  //   if (editingDiscount) {
  //     try {
  //       const updatedValues = {
  //         ...values,
  //         productIds: values.productIds
  //           ? values.productIds
  //               .split(",")
  //               .map((id: string) => Number(id.trim()))
  //               .filter((id: number) => !isNaN(id))
  //           : [],
  //       };
  //       await api.patch(`/discount-codes/${editingDiscount.id}`, updatedValues);

  //       setDiscounts(
  //         discounts.map((discount) =>
  //           discount.id === editingDiscount.id
  //             ? { ...discount, ...updatedValues }
  //             : discount
  //         )
  //       );
  //       setEditingDiscount(null);
  //     } catch (err) {
  //       console.log(err);
  //       setError("Failed to save discount.");
  //     }
  //   }
  // };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await api.get(`/discount-codes/${id}`);
      setDiscountDetails(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      setError("Failed to fetch discount details.");
      console.log(err);
    }
  };

  const handleDeleteDiscount = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this discount?",
      onOk: () => {
        deleteItem(id);
      },
    });
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page); // Update page
    setPageSize(pageSize); // Update page size
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mb-10 text-3xl font-bold">Discounts</h1>

        <ButtonCustom
          className="p-4"
          text="Add Discount"
          onClick={() => setShowAddModal(true)}
        ></ButtonCustom>
      </div>
      <Table>
        <thead className="bg-gray-200 rounded-none">
          <tr className="text-[14px] leading-[21px] font-bold text-[#00152a]">
            <th className="p-2 text-left">Id</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Min Amount</th>
            <th className="p-2 text-left">Discount Rate</th>
            <th className="p-2 text-left">Number Code Apply</th>
            <th className="p-2 text-left">Active</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr
              key={discount.id}
              className="text-lg border-b font-normal text-[14px] leading-[21px] hover:bg-gray-100"
            >
              <td className="p-4">{discount.id}</td>
              <td>{discount.description}</td>
              <td>{discount.minAmount}</td>
              <td>{discount.discountRate * 100}%</td>

              <td>{discount.numberCodeApply}</td>
              <td>
                <Switch checked={discount.isActive} disabled />
              </td>
              <td>
                <div className="flex items-center text-gray-500 cursor-pointer gap-x-3">
                  <EyeOutlined
                    onClick={() => handleViewDetails(discount.id)}
                    className="p-2 text-2xl text-green-400 border border-gray"
                  />
                  <EditOutlined
                    onClick={() => handleEditDiscount(discount)}
                    className="p-2 text-2xl text-yellow-400 border border-gray"
                  />
                  <DeleteOutlined
                    onClick={() => handleDeleteDiscount(discount.id)}
                    className="p-2 text-2xl text-red-400 border border-gray"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Edit Discount */}
      <Modal
        title="Edit Discount"
        visible={!!editingDiscount}
        onCancel={() => setEditingDiscount(null)}
        footer={null}
      >
        {editingDiscount && (
          <Form
            initialValues={editingDiscount}
            onFinish={handleSaveDiscount}
            layout="vertical"
          >
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Min Amount" name="minAmount">
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item label="Discount Rate" name="discountRate">
              <InputNumber className="w-full" min={0} max={100} />
            </Form.Item>

            <Form.Item label="Product IDs" name="productIds">
              <Select
                mode="multiple"
                placeholder="Select products"
                optionLabelProp="label"
                className="w-full"
              >
                {products.map((product) => (
                  <Option
                    key={product.id}
                    value={product.id}
                    label={product.name}
                  >
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Number Code Apply" name="numberCodeApply">
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                className="mr-[8px]"
                onClick={() => setEditingDiscount(null)}
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

      {/* Modal Add Discount */}
      <Modal
        title="Add New Discount"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={() => setShowAddModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddDiscount}>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item
            label="Min Amount"
            name="minAmount"
            rules={[
              { required: true, message: "Please enter the minimum amount" },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            label="Discount Rate"
            name="discountRate"
            rules={[
              { required: true, message: "Please enter the discount rate" },
            ]}
          >
            <InputNumber className="w-full" min={0} max={100} />
          </Form.Item>
          <Form.Item
            label="Product IDs"
            name="productIds"
            rules={[{ required: true, message: "Please select product IDs" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select products"
              optionLabelProp="label"
              className="w-full"
            >
              {products.map((product) => (
                <Option
                  key={product.id}
                  value={product.id}
                  label={product.name}
                >
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Number Code Apply" name="numberCodeApply">
            <InputNumber className="w-full" min={1} />
          </Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button className="mr-[8px]" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Discount
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal detail */}
      <Modal
        title="Discount Details"
        visible={showDetailsModal}
        onCancel={() => setShowDetailsModal(false)}
        footer={null}
        className="modal-detail"
      >
        {discountDetails && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              <strong>Description:</strong> {discountDetails.description}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Code:</strong> {discountDetails.code}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Min Amount:</strong> {discountDetails.minAmount}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Discount Rate:</strong>{" "}
              {discountDetails.discountRate * 100}%
            </p>
            <p className="text-sm text-gray-700">
              <strong>Product IDs:</strong>{" "}
              {discountDetails.productDiscountCodes?.map((item, index) => (
                <div key={index}>
                  <span className="mr-4">
                    id:
                    {item.id}
                  </span>
                  <span className="mr-4">
                    productID:
                    {item.productId}
                  </span>
                  <span>
                    DiscountCodeId:
                    {item.discountCodeId}
                  </span>
                </div>
              ))}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Number Code Apply:</strong>{" "}
              {discountDetails.numberCodeApply}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Create At:</strong> {createdAtFormatted}
              {discountDetails.numberCodeApply}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Update At:</strong> {updatedAtFormatted}
              {discountDetails.numberCodeApply}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Active:</strong> {discountDetails.isActive ? "Yes" : "No"}
            </p>
          </div>
        )}
      </Modal>

      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={["10", "20", "50"]}
        onShowSizeChange={(size) => setPageSize(size)}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </>
  );
};

export default Discount;
