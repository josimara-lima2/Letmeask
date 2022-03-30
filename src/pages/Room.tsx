import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import Button from "../components/Button";
import RoomCode from "../components/RoomCode";
import useAuth from "../hooks/useAuth";
import { database } from "../services/firebase";
import "../styles/room.scss";

type RoomParams = {
  id: string;
};
const Room = () => {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo letmeask" />
          <div>
            <RoomCode code={roomId || ""} />
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala</h1>
          <span>4 perguntas</span>
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            <span>
              Para enviar uma pergunta, <button>faça seu login</button>
            </span>
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Room;
