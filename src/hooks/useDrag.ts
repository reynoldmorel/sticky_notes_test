import { useRef } from "react";

// useDrag provides a reusable drag gesture helper with optional
// start/end callbacks and requestAnimationFrame throttling.
export const useDrag = (onMove: (dx: number, dy: number) => void, onStart?: () => void, onEnd?: () => void) => {
  const frame = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onStart?.();

    let startX = e.clientX;
    let startY = e.clientY;

    // Attach global listeners so dragging continues outside the note
    // element while the mouse button is held down.

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        startX = moveEvent.clientX;
        startY = moveEvent.clientY;

        onMove(dx, dy);
      });
    };

    const onMouseUp = () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      onEnd?.();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return { onMouseDown: handleMouseDown };
};
