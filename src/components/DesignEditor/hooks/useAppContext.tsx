import { AppContext } from "../contexts/AppContext"
import { useContext } from "react"

const useAppContext = () => {
  const {
    isMobile,
    setIsMobile,
    activePanel,
    setActivePanel,
    templates,
    setTemplates,
    shapes,
    setShapes,
    uploads,
    setUploads,
    currentTemplate,
    setCurrentTemplate,
    activeEffect,
    setActiveEffect
  } = useContext(AppContext)
  return {
    isMobile,
    setIsMobile,
    activePanel,
    setActivePanel,
    templates,
    setTemplates,
    shapes,
    setShapes,
    uploads,
    setUploads,
    currentTemplate,
    setCurrentTemplate,
    activeEffect,
    setActiveEffect
  }
}

export default useAppContext
