"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addTodo, deleteTodo, setTodos, updateTodo } from "@/redux/todoSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPowerOff } from "react-icons/fa6";
import { MdDarkMode } from "react-icons/md";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeToggle } from "@/components/ThemeToggle";
interface Todo {
  title: string;
  completed: boolean;
  _id: string;
}

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const todos = useSelector((state: RootState) => state.todos.todos); // Access the todos array from the state
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTodo = async () => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });
      const todo = await res.json();
      dispatch(addTodo(todo));
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });
      const updatedTodo = await res.json();
      dispatch(updateTodo(updatedTodo));
      setEditingId(null);
      setTitle("");
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      const updatedTodo = await res.json();
      dispatch(updateTodo(updatedTodo));
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      dispatch(deleteTodo(id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      dispatch(setTodos(data));
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto lg:w-1/2 w-full p-4">
      <div className="flex items-center py-4 justify-between gap-2">
        <h1>Welcome to Your Todo App</h1>
        <div className="flex items-center gap-2">
          <p>{session?.user?.name}</p>
          <Button size="sm" onClick={() => signOut()}>
            <FaPowerOff />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {session ? (
        <>
          <form className="flex items-center gap-2 py-4">
            <Input
              type="text"
              placeholder="New task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={inputRef}
            />
            {editingId ? (
              <Button
                onClick={() => {
                  handleEditTodo(editingId);
                }}
                type="submit"
              >
                Edit
              </Button>
            ) : (
              <Button type="submit" variant="default" onClick={handleAddTodo}>
                Add
              </Button>
            )}
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos?.map((todo: Todo, index: number) => (
                <TableRow key={todo._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell
                    onClick={() =>
                      handleToggleComplete(todo._id, todo.completed)
                    }
                    className={`${
                      todo.completed ? "line-through" : ""
                    } cursor-pointer`}
                  >
                    {todo.title}
                  </TableCell>
                  <TableCell className=" flex items-center gap-2 justify-end">
                    {editingId === todo._id ? (
                      <Button
                        onClick={() => {
                          setTitle("");
                          setEditingId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setTitle(todo.title);
                          setEditingId(todo._id);
                          inputRef.current?.focus();
                        }}
                        variant="secondary"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteTodo(todo._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
}
