import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 20;

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    let newHead;

    switch (direction) {
      case "UP":
        newHead = [head[0], head[1] - 1];
        break;
      case "DOWN":
        newHead = [head[0], head[1] + 1];
        break;
      case "LEFT":
        newHead = [head[0] - 1, head[1]];
        break;
      case "RIGHT":
        newHead = [head[0] + 1, head[1]];
        break;
      default:
        return;
    }

    newSnake.push(newHead);
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood(generateFood());
    } else {
      newSnake.shift();
    }

    if (isCollision(newHead, newSnake)) {
      setGameOver(true);
      return;
    }

    setSnake(newSnake);
  };

  const isCollision = (head, snake) => {
    if (head[0] < 0 || head[1] < 0 || head[0] >= gridSize || head[1] >= gridSize) {
      return true;
    }
    for (let segment of snake.slice(0, -1)) {
      if (segment[0] === head[0] && segment[1] === head[1]) {
        return true;
      }
    }
    return false;
  };

  const generateFood = () => {
    let x = Math.floor(Math.random() * gridSize);
    let y = Math.floor(Math.random() * gridSize);
    while (snake.some((segment) => segment[0] === x && segment[1] === y)) {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
    }
    return [x, y];
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(moveSnake, 200);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, snake, gameOver]);

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#f0f8ff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        flexDirection: "column",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>Snake Game</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gap: "1px",
          backgroundColor: "#ddd",
          padding: "5px",
          border: "2px solid #555",
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isSnake = snake.some((segment) => segment[0] === x && segment[1] === y);
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={i}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: isSnake ? "#4CAF50" : isFood ? "#FF5722" : "#fff",
              }}
            ></div>
          );
        })}
      </div>
      {gameOver && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "1.2rem",
            color: "#FF5722",
            textAlign: "center",
          }}
        >
          Game Over! Refresh to Restart.
        </p>
      )}
    </div>
  );
}

export default App;
