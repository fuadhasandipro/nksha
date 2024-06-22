import React, { useEffect, useState } from "react"
import { Block } from "baseui/block"
import Scrollable from "@/components/DesignEditor/components/Scrollable"
import { Delete } from "baseui/icon"
import { debounce } from "lodash"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { TEXT_EFFECTS } from "@/components/DesignEditor/constants/design-editor"
import Outline from "./Common/Outline"
import Shadow from "./Common/Shadow"
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen"
import useAppContext from "@/components/DesignEditor/hooks/useAppContext"
import { getTextProperties } from "@/components/DesignEditor/utils/text"
import { EFFECTS, SAMPLE_FONTS } from "@/components/DesignEditor/constants/editor"
import { IStaticText } from "@layerhub-io/types"
import Gradient from "./Common/Gradient"

export interface TextState {
  stroke: string;
  strokeWidth: number;
  shadow: {
    blur: number;
    color: string;
    offsetX: number;
    offsetY: number;
    enabled: boolean;
  }
}

const initialOptions: TextState = {
  stroke: "#000",
  strokeWidth: 0,
  shadow: {
    blur: 0,
    color: "#afafaf",
    offsetX: 10,
    offsetY: 10,
    enabled: false,
  },
};

const TextEffects = () => {
  const [color, setColor] = React.useState("#b32aa9")
  const activeObject = useActiveObject() as Required<IStaticText>;
  const editor = useEditor()
  const [activeEffect, setActiveEffect] = useState("None");

  const setIsSidebarOpen = useSetIsSidebarOpen()

  const [state, setState] = React.useState<TextState>(initialOptions);

  React.useEffect(() => {
    if (activeObject && activeObject.type === 'StaticText') {
      const textProperties = getTextProperties(activeObject, SAMPLE_FONTS);
      setState({ ...state, ...textProperties });
    }
  }, [activeObject]);

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject && activeObject.type === 'StaticText') {
        const textProperties = getTextProperties(activeObject, SAMPLE_FONTS);
        setState({ ...state, ...textProperties });
      }
    };
    if (editor) {
      editor.on('history:changed', watcher);
    }
    return () => {
      if (editor) {
        editor.off('history:changed', watcher);
      }
    };
  }, [editor, activeObject]);


  // const updateObjectFill = debounce((color: string) => {
  //   if (activeObject) {
  //     editor.objects.update({ fill: color })
  //   }

  //   setColor(color)
  // }, 100)

  const applyEffect = (name: string) => {
    if (editor) {
      //  @ts-ignore
      const effect = EFFECTS[name]
      if (activeObject) {
        editor.objects.update(effect)
        setActiveEffect(name);
      }
    }
  }


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
        <Block>Effects</Block>
        <Block $style={{ cursor: "pointer", display: "flex" }} onClick={() => {
          setIsSidebarOpen(false)
        }}>
          <Delete size={24} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding="0 1.5rem">
          <Block $style={{ display: "grid", gridTemplateColumns: "80px 80px 80px", gap: "0.5rem" }}>
            {TEXT_EFFECTS.map((effect, index) => {
              return (
                <Block style={{ cursor: "pointer" }} key={index}>
                  <Block
                    onClick={() => {
                      applyEffect(effect.name)
                      setActiveEffect(effect.name)
                    }}
                    $style={{
                      border: "1px solid #afafaf",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "80px",
                    }}
                  >
                    <img style={{ width: "70px" }} src={effect.preview} />
                  </Block>
                  <Block
                    $style={{
                      textAlign: "center",
                      padding: "0.5rem",
                      fontSize: "14px",
                    }}
                  >
                    {effect.name}
                  </Block>
                </Block>
              )
            })}
          </Block>
          <Block>
            <Outline state={state} />
            <Shadow state={state} />
            {/* <Gradient /> */}
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}

export default TextEffects
