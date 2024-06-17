
import { BASE_MOBILE_ITEMS } from "@/components/DesignEditor/constants/app-options"

import Icons from "@/components/DesignEditor/components/Icons"
import { useTranslation } from "react-i18next"
import { Block } from "baseui/block"

import useAppContext from "@/components/DesignEditor/hooks/useAppContext"
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen"



const PanelsList = () => {
  const { activePanel } = useAppContext()
  const { t } = useTranslation("editor")

  return (
    <>
      <div className="flex gap-x-6 overflow-scroll bg-white px-3">

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
        backgroundColor: name === activePanel ? "#fff" : "#fff",
        color: "#4b4b4b",
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
          backgroundColor: "#ffffff",
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
