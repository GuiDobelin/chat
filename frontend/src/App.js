import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Routes and Route
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = React.useCallback(() => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token,
        },
      });

      setSocket(newSocket);
    }
  }, [socket]); 

  React.useEffect(() => {
    setupSocket(); 
    return () => {
      if (socket) {
        socket.disconnect(); 
      }
    };
  }, [setupSocket, socket]); 

  return (
    <BrowserRouter>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<IndexPage />} exact />
        <Route
          path="/login"
          element={<LoginPage setupSocket={setupSocket} />} 
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={<DashboardPage socket={socket} />}  
        />
        <Route
          path="/chatroom/:id"
          element={<ChatroomPage socket={socket} />}  
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
