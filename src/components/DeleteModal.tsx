import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onDeleteConfirm: () => void;
  deleteError: string | null; // Prop for delete error
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  toggleModal,
  onDeleteConfirm,
  deleteError,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Are you sure?
        </h2>
        <p className="text-gray-600 mb-6">
          This action cannot be undone. This will permanently delete the listing.
        </p>

        {deleteError && (
          <p className="text-red-500 text-sm mb-4">{'Some error occured'}</p>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={toggleModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeleteConfirm();
              toggleModal();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
