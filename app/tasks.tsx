'use client';

import { Task } from '@/lib/types/tasks';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import ActionsTask from './actions-task';
import AddTask from './add-task';
import UpdateTaskComplete from './update-task-complete';

export default function TasksPage({ tasks }: { tasks: Task[] }) {
  // Optimistic Update
  const [isAddTaskPending, setIsAddTaskPending] = useState(false);
  const [isDeleteTaskPending, setIsDeleteTaskPending] = useState(false);
  const [isUpdateTaskPending, setIsUpdateTaskPending] = useState(false);

  return (
    <>
      <main className="flex items-start flex-col justify-between p-8 max-w-xl mx-auto text-zinc-800 ">
        <section className="flex flex-col items-start justify-center w-full mb-4">
          <h1 className="text-2xl font-medium">Tasks</h1>
          <p className="text-base text-zinc-400">Add a task</p>
        </section>
        <section className="w-full mb-52">
          {tasks.length === 0 && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-400">
              No tasks found
            </div>
          )}
          {tasks.map((task) => (
            <div
              className={cn(
                'flex justify-between items-center gap-2 border-b border-b-zinc-100 bg-white hover:bg-zinc-50 px-4 py-2 -mx-4 transition-all duration-500 ease-in-out',
                isDeleteTaskPending && 'bg-red-100/40',
                isUpdateTaskPending && 'bg-zinc-100',
              )}
              key={task.id}
            >
              <div className="flex items-start w-full gap-4">
                {/* Checkbox from ui/shadcn */}
                <UpdateTaskComplete id={task.id} task={task} />

                <div className="w-full cursor-pointer">
                  <h2
                    className={cn(
                      'font-medium leading-none',
                      task.completed
                        ? 'line-through text-zinc-400'
                        : 'text-zinc-800',
                    )}
                  >
                    {task.task}
                  </h2>
                  <p
                    className="text-zinc-400 max-w-80 text-sm
          overflow-ellipsis overflow-hidden whitespace-nowrap
          "
                  >
                    {task.description}
                  </p>
                </div>
              </div>

              <ActionsTask
                setIsUpdateTaskPending={setIsUpdateTaskPending}
                setIsDeleteTaskPending={setIsDeleteTaskPending}
                task={task}
              />
            </div>
          ))}
          {isAddTaskPending && (
            <div className="flex items-center gap-2 border-b border-b-zinc-100 bg-zinc-100/50 pl-[28px] pr-[28px] py-2 -mx-4 h-20 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding task
            </div>
          )}
        </section>
      </main>
      <AddTask setIsAddTaskPending={setIsAddTaskPending} />
    </>
  );
}
