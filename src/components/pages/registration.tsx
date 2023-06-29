import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { useNavigate } from "react-router-dom";
import { createPlayer } from "../../utils/newPlayer.tsx";

function AuthComponent() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createPlayer(userCredential.user.uid, displayName);
      setIsRegistered(true);
      handleLogin();
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
    <div className="auth-container">
      <h2 className="form-title">{isRegistered ? "Login" : "Registration"}</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          id="email-input"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          id="password-input"
        />
        {!isRegistered && (<p>Password must be at least six characters.</p>)}
      </div>
      {!isRegistered && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="input-field"
            id="display-name-input"
          />
        </div>
      )}
      <div className="form-group">
        <button onClick={isRegistered ? handleLogin : handleRegistration} className="auth-button">
          {isRegistered ? "Login" : "Register"}
        </button>
      </div>
      <p className="auth-toggle" onClick={() => setIsRegistered(!isRegistered)}>
        {isRegistered ? "Don't have an account? Register here." : "Already have an account? Login here."}
      </p>
    </div>
  );
}

export default AuthComponent;
