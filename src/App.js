import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {

  const [isLogin, setIsLogin] = useState(true);

  return (
      <div>
        {isLogin ? (
            <Login switchToSignup={() => setIsLogin(false)} />
        ) : (
            <Signup switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
  );
}

export default App;