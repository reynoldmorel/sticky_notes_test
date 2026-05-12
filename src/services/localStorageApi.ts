import { Note } from "../types/note";

// Simulated async local storage API for note persistence.
const STORAGE_KEY = "notes";
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredNotes = (): Note[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const setStoredNotes = (notes: Note[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const loadNotes = async (): Promise<Note[]> => {
  await simulateDelay(300);
  return getStoredNotes();
};

export const saveNotes = async (notes: Note[]): Promise<void> => {
  await simulateDelay(200);
  setStoredNotes(notes);
};

export const createNote = async (note: Note): Promise<Note> => {
  await simulateDelay(300);
  const notes = getStoredNotes();
  const next = [...notes, note];
  setStoredNotes(next);
  return note;
};

export const updateNote = async (
  id: string,
  updates: Partial<Note>
): Promise<Note> => {
  await simulateDelay(250);
  const notes = getStoredNotes();
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) {
    throw new Error("Note not found");
  }

  const updatedNote = { ...notes[index], ...updates };
  notes[index] = updatedNote;
  setStoredNotes(notes);
  return updatedNote;
};

export const deleteNote = async (id: string): Promise<string> => {
  await simulateDelay(250);
  const notes = getStoredNotes();
  const next = notes.filter((note) => note.id !== id);
  setStoredNotes(next);
  return id;
};
