import { getAPIBaseURL } from '@/lib/config/api';
import { Task } from '@/lib/types/tasks';

import TasksPage from './tasks';

export const runtime = 'edge';

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(getAPIBaseURL(), { next: { tags: ['get-tasks'] } });
  const data = await res.json();

  const completedTasks = data.filter((task: Task) => task.completed);
  const incompletedTasks = data.filter((task: Task) => !task.completed);

  return [...completedTasks, ...incompletedTasks];
}

export default async function Home() {
  const tasks: Task[] = await fetchTasks(); // Change the type to Task[] and add await

  console.log('Tasks', tasks);

  return (
    <div className="relative h-screen">
      <TasksPage tasks={tasks} />
    </div>
  );
}
