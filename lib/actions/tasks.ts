'use server';

import { revalidateTag } from 'next/cache';

import { getAPIBaseURL } from '../config/api';
import { Task } from '../types/tasks';

export async function createTask(task: Task) {
  const res = await fetch(`${getAPIBaseURL()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  revalidateTag('get-tasks');

  return res.json();
}

export const updateTask = async ({ id, task }: { id: string; task: Task }) => {
  const res = await fetch(`${getAPIBaseURL()}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error('Failed to update task');
  }

  revalidateTag('get-tasks');

  return res.json();
};

export const deleteTask = async (id: string) => {
  const res = await fetch(`${getAPIBaseURL()}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }

  revalidateTag('get-tasks');

  return res.json();
};
