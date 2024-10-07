import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const makeToast = (type, message) => {
  alert(`${type}: ${message}`);
};

const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const chatroomNameRef = React.useRef();

  // Use useCallback to memoize the getChatrooms function
  const getChatrooms = React.useCallback(() => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000); // Retry fetching chatrooms after 3 seconds
      });
  }, []); // Empty dependency array means it won't change unless dependencies change

  // Effect to call getChatrooms when the component mounts
  React.useEffect(() => {
    getChatrooms();
  }, [getChatrooms]); // Now we include getChatrooms in the dependency array

  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post(
        "http://localhost:8000/chatroom",
        { name: chatroomName },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        getChatrooms(); // Refresh chatrooms after creation
        chatroomNameRef.current.value = ""; // Clear input field
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          makeToast("error", err.response.data.message);
        }
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">chatttt</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">nome do chat</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            ref={chatroomNameRef}
          />
        </div>
      </div>
      <button onClick={createChatroom}>Criar chat</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={`/chatroom/${chatroom._id}`}>
              <div className="join">entrar</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
