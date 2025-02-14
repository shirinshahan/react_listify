import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ItemCard from "./ItemCard";
import AddPost from "./AddPost";
import DeleteModal from "./DeleteModal";
import { fetchItems, deleteItem } from "../api/api";

const Card = () => {
  const [items, setItems] = useState<any[]>([]); // Array to store the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Add/Edit modal state
  const [currentEdit, setCurrentEdit] = useState<any | null>(null); // Item being edited
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null); // Item ID to delete
  const [deleteError, setDeleteError] = useState<string | null>(null); // Error message for delete operation

  const [sortBy, setSortBy] = useState<string>("id"); // Sort state
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search state

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetchItems(); 
        setItems(response.data.slice(0, 10)); // Limit to the first 10 items for demo
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleAddPost = (newPost: any) => {
    setItems((prevItems) => [{ ...newPost, id: Date.now() }, ...prevItems]);
  };

  const handleEditPost = (updatedPost: any) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedPost.id ? updatedPost : item
      )
    );
  };

  const toggleAddEditModal = () => {
    setIsModalOpen(!isModalOpen);
    setCurrentEdit(null);
  };

  const handleEdit = (item: any) => {
    setCurrentEdit(item);
    setIsModalOpen(true);
  };

  const toggleDeleteModal = (id: number | null = null) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(!deleteModalOpen);
    setDeleteError(null); 
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null) {
      try {
        await deleteItem(deleteTargetId); 
        setItems((prevItems) => prevItems.filter((item) => item.id !== deleteTargetId));
        setDeleteTargetId(null);
        setDeleteError(null);
      } catch (error: any) {
        setDeleteError(error.message);
      }
    }
  };

  // Sorting logic
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "id") {
      return a.id - b.id;
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title); 
    }
    return 0;
  });

  // Filtering logic
  const filteredItems = sortedItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto p-8">
        <div className="space-y-4 text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
            Featured Listings
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniamquis nostrud exercitation ullamco laboris
          </p>
          <button
            onClick={toggleAddEditModal}
            className="flex items-center px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800 mx-auto"
          >
            <FaPlus className="mr-2" />
            Add Post
          </button>
        </div>

        {/* Sorting and Filtering Section */}
        <div className="flex flex-col sm:flex-row items-center justify-end mb-6 gap-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black p-3"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black p-3"
          >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="h-[800px] max-w-7xl mx-auto rounded-xl border bg-background/50 backdrop-blur-sm overflow-y-auto slim-scroll">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.body}
              onDelete={() => toggleDeleteModal(item.id)}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {/* Add/Edit Modal Form*/}
      <AddPost
        isOpen={isModalOpen}
        toggleModal={toggleAddEditModal}
        onAddPost={handleAddPost}
        onEditPost={handleEditPost}
        currentEdit={currentEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        toggleModal={() => toggleDeleteModal(null)}
        onDeleteConfirm={handleDeleteConfirm}
        deleteError={deleteError}
      />
    </div>
  );
};

export default Card;
