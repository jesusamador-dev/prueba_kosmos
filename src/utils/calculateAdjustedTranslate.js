const calculateAdjustedTranslate = (
  beforeTranslate,
  newWidth,
  newHeight,
  e
) => {
  const translateX = beforeTranslate[0];
  const translateY = beforeTranslate[1];

  const adjustedTranslateX =
    translateX > 0 ? Math.min(translateX, newWidth - e.width) : translateX;
  const adjustedTranslateY =
    translateY > 0 ? Math.min(translateY, newHeight - e.height) : translateY;

  return { adjustedTranslateX, adjustedTranslateY };
};
export default calculateAdjustedTranslate;
