import React, { useRef, useState } from "react";
import useFetchPhotos from "./hooks/useFetchPhotos";
import Component from "./components/Component";

const App = () => {
  const { photos } = useFetchPhotos();
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        image: photos[Math.floor(Math.random() * photos.length)],
        updateEnd: true,
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleDelete = (id) => {
    setMoveableComponents(moveableComponents.filter(element => element.id !== id));
  }

  return (
    <main className="main" style={{ height: "100vh", width: "100vw" }}>
      <button className="button" onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        ref={containerRef}
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
            containerRef={containerRef}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </main>
  );
};

export default App;


