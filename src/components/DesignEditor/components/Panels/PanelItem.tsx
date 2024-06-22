import React from "react"
import panelItems from "./panelItems"

import { Block } from "baseui/block"
import useAppContext from "../../hooks/useAppContext"
import useIsSidebarOpen from "../../hooks/useIsSidebarOpen"

interface State {
  panel: string
}
const PanelsList = () => {
  const [state, setState] = React.useState<State>({ panel: "Text" })
  const isSidebarOpen = useIsSidebarOpen()
  const { activePanel } = useAppContext()

  React.useEffect(() => {
    setState({ panel: activePanel })
  }, [activePanel])


  // @ts-ignore
  const Component = panelItems[state.panel]

  return (
    <Block
      id="EditorPanelItem"
      $style={{
        background: "#ffffff",
        width: isSidebarOpen ? "306px" : 0,
        flex: "none",
        borderRight: "1px solid #d7d8e3",
        display: "flex",
        transition: "ease width 0.1s",
        overflow: "hidden",
      }}
    >
      {Component && <Component />}
    </Block>
  )
}

export default PanelsList
