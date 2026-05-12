export const TrashZone = () => {
  return (
    <div
      id="trash-zone"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 120,
        height: 120,
        background: "#ff6b6b",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold"
      }}
    >
      🗑 Trash
    </div>
  );
};