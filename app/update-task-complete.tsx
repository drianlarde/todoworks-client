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
}: {
  id: string;
  task: Task;
}) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  const { mutate: server_updateTaskDone } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success(
        `Task ${task.completed ? 'marked as incomplete' : 'completed'}`,
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

  return (
    <Checkbox
      className="w-4 h-4 border border-zinc-300 rounded cursor-pointer mt-[0.36rem]"
      defaultChecked={task.completed}
      onCheckedChange={() => {
        setUpdatedTask({
          ...updatedTask,
          completed: !task.completed,
        });

        server_updateTaskDone({
          id,
          task: {
            ...updatedTask,
            completed: !task.completed,
          },
        });
      }}
    />
  );
}
