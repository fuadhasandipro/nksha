import { PanelType } from "../constants/app-options"
import React, { createContext, useState } from "react"

type Template = any
interface IAppContext {
  isMobile: boolean | undefined
  setIsMobile: React.Dispatch<React.SetStateAction<boolean | undefined>>
  templates: Template[]
  setTemplates: (templates: Template[]) => void
  uploads: any[]
  setUploads: (templates: any[]) => void
  shapes: any[]
  setShapes: (templates: any[]) => void
  activePanel: PanelType
  setActivePanel: (option: PanelType) => void
  activeSubMenu: string | null
  setActiveSubMenu: (option: string | null) => void
  currentTemplate: any
  setCurrentTemplate: any
  activeEffect: string
  setActiveEffect: (value: string) => void
}

export const AppContext = createContext<IAppContext>({
  isMobile: false,
  setIsMobile: () => { },
  templates: [],
  setTemplates: () => { },
  uploads: [],
  setUploads: () => { },
  shapes: [],
  setShapes: () => { },
  activePanel: PanelType.TEMPLATES,
  setActivePanel: () => { },
  activeSubMenu: null,
  setActiveSubMenu: (value: string | null) => { },
  currentTemplate: {},
  setCurrentTemplate: {},
  activeEffect: "",
  setActiveEffect: (value: string) => { }
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [templates, setTemplates] = useState<Template[]>([])
  const [uploads, setUploads] = useState<any[]>([])
  const [shapes, setShapes] = useState<Template[]>([])
  const [activePanel, setActivePanel] = useState<PanelType>(PanelType.TEMPLATES)
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [activeEffect, setActiveEffect] = useState("")
  const context = {
    isMobile,
    setIsMobile,
    templates,
    setTemplates,
    activePanel,
    setActivePanel,
    shapes,
    setShapes,
    activeSubMenu,
    setActiveSubMenu,
    uploads,
    setUploads,
    currentTemplate,
    setCurrentTemplate,
    activeEffect,
    setActiveEffect
  }
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}
