'use client';

import { deleteTask } from '@/lib/actions/tasks';
import { Task } from '@/lib/types/tasks';
import { useMutation } from '@tanstack/react-query';
import { CircleX } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteTask({
  task,
  setOptimisticTasks,
}: {
  task: Task;
  setOptimisticTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const { mutate: server_deleteTask } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success('Task deleted successfully', {
        duration: 2000,
        position: 'top-center',
      });
    },
    onError: () => {
      // Revert the optimistic delete if the request fails
      setOptimisticTasks((prevTasks) => [...prevTasks, task]);
      toast.error('Failed to delete task', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const handleDelete = () => {
    console.log('Delete task:', task.id);

    // Optimistically remove the task from the list
    setOptimisticTasks((prevTasks) =>
      prevTasks.filter((t) => t.id !== task.id),
    );

    // Send the delete request to the server
    server_deleteTask(task.id);
  };

  return (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={handleDelete}
    >
      <CircleX className="w-3" /> Delete
    </div>
  );
}
