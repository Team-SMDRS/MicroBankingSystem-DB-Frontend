import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

function SecurityWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 🔒 Block right-click and Shift+Right-Click (Firefox & others)
    const handleMouse = (e: MouseEvent) => {
      // Block any right-click (button 2) or when Shift is pressed
      if (e.button === 2 || e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
            return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousedown", handleMouse);
    document.addEventListener("mouseup", handleMouse);

    // 🔒 Block DevTools shortcuts and disable Shift entirely
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Shift" ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
    
        return false;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // 🔒 Detect DevTools open
    const detectDevTools = setInterval(() => {
      const start = performance.now();
      debugger;
      const time = performance.now() - start;
      if (time > 100) {
    
        
        window.close();
      }
    }, 1000);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousedown", handleMouse);
      document.removeEventListener("mouseup", handleMouse);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(detectDevTools);
    };
  }, []);

  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <SecurityWrapper>
        <App />
      </SecurityWrapper>
    </AuthProvider>
  </React.StrictMode>
);
