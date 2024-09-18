import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css"; 

const HomePage = () => {
  const {
    isAuth,
    token,
    setToken,
    setIsAuth,
    currentuserId,
    setCurrentUserId,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAuth, token]);

  if (loading) {
    return <p>...loading</p>;
  }

  if (error) {
    return <p>...error</p>;
  }

  const handleLogout = async () => {
    if (!isAuth || !currentuserId) {
      alert("Please log in");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        { userId: currentuserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setToken("");
      setIsAuth(false);
      setCurrentUserId("");
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const MessagePage = (chatId) => () => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={handleLogout}>
        Logout
      </button>

      {user.length > 0 && (
        <div className={styles.userList}>
          {user.map((ele) => (
            <div key={ele.email} className={styles.userItem}>
              <p className={styles.userName}>{ele.name}</p>
              <p className={styles.userStatus}>
                Status: {ele.isOnline ? "online" : "offline"}
              </p>
              <button className={styles.button} onClick={MessagePage(ele._id)}>
                Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
