import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import toast from "react-hot-toast";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  // { id: uuidv4(), task: todo, completed: false, isEditing: false }

  // ======================================Add todo
  const addTodo = async (todo) => {
    todo = {
      task: todo,
    };
    try {
      const res = await fetch("http://localhost:3001/addTodo", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(todo),
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data?.message);
        AllTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =================================Get All Todos

  const AllTodo = async () => {
    try {
      const res = await fetch("http://localhost:3001/todos", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await res.json();
      if (res.status === 200) {
        setTodos(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    AllTodo();
  }, []);

  //  ==================================Delete Todo

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/deleteTodo/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.error(data?.message);
        AllTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo?._id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo?._id === id ? { ...todo, task, isEditing: false } : todo
      )
    );

    task = {
      task: task,
    };

    try {
      const res = await fetch(`http://localhost:3001/editTodo/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data?.message);
        AllTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      {/* todo form  */}
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {todos.length > 0 ? (
        todos?.map((todo) =>
          todo?.isEditing === true ? (
            <EditTodoForm editTodo={editTask} task={todo} />
          ) : (
            <div className="Todo">
              <p
                className={`${todo?.completed ? true : ""}`}
                onClick={() => toggleComplete(todo._id)}
              >
                {todo?.task}
              </p>
              <div>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={() => editTodo(todo._id)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => deleteTodo(todo._id)}
                />
              </div>
            </div>
          )
        )
      ) : (
        <p style={{ color: "white" }}>Add Some Todos!</p>
      )}
    </div>
  );
};
