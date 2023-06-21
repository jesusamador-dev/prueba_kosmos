import React, { useRef, useState, useEffect } from "react";
import {
  getLimits,
  onResize,
  onResizeEnd,
  updateStyles,
} from "../utils";
import Moveable from "react-moveable";

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
  image,
  handleDelete,
}) => {
  const ref = useRef();

  const [nodeReference, setNodeReference] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    image,
  });

  let parent = containerRef.current;
  let parentBounds = parent?.getBoundingClientRect();

  const handleResize = (e) => {
    const [absoluteTop, absoluteLeft, adjustedTranslateX, adjustedTranslateY] =
      onResize(
        e,
        top,
        left,
        color,
        image,
        id,
        updateMoveable,
        updateStyles,
        parentBounds,
        ref
      );
    
    setNodeReference({
      ...nodeReference,
      translateX: adjustedTranslateX,
      translateY: adjustedTranslateY,
      top: absoluteTop,
      left: absoluteLeft,
    });
  };

  const handleResizeEnd = (e) => {
    onResizeEnd(e, top, left, id, color, image, updateMoveable, parentBounds);
  };

  const handleDrag = (e) => {
    const [finalX, finalY] = getLimits(e, parent);
    updateMoveable(id, {
      top: finalY,
      left: finalX,
      width,
      height,
      color,
      image,
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(id);
  };

  useEffect(() => {
    updateStyles(
      width,
      height,
      nodeReference.translateX || 0,
      nodeReference.translateY || 0,
      ref
    );
  }, [width, height, nodeReference.translateX, nodeReference.translateY]);

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
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
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
        onDrag={handleDrag}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={true}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
      <button
        className="delete-button"
        style={{
          position: "absolute",
          zIndex: 3001,
          top: top + 10,
          left: left + 10,
        }}
        onClick={handleDeleteClick}
      >
        Eliminar
      </button>
    </>
  );
};

export default Component;
