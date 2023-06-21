import React, { useRef, useState } from "react";
import Moveable from "react-moveable";
import useFetchPhotos from "./hooks/useFetchPhotos";

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
  image
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
    image
  });

  let parent = containerRef.current;
  let parentBounds = parent?.getBoundingClientRect();
  
  const onResize = async (e) => {
    const containerBounds = parent.getBoundingClientRect();
    const containerLeft = containerBounds.left;
    const containerTop = containerBounds.top;
  
    let newWidth = e.width;
    let newHeight = e.height;
  
    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;
  
    if (positionMaxTop > containerBounds.height - containerTop) {
      newHeight = containerBounds.height - containerTop - top;
    }
    if (positionMaxLeft > containerBounds.width - containerLeft) {
      newWidth = containerBounds.width - containerLeft - left;
    }
  
    const { adjustedTranslateX, adjustedTranslateY } = calculateAdjustedTranslate(e.drag.beforeTranslate, newWidth, newHeight, e);
  
    const absoluteTop = top + adjustedTranslateY;
    const absoluteLeft = left + adjustedTranslateX;
  
    updateMoveable(id, {
      top: absoluteTop,
      left: absoluteLeft,
      width: newWidth,
      height: newHeight,
      color,
      image
    });
  
    updateStyles(newWidth, newHeight, adjustedTranslateX, adjustedTranslateY);
    updateNodeReference(absoluteTop, absoluteLeft, adjustedTranslateX, adjustedTranslateY);
  };
  
  const calculateAdjustedTranslate = (beforeTranslate, newWidth, newHeight, e) => {
    const translateX = beforeTranslate[0];
    const translateY = beforeTranslate[1];
  
    const adjustedTranslateX = translateX > 0 ? Math.min(translateX, newWidth - e.width) : translateX;
    const adjustedTranslateY = translateY > 0 ? Math.min(translateY, newHeight - e.height) : translateY;
  
    return { adjustedTranslateX, adjustedTranslateY };
  };
  
  const updateStyles = (newWidth, newHeight, adjustedTranslateX, adjustedTranslateY) => {
    ref.current.style.width = `${newWidth}px`;
    ref.current.style.height = `${newHeight}px`;
    ref.current.style.transform = `translate(${adjustedTranslateX}px, ${adjustedTranslateY}px)`;
  };
  
  const updateNodeReference = (absoluteTop, absoluteLeft, adjustedTranslateX, adjustedTranslateY) => {
    setNodoReferencia({
      ...nodoReferencia,
      translateX: adjustedTranslateX,
      translateY: adjustedTranslateY,
      top: absoluteTop,
      left: absoluteLeft,
    });
  };
    
    
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
          image
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
          backgroundImage: `url(${image?.url})`,
          backgroundSize: '100% 100%',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
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
            image
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
