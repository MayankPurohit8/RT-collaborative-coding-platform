import { nanoid } from "nanoid";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
export const Dashboard = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleCreateRoom = () => {
    if (username == "") {
      return;
    }
    const newRoomId = nanoid(8);
    navigate(`/room/${newRoomId}`, {
      state: { username: username, action: "create" },
    });
  };

  const handleJoinRoom = () => {
    if (username == "") return;
    if (!roomId.trim()) return;

    navigate(`/room/${roomId}`, {
      state: { username: username, action: "join" },
    });
  };
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-10">
      <div className="flex gap-3 items-center">
        <div className="">Enter Username</div>
        <input
          type="text"
          placeholder="Alex Mercer"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 mr-2"
        />
      </div>
      {/* Create Room */}
      <div>
        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Room
        </button>
      </div>
      OR
      {/* Join Room */}
      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border px-3 py-2 mr-2"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};
