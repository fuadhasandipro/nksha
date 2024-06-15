import React from "react"
import { Block } from "baseui/block"
import Scrollable from "@/components/DesignEditor/components/Scrollable"
import { HexColorInput, HexColorPicker } from "react-colorful"
import { Delete } from "baseui/icon"
import { throttle } from "lodash"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen"

const PRESET_COLORS = [
  "#f44336",
  "#ff9800",
  "#ffee58",
  "#66bb6a",
  "#26a69a",
  "#03a9f4",
  "#3f51b5",
  "#673ab7",
  "#9c27b0",
  "#ec407a",
  "#8d6e63",
  "#d9d9d9",
]

const TextFill = () => {
  const [color, setColor] = React.useState("#000")
  const activeObject = useActiveObject()
  const editor = useEditor()

  const updateObjectFill = throttle((color: string) => {
    if (activeObject) {
      editor.objects.update({ fill: color })
    }

    setColor(color)
  }, 100)

  const setIsSidebarOpen = useSetIsSidebarOpen()

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Text Fill</Block>

        <Block $style={{ cursor: "pointer", display: "flex" }} onClick={() => {
          setIsSidebarOpen(false)
        }}>
          <Delete size={24} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding="0 1.5rem">
          <HexColorPicker onChange={updateObjectFill} color={color} style={{ width: "100%" }} />
          <p className="text-xs text-left my-3">Hex Code</p>
          <HexColorInput onChange={updateObjectFill} color={color} placeholder="Type a color" prefixed alpha style={{ display: "block", border: "1px solid #000", background: "#ddd" }} />

          <Block>
            <Block $style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "14px" }}>Preset colors</Block>
            <Block $style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: "0.25rem" }}>
              {PRESET_COLORS.map((color, index) => (
                <Block
                  $style={{
                    cursor: "pointer",
                  }}
                  onClick={() => updateObjectFill(color)}
                  backgroundColor={color}
                  height="38px"
                  key={index}
                />
              ))}
            </Block>
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}

export default TextFill
