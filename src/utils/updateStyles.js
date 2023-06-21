const updateStyles = (
  newWidth,
  newHeight,
  adjustedTranslateX,
  adjustedTranslateY,
  ref
) => {
  ref.current.style.width = `${newWidth}px`;
  ref.current.style.height = `${newHeight}px`;
  ref.current.style.transform = `translate(${adjustedTranslateX}px, ${adjustedTranslateY}px)`;
};

export default updateStyles;
