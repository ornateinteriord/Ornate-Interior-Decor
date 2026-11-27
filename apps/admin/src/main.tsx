import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Deployment trigger
createRoot(document.getElementById("root")!).render(<App />);
