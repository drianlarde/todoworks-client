'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/lib/types/tasks';
import { Edit2, Ellipsis } from 'lucide-react';
import { useState } from 'react';

import DeleteTask from './delete-task';
import UpdateTask from './update-task';

export default function ActionsTask({
  task,
  setOptimisticTasks,
}: {
  task: Task;
  optimisticTasks: Task[];
  setOptimisticTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        {/* Dropdown Trigger */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Ellipsis className="w-4" />
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown Content */}
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex gap-2 items-center bg-white hover:bg-zinc-100"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2 className="w-3" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer bg-white hover:bg-zinc-100">
            <DeleteTask task={task} setOptimisticTasks={setOptimisticTasks} />{' '}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateTask
        id={task.id}
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        setOptimisticTasks={setOptimisticTasks}
      />
    </>
  );
}
