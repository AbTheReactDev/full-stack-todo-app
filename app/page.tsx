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
import { Formik, Form, Label, ErrorMessage } from "formik";

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
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTodo = async (title: string) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });
      const todo = await res.json();
      dispatch(addTodo(todo));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodo = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });
      const updatedTodo = await res.json();
      dispatch(updateTodo(updatedTodo));
      setEditingId(null);
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
    <div className="p-4 w-full lg:w-[75%] mx-auto">
      <div className="flex items-center py-4 justify-between gap-2">
        <h1 className="text-2xl font-bold">Welcome to Your Todo App</h1>
        <div className="flex items-center gap-2">
          <p>{session?.user?.name}</p>
          <Button size="sm" onClick={() => signOut()}>
            <FaPowerOff />
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <Formik
        initialValues={{ title: "" }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          if (editingId) {
            handleEditTodo(editingId, values.title);
          } else {
            handleAddTodo(values.title);
          }
          setSubmitting(false);
          resetForm();
          if (inputRef.current) inputRef.current.value = "";
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting }) => (
          <Form className="flex items-center gap-2">
            <Input
              type="text"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title || inputRef.current?.value}
              required
              ref={inputRef}
              placeholder="New task"
            />

            {editingId ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Edit"}
              </Button>
            ) : (
              <Button
                disabled={isSubmitting || !values.title}
                type="submit"
                variant="default"
              >
                {isSubmitting ? "Loading..." : "Add"}
              </Button>
            )}
          </Form>
        )}
      </Formik>

      {!todos.length && (
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-2xl font-bold">No todos found</p>
        </div>
      )}

      {todos.length > 0 && (
        <Table className="mt-10">
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
                  onClick={() => handleToggleComplete(todo._id, todo.completed)}
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
                        if (inputRef.current) inputRef.current.value = "";
                        setEditingId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditingId(todo._id);
                        if (inputRef.current)
                          inputRef.current.value = todo.title;
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
      )}
    </div>
  );
}
