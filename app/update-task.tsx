'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateTask } from '@/lib/actions/tasks';
import { Task } from '@/lib/types/tasks';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UpdateTask({
  id,
  task,
  open,
  onOpenChange,
  setOptimisticTasks,
}: {
  id: string;
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setOptimisticTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  const { mutate: server_updateTask } = useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      toast.success('Task updated successfully', {
        duration: 2000,
        position: 'top-center',
      });

      // Update the optimistic task with the received data
      setOptimisticTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...data, isPending: false } : task,
        ),
      );
    },
    onError: () => {
      // Revert the optimistic update if the request fails
      setOptimisticTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, isPending: false } : task,
        ),
      );
      toast.error('Failed to update task', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleUpdateTask = () => {
    // Optimistically update the task in the list
    setOptimisticTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...updatedTask, isPending: true } : t,
      ),
    );

    // Send the update request to the server
    server_updateTask({ id, task: updatedTask });

    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Edit the task details. Make sure to save your changes.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="task">Task</Label>
        <Input
          id="task"
          className="w-full mb-2"
          placeholder="Task"
          value={updatedTask.task}
          onChange={(e) => {
            setUpdatedTask({
              ...updatedTask,
              task: e.target.value,
            });
          }}
        />

        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className="w-full resize-none"
          placeholder="Description"
          value={updatedTask.description}
          onChange={(e) => {
            setUpdatedTask({
              ...updatedTask,
              description: e.target.value,
            });
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="mb-2 md:mb-0"
            variant="outline"
            onClick={handleUpdateTask}
          >
            Update Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
