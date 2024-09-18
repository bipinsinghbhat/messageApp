import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"

const Register = () => {
  const navigate = useNavigate();
  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  };

  const [formState, setFormState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role || !phone) {
      alert("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/register", formState);
      alert("User registered successfully");
      console.log("formState", formState);
      navigate("/");
    } catch (error) {
      console.error(error);
      if ((error.response.data.error = "User already exists")) {
        alert("User already exists");
      } else {
        alert("error in registering the user");
      }
    }
  };

  const handleLogin=()=>{
    navigate("/login")
  }

  const { name, email, password, role, phone } = formState;
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Registration Page</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          name="name"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          name="password"
          onChange={handleChange}
        />
        <select name="role" value={role} onChange={handleChange}>
          <option value="">Role</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Institute">Institute</option>
        </select>
        <input
          type="number"
          placeholder="Phone"
          value={phone}
          name="phone"
          onChange={handleChange}
        />
        <button type="submit" className={styles.submit}>Submit</button>
      </form>

      <button onClick={handleLogin} className={styles.LoginBtn}>
        Go to Login Page
      </button>
    </div>
  );
};

export default Register;
