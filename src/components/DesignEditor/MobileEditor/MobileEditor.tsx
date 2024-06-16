



import Footer from "../components/Footer"
import Toolbox from "../components/Toolbox"
import EditorContainer from "../components/EditorContainer"
import Panels from "./components/Panels"
import Provider from "../Provider"
import Container from "../Container"
import Canvas from "../components/Canvas"
import MobileContainer from "../MobileContainer"
import Navbar from "../components/Navbar"

const MobileEditor = ({ isLargeScreen }) => {

    return (
        // <EditorContainer>

        //     <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        //         {/* <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        //             <Toolbox />
        //             <Canvas />
        //             <Footer />
        //         </div> */}
        //     </div>
        // </EditorContainer>



        <>
            <Navbar isLargeScreen={isLargeScreen} />
            <Panels />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", width: "100%", height: "80vh" }}>
                <Canvas />
                <Toolbox />
                <Footer />
            </div>
        </>


    )
}

export default MobileEditor
