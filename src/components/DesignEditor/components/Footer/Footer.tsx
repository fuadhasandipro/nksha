import Graphic from "./Graphic"
import Presentation from "./Presentation"
import Video from "./Video"
import useEditorType from "../../hooks/useEditorType"

const Footer = ({ isLargeScreen }) => {
  const editorType = useEditorType()

  return {
    NONE: <></>,
    PRESENTATION: <Presentation />,
    VIDEO: <Video />,
    GRAPHIC: <Graphic isLargeScreen={isLargeScreen} />,
  }[editorType]
}

export default Footer
