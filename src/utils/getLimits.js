const getLimits = (e, parent) => {
    const newX = Math.max(e.left, 0);
    const newY = Math.max(e.top, 0);
    const containerWidth = parent?.clientWidth;
    const containerHeight = parent?.clientHeight;
    const maxX = containerWidth - e.width;
    const maxY = containerHeight - e.height;
    const finalX = Math.min(newX, maxX);
    const finalY = Math.min(newY, maxY);
    return [finalX, finalY];
  };
export default getLimits;