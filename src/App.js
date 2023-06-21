import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

const App = () => {
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
        updateEnd: true
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

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height : "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
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
            // handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            containerRef={containerRef}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
  containerRef,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = containerRef.current;
  let parentBounds = parent?.getBoundingClientRect();
  
  const onResize = async (e) => {
      // ACTUALIZAR ALTO Y ANCHO
      let newWidth = e.width;
      let newHeight = e.height;
      
      const positionMaxTop = top + newHeight;
      const positionMaxLeft = left + newWidth;
      
      if (positionMaxTop > parentBounds?.height)
        newHeight = parentBounds?.height - top;
      if (positionMaxLeft > parentBounds?.width)
        newWidth = parentBounds?.width - left;
      
      updateMoveable(id, {
        top,
        left,
        width: newWidth,
        height: newHeight,
        color,
      });
      const [finalX, finalY] = getLimits(e);

      const adjustedBeforeTranslate = adjustBeforeTranslate(
        e.drag.beforeTranslate,
        finalX - e.left,
        finalY - e.top
      );
    
      updateNodeReference(newHeight, newWidth, adjustedBeforeTranslate);
    };
    
    const adjustBeforeTranslate = (beforeTranslate, deltaX, deltaY) => {
      const adjustedX = beforeTranslate[0] - deltaX;
      const adjustedY = beforeTranslate[1] - deltaY;
      return [adjustedX, adjustedY];
    };

    const updateNodeReference = (newHeight, newWidth, beforeTranslate) => {
       // ACTUALIZAR NODO REFERENCIA
      
       ref.current.style.width = `${newWidth}px`;
       ref.current.style.height = `${newHeight}px`;
       
       let translateX = beforeTranslate[0];
       let translateY = beforeTranslate[1];
       
       ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
       
       setNodoReferencia({
         ...nodoReferencia,
         translateX,
         translateY,
         top: top + translateY < 0 ? 0 : top + translateY,
         left: left + translateX < 0 ? 0 : left + translateX,
       });
    }
    
    
    const onResizeEnd = async (e) => {
      let newWidth = e.lastEvent?.width;
      let newHeight = e.lastEvent?.height;
      
      const positionMaxTop = top + newHeight;
      const positionMaxLeft = left + newWidth;
      
      if (positionMaxTop > parentBounds?.height)
        newHeight = parentBounds?.height - top;
      if (positionMaxLeft > parentBounds?.width)
        newWidth = parentBounds?.width - left;
      
      const { lastEvent } = e;
      const { drag } = lastEvent;
      const { beforeTranslate } = drag;
      
      const absoluteTop = top + beforeTranslate[1];
      const absoluteLeft = left + beforeTranslate[0];
      
      updateMoveable(
        id,
        {
          top: absoluteTop,
          left: absoluteLeft,
          width: newWidth,
          height: newHeight,
          color,
        },
        true
      );
    };

  const getLimits = (e) => {
      const newX = Math.max(e.left, 0); // Limit left boundary
      const newY = Math.max(e.top, 0); // Limit top boundary
      const containerWidth = parent?.clientWidth;
      const containerHeight = parent?.clientHeight;
      const maxX = containerWidth - e.width; // Limit right boundary
      const maxY = containerHeight - e.height; // Limit bottom boundary
      const finalX = Math.min(newX, maxX);
      const finalY = Math.min(newY, maxY);
      return [finalX, finalY];
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        container={null}
        dragArea={parent}
        dragTarget={parent}
        resizable
        draggable
        onDrag={(e) => {
          const [finalX, finalY] = getLimits(e);
          updateMoveable(id, {
            top: finalY,
            left: finalX,
            width,
            height,
            color,
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={true}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};
