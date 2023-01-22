import React, { useContext, useRef, useState } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [boundaries, setBoundaries] = useState([]);
  const [keys, setKeys] = useState({
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
  });
  const [lastKey, setLastKey] = useState("");
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  console.log(contextRef)
  const map = [
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", ".", ".", ".", ".", ".", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", "-", ".", ".", ".", "-", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", "-", ".", ".", ".", "-", "-", ".", "-"],
    ["-", ".", ".", ".", ".", "-", ".", ".", ".", ".", "-"],
    ["-", ".", "-", ".", "-", "-", "-", ".", "-", ".", "-"],
    ["-", ".", ".", ".", ".", ".", ".", ".", ".", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ];

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    // context.lineCap = "round";
    // context.strokeStyle = "black";
    // context.lineWidth = 5;
    contextRef.current = context;
    drawBoundaries(map);
  };

  class Boundary {
    static width = 40;
    static height = 40;
    constructor({ position }) {
      this.position = position;
      this.width = 40;
      this.height = 40;
      // this.image = image;
    }

    draw() {
      // contextRef.fillStyle = "blue";
      // contextRef.fillRect(
      //   this.position.x,
      //   this.position.y,
      //   this.width,
      //   this.height
      // );
      // contextRef.drawImage(this.image, this.position.x, this.position.y);
      console.log("draw");
    }
  }

  class Player {
    constructor({ position, velocity }) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 15;
    }

    draw() {
      // contextRef.beginPath();
      // contextRef.arc(
      //   this.position.x,
      //   this.position.y,
      //   this.radius,
      //   0,
      //   Math.PI * 2
      // );
      // contextRef.fillStyle = "yellow";
      // contextRef.fill();
      // contextRef.closePath();
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x; //updates left/right location by 1 increment of velocity unit
      this.position.y += this.velocity.y; ////updates up/down location by 1 increment of velocity unit
    }
  }

  const player = new Player({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: 0,
      y: 0,
    },
  });

  const drawBoundaries = () => {
    const boundaries = [];
    map.forEach((row, i) => {
      row.forEach((symbol, j) => {
        switch (symbol) {
          case "-":
            boundaries.push(
              new Boundary({
                position: {
                  x: Boundary.width * j,
                  y: Boundary.height * i,
                },
                //image createImage('./img/pipeHorizontal.png'),
              })
            );
            break;
        }
      });
    });
    setBoundaries(boundaries);
  };

  function circleCollidesWithRectangle({ circle, rectangle }) {
    return (
      circle.position.y - circle.radius + circle.velocity.y <=
        rectangle.position.y + rectangle.height &&
      circle.position.x + circle.radius + circle.velocity.x >=
        rectangle.position.x &&
      circle.position.y + circle.radius + circle.velocity.y >=
        rectangle.position.y &&
      circle.position.x - circle.radius + circle.velocity.x <=
        rectangle.position.x + rectangle.width
    );
  }

  const startAnimation = () => {

    function animation(){
      if (keys.w.pressed && lastKey === "w") {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithRectangle({
              circle: {
                ...player,
                velocity: {
                  x: 0,
                  y: -5,
                },
              },
              rectangle: boundary,
            }) //are we colliding with any rectangles in the next frame if we move left.. or press 'w'
          ) {
            player.velocity.y = 0; //if collision is detected-- stop player movement
            break;
          } else {
            player.velocity.y = -5; //if not colliding, move player up
          }
        }
      } else if (keys.a.pressed && lastKey === "a") {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithRectangle({
              circle: {
                ...player,
                velocity: {
                  x: -5,
                  y: 0,
                },
              },
              rectangle: boundary,
            })
          ) {
            player.velocity.x = 0;
            break;
          } else {
            player.velocity.x = -5;
          }
        }
      } else if (keys.s.pressed && lastKey === "s") {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithRectangle({
              circle: {
                ...player,
                velocity: {
                  x: 0,
                  y: 5,
                },
              },
              rectangle: boundary,
            })
          ) {
            player.velocity.y = 0;
            break;
          } else {
            player.velocity.y = 5;
          }
        }
      } else if (keys.d.pressed && lastKey === "d") {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithRectangle({
              circle: {
                ...player,
                velocity: {
                  x: 5,
                  y: 0,
                },
              },
              rectangle: boundary,
            })
          ) {
            player.velocity.x = 0;
            break;
          } else {
            player.velocity.x = 5;
          }
        }
      }
    

      boundaries.forEach((boundary) => {
        boundary.draw();

        if (
          circleCollidesWithRectangle({
            circle: player,
            rectangle: boundary,
          })
        ) {
          //collision detection
          console.log("choque!");
          player.velocity.y = 0;
          player.velocity.x = 0;
        }
      });

      player.update();
    }

    window.requestAnimationFrame(animation);
    // contextRef.clearRect(0, 0, canvasRef.width, canvasRef.height);
  }

  
  startAnimation();

  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "w":
        setKeys({ ...keys, w: { pressed: true } });
        setLastKey("w");
        break;
      case "a":
        setKeys({ ...keys, a: { pressed: true } });
        setLastKey("a");
        break;
      case "s":
        setKeys({ ...keys, s: { pressed: true } });
        setLastKey("s");
        break;
      case "d":
        setKeys({ ...keys, d: { pressed: true } });
        setLastKey("d");
        break;
    }
  }); //makes player movement start

  window.addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "w":
        setKeys({ ...keys, w: { pressed: false } });
        break;
      case "a":
        setKeys({ ...keys, a: { pressed: false } });
        break;
      case "s":
        setKeys({ ...keys, s: { pressed: false } });
        break;
      case "d":
        setKeys({ ...keys, d: { pressed: false } });
        break;
    }
  }); //makes player movement STOP when key stops being pressed

  // const startDrawing = ({ nativeEvent }) => {
  //   console.log(nativeEvent);
  //   const { offsetX, offsetY } = nativeEvent;
  //   contextRef.current.beginPath();
  //   contextRef.current.moveTo(offsetX, offsetY);
  //   setIsDrawing(true);
  // };

  // const finishDrawing = () => {
  //   contextRef.current.closePath();
  //   setIsDrawing(false);
  // };

  // const draw = ({ nativeEvent }) => {
  //   if (!isDrawing) {
  //     return;
  //   }
  //   const { offsetX, offsetY } = nativeEvent;
  //   contextRef.current.lineTo(offsetX, offsetY);
  //   contextRef.current.stroke();
  // };

  // const clearCanvas = () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d")
  //   context.fillStyle = "white"
  //   context.fillRect(0, 0, canvas.width, canvas.height)
  // }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
