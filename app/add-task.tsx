'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createTask } from '@/lib/actions/tasks';
import { Task } from '@/lib/types/tasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CirclePlus, Command, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  task: z.string().min(2, {
    message: 'Task must be at least 2 characters.',
  }),
  description: z.string().nullable(),
});

export default function AddTask({
  setOptimisticTasks,
}: {
  setOptimisticTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Update the useHotkeys hook
  useHotkeys('meta+k, ctrl+k', () => {
    setIsOpen(true);
  });

  // Detect the user's operating system
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      task: '',
      description: '',
      completed: false,
    },
  });

  const { mutate: server_createTask } = useMutation({
    mutationFn: createTask,
    onSuccess: (data, variables) => {
      form.reset();
      toast.success('Task added successfully', {
        duration: 2000,
        position: 'top-center',
      });

      console.log('Task added:', data);

      // Update the optimistic task with the received data (including the generated ID)
      setOptimisticTasks((prevTasks) => data);

      // Smooth scroll to the bottom of the page
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },
    onError: (_, variables) => {
      // Remove the optimistic task from the list if the request fails
      setOptimisticTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== variables.id),
      );
      toast.error('Failed to add task', {
        duration: 2000,
        position: 'top-center',
      });
    },
  });

  const onSubmit = (values: Task) => {
    setIsOpen(false);

    const newTask: Task = {
      ...values,
      completed: false,
      isPending: true, // Add a flag to indicate the pending state
    };

    console.log('New Task:', newTask);

    // Optimistically add the new task to the list
    setOptimisticTasks((prevTasks) => [...prevTasks, newTask]);

    // Send the create request to the server
    server_createTask(newTask);
  };

  return (
    <div className="fixed bottom-0 w-full flex justify-center">
      <section className="w-full flex justify-end max-w-xl">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex gap-3 m-8 items-center">
              <Button
                className="flex gap-1 bg-white relative shadow-2xl"
                variant="outline"
                size="sm"
              >
                <CirclePlus className="w-4" /> Add Task
                {/* Add a white background glow gradient white from top to  bottom transparent */}
                <div className="absolute top-0 right-0 bottom-0 left-0 rounded-xl -z-10 -m-6 bg-gradient-to-t from-white to-transparent" />
              </Button>
              <Badge className="text-zinc-400" variant="secondary">
                {isMac ? (
                  <>
                    <Command className="w-3 mr-1" />{' '}
                    <Plus className="w-2 mr-1" /> K
                  </>
                ) : (
                  <>
                    <span className="mr-1">CTRL</span>{' '}
                    <Plus className="w-2 mr-1" /> K{' '}
                  </>
                )}
              </Badge>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-xs rounded-xl flex flex-col">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                Add a new task to your list. Make sure to save your changes.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task</FormLabel>
                      <FormControl>
                        <Input placeholder="Task" {...field} />
                      </FormControl>
                      <FormDescription>Enter the task name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the task description.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    className="flex gap-1 mb-2 md:mb-0"
                    variant="outline"
                    type="submit"
                  >
                    <CirclePlus className="w-4" /> Add Task
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
