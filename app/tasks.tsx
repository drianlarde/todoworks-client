'use client';

import { Task } from '@/lib/types/tasks';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import ActionsTask from './actions-task';
import AddTask from './add-task';
import UpdateTaskComplete from './update-task-complete';

export default function TasksPage({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, setOptimisticTasks] = useState(tasks);

  return (
    <>
      <main className="flex items-start flex-col justify-between p-8 max-w-xl mx-auto text-zinc-800 ">
        <section className="flex flex-col items-start justify-center w-full mb-4">
          <h1 className="text-2xl font-medium">Tasks</h1>
          <p className="text-base text-zinc-400">Add a task</p>
        </section>
        <section className="w-full mb-52">
          {optimisticTasks.length === 0 && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-400">
              No tasks found
            </div>
          )}
          {optimisticTasks
            .sort((a, b) =>
              a.completed === b.completed ? 0 : a.completed ? -1 : 1,
            )
            .map((task) => (
              <div
                key={task.id}
                className={cn(
                  'flex justify-between items-center gap-2 border-b border-b-zinc-100 bg-white hover:bg-zinc-50 px-4 py-2 -mx-4 transition-all duration-500 ease-in-out',
                  task.isPending && 'opacity-50', // Apply low opacity if the task is pending
                )}
              >
                <div className="flex items-start w-full gap-4">
                  {/* Checkbox from ui/shadcn */}
                  <UpdateTaskComplete
                    id={task.id}
                    task={task}
                    setOptimisticTasks={setOptimisticTasks}
                  />

                  <div className="max-w-[200px] sm:max-w-full cursor-pointer">
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
                  task={task}
                  optimisticTasks={optimisticTasks}
                  setOptimisticTasks={setOptimisticTasks}
                />
              </div>
            ))}
        </section>
      </main>
      <AddTask setOptimisticTasks={setOptimisticTasks} />
    </>
  );
}
