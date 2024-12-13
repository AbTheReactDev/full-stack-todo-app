"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Form, ListGroup, Spinner } from "react-bootstrap";

interface Todo {
  _id: string;
  task: string;
  completed: boolean;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }

      const todo = await res.json();
      setTodos([...todos, todo]);
      setNewTask("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await res.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      setNewTask("");
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

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await res.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchTodos();
    }
  }, [status, router]);

  if (loading) {
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
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
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
            {todos?.map((todo) => (
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
                  {todo.task}
                </span>
                <div>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => {
                      setNewTask(todo.task);
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
