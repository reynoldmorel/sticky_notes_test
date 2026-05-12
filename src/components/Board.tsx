import { useEffect, useRef, useState } from "react";
import { Note } from "./Note";
import { TrashZone } from "./TrashZone";
import { Note as NoteType } from "../types/note";
import {
  loadNotes,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi
} from "../services/localStorageApi";

// Board is the main application container for sticky notes.
// It manages loading, creating, updating, moving, resizing, and deleting notes.
export const Board = () => {
  // notes: current list of sticky notes
  const [notes, setNotes] = useState<NoteType[]>([]);
  // isLoading: tracks whether notes are being loaded from the async storage layer
  const [isLoading, setIsLoading] = useState(true);
  // draggingNoteId: note currently being dragged, used for drop/delete behavior
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const draggingNoteIdRef = useRef<string | null>(null);

  // Keep a ref in sync with draggingNoteId to ensure the mouseup handler
  // sees the latest dragging note immediately.
  const handleSetDraggingNoteId = (id: string | null) => {
    draggingNoteIdRef.current = id;
    setDraggingNoteId(id);
  };

  // Create a new note locally and persist it via the simulated API.
  const createNote = async () => {
    const newNote: NoteType = {
      id: crypto.randomUUID(),
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      text: "",
      zIndex: notes.length,
    };

    setNotes((prev) => [...prev, newNote]);
    try {
      await createNoteApi(newNote);
    } catch (error) {
      console.error("Failed to persist created note:", error);
    }
  };

  // Update note fields locally and persist the change asynchronously.
  const updateNote = (id: string, updates: Partial<NoteType>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );

    updateNoteApi(id, updates).catch((error) => {
      console.error("Failed to persist note update:", error);
    });
  };

  // Move a note by a delta and persist the new position.
  const moveNote = (id: string, dx: number, dy: number) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n
      );
      const updated = next.find((n) => n.id === id);
      if (updated) {
        updateNoteApi(id, { x: updated.x, y: updated.y }).catch((error) => {
          console.error("Failed to persist note move:", error);
        });
      }
      return next;
    });
  };

  // Resize a note by a delta and persist the new dimensions.
  const resizeNote = (id: string, dw: number, dh: number) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id
          ? {
              ...n,
              width: Math.max(100, n.width + dw),
              height: Math.max(80, n.height + dh)
            }
          : n
      );
      const updated = next.find((n) => n.id === id);
      if (updated) {
        updateNoteApi(id, {
          width: updated.width,
          height: updated.height
        }).catch((error) => {
          console.error("Failed to persist note resize:", error);
        });
      }
      return next;
    });
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(0, ...notes.map((n) => n.zIndex));
    updateNote(id, { zIndex: maxZ + 1 });
  };

  // 🗑 Delete the currently dragged note if it is released over the trash zone.
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const currentDraggingNoteId = draggingNoteIdRef.current;
      if (!currentDraggingNoteId) return;

      const trash = document.getElementById("trash-zone");
      if (!trash) return;

      const rect = trash.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (inside) {
        setNotes((prev) => prev.filter((note) => note.id !== currentDraggingNoteId));
        deleteNoteApi(currentDraggingNoteId).catch((error) => {
          console.error("Failed to persist note deletion:", error);
        });
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // 💾 Load notes from the simulated async storage API on mount.
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const saved = await loadNotes();
        if (isMounted) {
          setNotes(saved);
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button
        onClick={createNote}
        style={{ position: "fixed", top: 20, left: 20 }}
        disabled={isLoading}
      >
        + New Note
      </button>

      {isLoading ? (
        <div style={{ padding: 20, fontWeight: "bold" }}>Loading notes…</div>
      ) : (
        notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            updateNote={updateNote}
            moveNote={moveNote}
            resizeNote={resizeNote}
            bringToFront={bringToFront}
            setDraggingNoteId={handleSetDraggingNoteId}
          />
        ))
      )}

      <TrashZone />
    </div>
  );
};