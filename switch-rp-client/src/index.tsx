import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

serviceWorker.unregister();
