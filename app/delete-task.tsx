'use client';

import { Button } from '@/components/ui/button';
import { deleteTask } from '@/lib/actions/tasks';
import { useMutation } from '@tanstack/react-query';
import { CircleX } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteTask({
  id,
  setIsDeleteTaskPending,
}: {
  id: string;
  setIsDeleteTaskPending: (isDeleteTaskPending: boolean) => void;
}) {
  const { mutate: server_deleteTask, isPending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success('Task deleted successfully', {
        duration: 2000,
        position: 'top-center',
      });
      setIsDeleteTaskPending(false);
    },
  });

  if (isPending) {
    setIsDeleteTaskPending(true);
  }

  return (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => {
        server_deleteTask(id);
      }}
    >
      <CircleX className="w-3" /> Delete
    </div>
  );
}
