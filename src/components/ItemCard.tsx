import React from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

interface ItemCardProps {
  id: number;
  title: string;
  description: string;
  onDelete: (id: number) => void;
  onEdit: (item: any) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  onDelete,
  onEdit,
}) => {
  const getInitials = (title: string) => {
    const words = title.split(" ");
    return words[0]?.slice(0, 2).toUpperCase() || ""; // Get the first two letters
  };

  const initials = getInitials(title);

  return (
    <div className="border rounded p-4 shadow-md bg-white relative group">
      <div className="w-full h-48 rounded-t flex items-center justify-center bg-gray-300">
        <span className="text-5xl font-bold text-white">{initials}</span>
      </div>
      <h3 className="text-lg font-bold mt-4">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <div className="flex justify-end space-x-2 absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-black bg-gray-50 hover:bg-red-500 hover:text-white px-3 py-1 rounded-full transition-all"
          onClick={() => onDelete(id)}
        >
          <FaTrashAlt className="text-lg" />
        </button>
        <button
          className="text-black bg-gray-50 hover:bg-gray-200 hover:text-black px-3 py-1 rounded-full transition-all"
          onClick={() => onEdit({ id, title, body: description })}
        >
          <FaEdit className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
