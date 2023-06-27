import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { useNavigate } from "react-router-dom";
import { createPlayer } from "../../utils/newPlayer.tsx";

function AuthComponent() {
  const [displayName, setDisplayName] = useState("Dutt1ez");
  const [email, setEmail] = useState("seanwilcox@comcast.net");
  const [password, setPassword] = useState("Pajama");
  const [isRegistered, setIsRegistered] = useState(true);

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createPlayer(userCredential.user.uid, displayName);
      setIsRegistered(true);
    } catch (error) {
      // Registration failed
      console.error("Error registering user:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle the login success, e.g., redirect to the game
      navigate("/");
    } catch (error) {
      // Login failed
      console.error("Error logging in:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container">
        <h2 className="form-title">{isRegistered ? "Login" : "Registration"}</h2>
        {/* Email and password input fields */}
        <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            id="email-input"
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            id="password-input"
        />
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        {/* Conditional rendering based on isRegistered state */}
        {isRegistered ? (
            <button onClick={handleLogin} className="auth-button">
            Login
            </button>
        ) : (
            <button onClick={handleRegistration} className="auth-button">
            Register
            </button>
        )}
        {/* Toggle between registration and login */}
        <p className="auth-toggle" onClick={() => setIsRegistered(!isRegistered)}>
            {isRegistered ? "Don't have an account? Register here." : "Already have an account? Login here."}
        </p>
    </div>
  );
}

export default AuthComponent;
