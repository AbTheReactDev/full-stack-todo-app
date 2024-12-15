"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Form, ListGroup, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addTodo, deleteTodo, setTodos, updateTodo } from "@/redux/todoSlice";

interface Todo {
  title: string;
  completed: boolean;
  _id: string;
}

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const todos = useSelector((state: RootState) => state.todos.todos); // Access the todos array from the state
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async () => {
    setLoading(true);
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
    setLoading(false);
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

  if (status === "loading" || loading) {
    return (
      <Container className="text-center d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Welcome to Your Todo App</h1>
        <Button variant="danger" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>

      {session ? (
        <>
          <p>You are signed in as {session.user?.email}</p>

          <Form className="d-flex mt-3">
            <Form.Control
              type="text"
              placeholder="New task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {editingId ? (
              <Button
                variant="success"
                className="ms-2"
                onClick={() => handleEditTodo(editingId)}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="primary"
                className="ms-2"
                onClick={handleAddTodo}
              >
                Add
              </Button>
            )}
          </Form>
          <ListGroup className="mt-4">
            {todos?.map((todo: Todo) => (
              <ListGroup.Item
                key={todo._id}
                className="d-flex justify-content-between align-items-center"
              >
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "unset",
                    cursor: "pointer",
                  }}
                  onClick={() => handleToggleComplete(todo._id, todo.completed)}
                >
                  {todo.title}
                </span>
                <div>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => {
                      setTitle(todo.title);
                      setEditingId(todo._id);
                    }}
                    disabled={editingId === todo._id}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <div>Redirecting...</div>
      )}
    </Container>
  );
}
