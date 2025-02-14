import React, { useState, useEffect } from "react";
import { createItem, updateItem } from "../api/api";
interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onAddPost: (post: any) => void;
  onEditPost: (post: any) => void;
  currentEdit: any | null;
}

const AddPost: React.FC<ModalProps> = ({
  isOpen,
  toggleModal,
  onAddPost,
  onEditPost,
  currentEdit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (currentEdit) {
      setFormData({
        title: currentEdit.title,
        description: currentEdit.body,
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
    setFormErrors({ title: "", description: "" });
  }, [currentEdit]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error for the field
  };

  const validateForm = () => {
    let errors = { title: "", description: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (currentEdit) {
        // PUT request to edit the post
        await updateItem(currentEdit.id, {
          title: formData.title,
          body: formData.description,
        });
        onEditPost({
          id: currentEdit.id,
          title: formData.title,
          body: formData.description,
        });
      } else {
        // POST request to add a new post
        const response = await createItem({
          title: formData.title,
          body: formData.description,
        });
        onAddPost(response.data);
      }

      // Clear the form after successful submission
      setFormData({
        title: "",
        description: "",
      });

      toggleModal();
    } catch (err) {
      setError("An error occurred while submitting the form.");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl sm:max-w-2xl lg:max-w-3xl p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {currentEdit ? "Edit Post" : "Add Post"}
          </h2>
          <button
            onClick={() => { toggleModal(); setError(null) }}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <span className="text-4xl font-extrabold">&times;</span>
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`block w-full mt-2 border ${formErrors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-black focus:border-black text-base sm:text-lg p-3`}
              placeholder="Enter title"
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Description field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`block w-full mt-2 border ${formErrors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-black focus:border-black text-base sm:text-lg p-3`}
              placeholder="Enter description"
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Error message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 text-white ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
                } rounded-lg text-base sm:text-lg`}
              disabled={loading}
            >
              {loading ? "Submitting..." : currentEdit ? "Save Changes" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;