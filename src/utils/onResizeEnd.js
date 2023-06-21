const onResizeEnd = async (
  e,
  top,
  left,
  id,
  color,
  image,
  updateMoveable,
  parentBounds
) => {
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
      image,
    },
    true
  );
};

export default onResizeEnd;
