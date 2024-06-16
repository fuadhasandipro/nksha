import { useStyletron, styled } from "baseui"
import { BASE_MOBILE_ITEMS } from "@/components/DesignEditor/constants/app-options"

import Icons from "@/components/DesignEditor/components/Icons"
import { useTranslation } from "react-i18next"

import useEditorType from "@/components/DesignEditor/hooks/useEditorType"
import Scrollable from "@/components/DesignEditor/components/Scrollable"
import { Block } from "baseui/block"

import useAppContext from "@/components/DesignEditor/hooks/useAppContext"
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen"

import PanelItem from './PanelItem'


const PanelsList = () => {
  const { activePanel } = useAppContext()
  const { t } = useTranslation("editor")

  return (
    <>
      <div className="flex gap-x-3 overflow-scroll ">

        {BASE_MOBILE_ITEMS.map((panelListItem) => (
          <PanelListItem
            label={t(`panels.panelsList.${panelListItem.id}`)}
            name={panelListItem.name}
            key={panelListItem.name}
            icon={panelListItem.name}
            activePanel={activePanel}
          />
        ))}

      </div>

    </>
  )
}

const PanelListItem = ({ label, icon, activePanel, name }: any) => {
  const { setActivePanel } = useAppContext()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  // @ts-ignore
  const Icon = Icons[icon]
  return (
    <Block
      id="EditorPanelList"
      onClick={() => {
        setIsSidebarOpen(true)
        setActivePanel(name)
      }}
      $style={{
        width: "60px",
        height: "60px",
        // backgroundColor: name === activePanel ? "#252627" : "#18191b",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "Uber Move Text",
        fontWeight: 500,
        fontSize: "0.8rem",
        userSelect: "none",
        transition: "all 0.5s",
        gap: "0.1rem",
        ":hover": {
          cursor: "pointer",
          backgroundColor: "#cdcdcd",
          transition: "all 0.2s ease"
        },
      }}
    >
      <Icon size={24} />
      <div>{label}</div>
    </Block>
  )
}

export default PanelsList
