
import Navbar from "./components/Navbar"
import Panels from "./components/Panels"
import Canvas from "./components/Canvas"
import Footer from "./components/Footer"
import Toolbox from "./components/Toolbox"
import EditorContainer from "./components/EditorContainer"

const GraphicEditor = ({ isLargeScreen }) => {

  return (
    <EditorContainer>
      <Navbar isLargeScreen={isLargeScreen} />
      <div style={{ display: "flex", flex: 1 }}>
        <Panels />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          <Toolbox />
          <Canvas />
          <Footer isLargeScreen={isLargeScreen} />
        </div>
      </div>
    </EditorContainer>

  )
}

export default GraphicEditor
