export const useResize = (onResize: (dw: number, dh: number) => void, onStart?: () => void) => {
  // useResize provides a reusable resize gesture helper for the note corner.
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart?.();

    let startX = e.clientX;
    let startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dw = moveEvent.clientX - startX;
      const dh = moveEvent.clientY - startY;

      startX = moveEvent.clientX;
      startY = moveEvent.clientY;

      onResize(dw, dh);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return { onMouseDown: handleMouseDown };
};