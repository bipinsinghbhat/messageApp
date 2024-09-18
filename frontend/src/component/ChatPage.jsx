import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./ChatPage.module.css"; 

const ChatPage = () => {
  const { token, currentuserId } = useContext(AuthContext);
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch chat messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/messages/user/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/messages/send",
        {
          text: newMessage,
          receiver: chatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setEditText(message.text);
  };

  const handleUpdate = async () => {
    if (!editText.trim()) {
      alert("Updated message cannot be empty!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/messages/${editingMessage._id}`,
        {
          userId: currentuserId,
          newMessage: editText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === response.data.updatedMessage._id
            ? response.data.updatedMessage
            : msg
        )
      );
      setEditingMessage(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`http://localhost:5000/messages/${messageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId: currentuserId },
        });
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const handleDeleteClick = (id) => () => {
    return handleDelete(id);
  };

  const handleEditClick = (msg) => () => {
    return handleEdit(msg);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error loading the chat messages.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Chat Page</h2>
      <div className={styles.messageList}>
        {messages?.map((msg) => (
          <div key={msg._id} className={styles.messageItem}>
            <p className={styles.messageText}>
              <strong>{msg.sender === currentuserId ? "You" : "Other"}:</strong>
              {editingMessage && editingMessage._id === msg._id ? (
                <>
                  <textarea
                    className={styles.textarea}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className={styles.sendButton} onClick={handleUpdate}>
                    Update
                  </button>
                </>
              ) : (
                <>
                  {msg.text}
                  {msg.sender === currentuserId && (
                    <div className={styles.messageActions}>
                      <button onClick={handleEditClick(msg)}>Edit</button>
                      <button onClick={handleDeleteClick(msg._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
      <div>
        <textarea
          className={styles.textarea}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className={styles.sendButton} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
