import { useState } from "react";
import { Note as NoteType } from "../types/note";
import { useDrag } from "../hooks/useDrag";
import { useResize } from "../hooks/useResize";

interface Props {
  note: NoteType;
  updateNote: (id: string, updates: Partial<NoteType>) => void;
  moveNote: (id: string, dx: number, dy: number) => void;
  resizeNote: (id: string, dw: number, dh: number) => void;
  bringToFront: (id: string) => void;
  setDraggingNoteId: (id: string | null) => void;
}

// Each Note renders a draggable, resizable sticky note with editable text.
export const Note = ({ note, updateNote, moveNote, resizeNote, bringToFront, setDraggingNoteId }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  // Setup drag behavior using the shared hook. onStart and onEnd
  // keep the dragging state in sync with the board.
  const drag = useDrag(
    (dx, dy) => moveNote(note.id, dx, dy),
    () => {
      setDraggingNoteId(note.id);
      setIsDragging(true);
    },
    () => {
      setDraggingNoteId(null);
      setIsDragging(false);
    }
  );

  // Setup resize behavior for the bottom-right handle.
  const resize = useResize((dw, dh) => {
    resizeNote(note.id, dw, dh);
  }, () => bringToFront(note.id));

  return (
    <div
      onMouseDown={(e) => {
        bringToFront(note.id);
        drag.onMouseDown(e);
      }}
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        background: "#fff9a8",
        borderRadius: 8,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        padding: 10,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: note.zIndex,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <textarea
        value={note.text}
        onChange={(e) =>
          updateNote(note.id, { text: e.target.value })
        }
        onMouseDown={(e) => {
          e.stopPropagation();
          bringToFront(note.id);
        }}
        style={{
          flex: 1,
          border: "none",
          background: "transparent",
          resize: "none",
          outline: "none"
        }}
      />


      <div
        onMouseDown={resize.onMouseDown}
        style={{
          width: 12,
          height: 12,
          background: "#ccc",
          alignSelf: "flex-end",
          cursor: "nwse-resize"
        }}
      />
    </div>
  );
};