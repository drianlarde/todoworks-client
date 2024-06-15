'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { updateTask } from '@/lib/actions/tasks';
import { Task } from '@/lib/types/tasks';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function UpdateTaskComplete({
  id,
  task,
  setOptimisticTasks,
}: {
  id: string;
  task: Task;
  setOptimisticTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  const { mutate: server_updateTaskDone } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success(
        `Task ${updatedTask.completed ? 'marked as incomplete' : 'completed'}`,
        {
          duration: 2000,
          position: 'top-center',
        },
      );
    },
  });

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleCheckboxChange = () => {
    const newCompletedState = !updatedTask.completed;

    // Optimistically update the task state locally
    setOptimisticTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, completed: newCompletedState } : t,
      ),
    );

    // Send the update request to the server
    server_updateTaskDone({
      id,
      task: {
        ...updatedTask,
        completed: newCompletedState,
      },
    });
  };

  return (
    <Checkbox
      className="w-4 h-4 border border-zinc-300 rounded cursor-pointer"
      checked={updatedTask.completed}
      onCheckedChange={handleCheckboxChange}
    />
  );
}
