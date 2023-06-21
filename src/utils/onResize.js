import calculateAdjustedTranslate from './calculateAdjustedTranslate';

const onResize = (
  e,
  top,
  left,
  color,
  image,
  id,
  updateMoveable,
  updateStyles,
  parentBounds,
  ref,
) => {
  const containerBounds = parentBounds;
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

  const { adjustedTranslateX, adjustedTranslateY } = calculateAdjustedTranslate(
    e.drag.beforeTranslate,
    newWidth,
    newHeight,
    e
  );

  const absoluteTop = top + adjustedTranslateY;
  const absoluteLeft = left + adjustedTranslateX;

  updateMoveable(id, {
    top: absoluteTop,
    left: absoluteLeft,
    width: newWidth,
    height: newHeight,
    color,
    image,
  });

  updateStyles(newWidth, newHeight, adjustedTranslateX, adjustedTranslateY, ref);
  return [
    absoluteTop,
    absoluteLeft,
    adjustedTranslateX,
    adjustedTranslateY
  ];
};

export default onResize;
