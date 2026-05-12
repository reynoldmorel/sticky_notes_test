# Sticky Notes Test

A React + TypeScript sticky note board demo with drag, resize, inline editing, and local persistence.

## What this project does

- Creates new notes on the board
- Moves notes by dragging them while holding the mouse
- Resizes notes using the resize handle
- Edits note text directly inside the textarea
- Persists note changes to `localStorage`
- Simulates an async API layer using `setTimeout` and promises
- Deletes notes by dragging them into the trash zone
- Keeps the active note on top via `zIndex`

## Core files

- `src/components/Board.tsx`
  - main board container
  - manages note state and persistence
  - handles note creation, movement, resizing, and deletion
  - loads notes from the simulated storage API

- `src/components/Note.tsx`
  - individual note rendering
  - uses `useDrag` and `useResize` hooks
  - updates note state and brings the note to front when clicked

- `src/components/TrashZone.tsx`
  - fixed trash drop target for deleting notes

- `src/hooks/useDrag.ts`
  - reusable drag helper
  - attaches global mouse listeners and throttles move updates

- `src/hooks/useResize.ts`
  - reusable resize helper for the note resize handle

- `src/services/localStorageApi.ts`
  - simulated async persistence layer on top of `localStorage`
  - exposes `loadNotes`, `createNote`, `updateNote`, and `deleteNote`

- `src/types/note.ts`
  - shared note shape used across components

## How persistence works

The app does not call a real backend. Instead, it simulates API behavior by:

1. reading/writing from `localStorage`
2. delaying operations with `setTimeout`
3. returning `Promise` objects for async behavior

That means note actions feel asynchronous while still being persisted locally.

## Running the project

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Open the browser at `http://localhost:3000`.

## Notes

- The app shows a loading state while notes are fetched from the simulated storage.
- Notes are positioned absolutely and can overlap, with the clicked note brought to the front.
- Resize and drag are implemented with custom hooks for reusable gesture handling.

# Code Review: SimpleCache (Kotlin)

See also: [simple_cache_code_review.md](simple_cache_code_review.md)