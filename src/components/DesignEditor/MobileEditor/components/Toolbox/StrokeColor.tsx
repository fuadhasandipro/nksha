import React from "react"
import { Block } from "baseui/block"
import { HexColorInput, HexColorPicker } from "react-colorful"
import Common from "./Common"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { groupBy } from "lodash"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import Flip from "./Shared/Flip"
import useAppContext from "../../hooks/useAppContext"
import { StatefulTooltip } from "baseui/tooltip"

const StrokeColor = ({ stroke }) => {
    const [color, setColor] = React.useState("#000")
    const activeObject = useActiveObject() as any
    const editor = useEditor()


    React.useEffect(() => {
        if (activeObject && activeObject.type === "StaticText") {
            setColor(activeObject.stroke);
        }
    }, [activeObject, stroke])


    // React.useEffect(() => {
    //     if (activeObject && activeObject.type === "StaticText") {
    //         setColor(stroke);
    //     }
    // }, [stroke])

    const changeBackgroundColor = (Yocolor: string) => {
        editor.objects.update({ stroke: Yocolor });
        setColor(Yocolor)
    }

    return (
        <Block
            $style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                justifyContent: "space-between",
            }}
        >
            <Block>
                <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <StatefulPopover
                            placement={PLACEMENT.bottomLeft}
                            content={
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "#ffffff",
                                        width: "200px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1rem",
                                        textAlign: "center",
                                    }}
                                >
                                    <HexColorPicker
                                        onChange={(color) => {
                                            changeBackgroundColor(color)
                                        }}
                                        color={color}
                                    />
                                    <p className="text-xs text-left ">Hex Code</p>
                                    <HexColorInput onChange={(color) => {
                                        changeBackgroundColor(color)
                                    }} color={color} style={{ border: "1px solid #000", background: "#ddd" }} placeholder="Enter Color" />

                                </div>
                            }
                            accessibilityType="tooltip"
                        >
                            <div>
                                <StatefulTooltip
                                    placement={PLACEMENT.rightTop}
                                    showArrow={true}
                                    accessibilityType="tooltip"
                                    content="Stroke Color"
                                >
                                    <div
                                        style={{
                                            height: "24px",
                                            width: "24px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            backgroundColor: color,
                                            border: "1px solid #dedede",
                                        }}
                                    />
                                </StatefulTooltip>

                            </div>
                        </StatefulPopover>
                    </Block>
                </Block>
            </Block>
        </Block>
    )
}

export default StrokeColor
