import { useState } from "react";
import axios from "axios";

const useAddItem = (url: any, token: any, setItems) => {
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const addItem = async (newItem: object) => {
    try {
      const response = await axios.post(url, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems((prevItems: any) => [...prevItems, response.data]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add item.");
    }
  };

  return { addItem, error };
};

export default useAddItem;
