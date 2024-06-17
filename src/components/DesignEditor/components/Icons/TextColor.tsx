function TextColor({ size, color = "#000000" }: { size: number; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      <div
        style={{
          background: color,
          borderRadius: "4px",
          border: "1px solid #d1d1d3",
          height: "28px",
          width: "28px",
          cursor: "pointer",
        }}
      />
    </div>
  )
}

export default TextColor
