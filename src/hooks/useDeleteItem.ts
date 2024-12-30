import { useState } from "react";
import axios from "axios";

const useDeleteItem = (url: string, token: any, setItems) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteItem = async (id: number) => {
    setIsLoading(true);
    setError(null); // Reset error trước khi thực hiện request
    try {
      await axios.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Cập nhật lại state sau khi xóa
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item.");
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteItem, error, isLoading };
};

export default useDeleteItem;
