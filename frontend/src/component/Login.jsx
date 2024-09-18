import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; 

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setIsAuth, setCurrentUserId } = useContext(AuthContext);

  const initialState = {
    email: "",
    password: "",
  };
  const [formState, setformState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formState
      );
      console.log("response", response);
      if (response.data.token && response.data.userId) {
        setCurrentUserId(response.data.userId);
        setToken(response.data.token);
        setIsAuth(true);
        navigate("/");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        alert("Wrong credentials. Please try again.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const handleRegistration = () => {
    navigate("/register");
  };

  const { email, password } = formState;

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Login Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            className={styles.inputField}
          />
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </form>
        <button
          type="button"
          onClick={handleRegistration}
          className={styles.registerBtn}
        >
          Registration Page
        </button>
      </div>
    </div>
  );
};

export default Login;
