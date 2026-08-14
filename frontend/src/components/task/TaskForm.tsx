import { useState, useEffect } from "react";
import type { Task, CreateTaskData, UpdateTaskData, User, TaskStatus, TaskPriority } from "../../types";
import { Modal } from "../ui/Modal";
import { Input, Textarea } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Tooltip } from "../ui/Tooltip";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_CONFIG, PRIORITY_CONFIG } from "../../utils/constants";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => Promise<void>;
  task?: Task | null; // null = create mode, Task = edit mode
  users: User[];
  currentUser?: { id: string; role: "USER" | "ADMIN"; name: string } | null;
}

export function TaskForm({ isOpen, onClose, onSubmit, task, users, currentUser }: TaskFormProps) {
  const isEditMode = !!task;
  const isAdmin = currentUser?.role === "ADMIN";
  const disableNonStatusFields = isEditMode && !isAdmin;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending" as TaskStatus,
    priority: "MEDIUM" as TaskPriority,
    assignedTo: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        priority: "MEDIUM",
        assignedTo: "",
        dueDate: "",
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be 255 characters or fewer";
    }
    if (formData.description.length > 5000) {
      newErrors.description = "Description must be 5000 characters or fewer";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data: any = {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
      };
      await onSubmit(data);
      onClose();
    } catch {
      // Error handled by parent via toast
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = STATUS_OPTIONS.map((s) => ({
    value: s,
    label: STATUS_CONFIG[s].label,
  }));

  const priorityOptions = PRIORITY_OPTIONS.map((p) => ({
    value: p,
    label: PRIORITY_CONFIG[p].label,
  }));

  const userOptions = users.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Task" : "Create Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Tooltip content="Role User Access Denied" disabled={!disableNonStatusFields}>
          <Input
            label="Title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            error={errors.title}
            autoFocus
            disabled={disableNonStatusFields}
          />
        </Tooltip>

        <Tooltip content="Role User Access Denied" disabled={!disableNonStatusFields}>
          <Textarea
            label="Description"
            placeholder="Add a description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            error={errors.description}
            disabled={disableNonStatusFields}
          />
        </Tooltip>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as TaskStatus,
              }))
            }
          />

          <Tooltip content="Role User Access Denied" disabled={!disableNonStatusFields}>
            <Select
              label="Priority"
              options={priorityOptions}
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as TaskPriority,
                }))
              }
              disabled={disableNonStatusFields}
            />
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Tooltip content="Role User Access Denied" disabled={!disableNonStatusFields}>
            <Select
              label="Assignee"
              options={userOptions}
              placeholder="Unassigned"
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
              disabled={disableNonStatusFields}
            />
          </Tooltip>

          <Tooltip content="Role User Access Denied" disabled={!disableNonStatusFields}>
            <Input
              label="Due Date"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              disabled={disableNonStatusFields}
            />
          </Tooltip>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-input)]">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting}>
            {isEditMode ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
