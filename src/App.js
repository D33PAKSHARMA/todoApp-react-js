import "./App.css";
import { TodoWrapper } from "./components/TodoWrapper";
import toast, { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster />
      <TodoWrapper />
    </div>
  );
}

export default App;
