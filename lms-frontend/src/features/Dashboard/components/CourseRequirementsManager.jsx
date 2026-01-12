import { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Button from "../../../shared/components/Button";
import {
  useAddLearningItem,
  useRemoveLearningItem,
  useUpdateLearningItem,
  useAddRequirement,
  useRemoveRequirement,
  useUpdateRequirement,
} from "../../../hooks/useCourses";
import notification from "../../../utils/notification";

const CourseRequirementsManager = ({
  courseId,
  learning = [],
  requirements = [],
}) => {
  const [newLearning, setNewLearning] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [editingLearningIndex, setEditingLearningIndex] = useState(null);
  const [editingLearningText, setEditingLearningText] = useState("");
  const [editingRequirementIndex, setEditingRequirementIndex] = useState(null);
  const [editingRequirementText, setEditingRequirementText] = useState("");

  const addLearningItem = useAddLearningItem();
  const removeLearningItem = useRemoveLearningItem();
  const updateLearningItem = useUpdateLearningItem();

  const addRequirement = useAddRequirement();
  const removeRequirement = useRemoveRequirement();
  const updateRequirement = useUpdateRequirement();

  // Learning Items Handlers
  const handleAddLearning = () => {
    if (!newLearning.trim()) return;
    addLearningItem.mutate(
      { id: courseId, data: { learningItem: newLearning } },
      {
        onSuccess: () => {
          setNewLearning("");
          notification.success("Learning item added");
        },
        onError: () => notification.error("Failed to add item"),
      }
    );
  };

  const handleRemoveLearning = (index) => {
    removeLearningItem.mutate(
      { id: courseId, index },
      {
        onSuccess: () => notification.success("Item removed"),
        onError: () => notification.error("Failed to remove item"),
      }
    );
  };

  const handleUpdateLearning = (index) => {
    if (!editingLearningText.trim()) return;
    updateLearningItem.mutate(
      { id: courseId, index, data: { learningItem: editingLearningText } },
      {
        onSuccess: () => {
          setEditingLearningIndex(null);
          setEditingLearningText("");
          notification.success("Item updated");
        },
        onError: () => notification.error("Failed to update item"),
      }
    );
  };

  // Requirements Handlers
  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    addRequirement.mutate(
      { id: courseId, data: { requirementItem: newRequirement } },
      {
        onSuccess: () => {
          setNewRequirement("");
          notification.success("Requirement added");
        },
        onError: () => notification.error("Failed to add requirement"),
      }
    );
  };

  const handleRemoveRequirement = (index) => {
    removeRequirement.mutate(
      { id: courseId, index },
      {
        onSuccess: () => notification.success("Requirement removed"),
        onError: () => notification.error("Failed to remove requirement"),
      }
    );
  };

  const handleUpdateRequirement = (index) => {
    if (!editingRequirementText.trim()) return;
    updateRequirement.mutate(
      {
        id: courseId,
        index,
        data: { requirementItem: editingRequirementText },
      },
      {
        onSuccess: () => {
          setEditingRequirementIndex(null);
          setEditingRequirementText("");
          notification.success("Requirement updated");
        },
        onError: () => notification.error("Failed to update requirement"),
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* What You Will Learn Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="heading-s mb-4 text-text-main">What You Will Learn</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newLearning}
            onChange={(e) => setNewLearning(e.target.value)}
            placeholder="e.g. Master React Hooks"
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            onKeyDown={(e) => e.key === "Enter" && handleAddLearning()}
          />
          <Button
            onClick={handleAddLearning}
            disabled={addLearningItem.isPending}
            size="sm"
          >
            <FaPlus /> Add
          </Button>
        </div>

        <ul className="space-y-3">
          {learning.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 group bg-background p-3 rounded-lg border border-border/50"
            >
              <div className="flex-1">
                {editingLearningIndex === index ? (
                  <input
                    type="text"
                    value={editingLearningText}
                    onChange={(e) => setEditingLearningText(e.target.value)}
                    className="w-full px-2 py-1 border border-primary rounded bg-surface text-text-main outline-none"
                  />
                ) : (
                  <span className="text-text-secondary">{item}</span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                {editingLearningIndex === index ? (
                  <>
                    <button
                      onClick={() => handleUpdateLearning(index)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => {
                        setEditingLearningIndex(null);
                        setEditingLearningText("");
                      }}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingLearningIndex(index);
                        setEditingLearningText(item);
                      }}
                      className="p-2 text-primary hover:bg-primary/10 rounded"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemoveLearning(index)}
                      className="p-2 text-error hover:bg-error/10 rounded"
                      disabled={removeLearningItem.isPending}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
          {learning.length === 0 && (
            <p className="text-text-muted text-sm italic text-center py-2">
              No learning items added yet.
            </p>
          )}
        </ul>
      </div>

      {/* Requirements Section */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h3 className="heading-s mb-4 text-text-main">
          Requirements / Prerequisites
        </h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="e.g. Basic JavaScript knowledge"
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50"
            onKeyDown={(e) => e.key === "Enter" && handleAddRequirement()}
          />
          <Button
            onClick={handleAddRequirement}
            disabled={addRequirement.isPending}
            size="sm"
          >
            <FaPlus /> Add
          </Button>
        </div>

        <ul className="space-y-3">
          {requirements.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 group bg-background p-3 rounded-lg border border-border/50"
            >
              <div className="flex-1">
                {editingRequirementIndex === index ? (
                  <input
                    type="text"
                    value={editingRequirementText}
                    onChange={(e) => setEditingRequirementText(e.target.value)}
                    className="w-full px-2 py-1 border border-primary rounded bg-surface text-text-main outline-none"
                  />
                ) : (
                  <span className="text-text-secondary">{item}</span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                {editingRequirementIndex === index ? (
                  <>
                    <button
                      onClick={() => handleUpdateRequirement(index)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => {
                        setEditingRequirementIndex(null);
                        setEditingRequirementText("");
                      }}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingRequirementIndex(index);
                        setEditingRequirementText(item);
                      }}
                      className="p-2 text-primary hover:bg-primary/10 rounded"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemoveRequirement(index)}
                      className="p-2 text-error hover:bg-error/10 rounded"
                      disabled={removeRequirement.isPending}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
          {requirements.length === 0 && (
            <p className="text-text-muted text-sm italic text-center py-2">
              No requirements added yet.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseRequirementsManager;
