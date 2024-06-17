import Footer from "../components/Footer"
import Panels from "./components/Panels"
import Canvas from "../components/Canvas"
import Navbar from "../components/Navbar"

import Toolbox from "./components/Toolbox";


const MobileEditor = ({ isLargeScreen }) => {
    return (
        <>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", width: "100%", height: "100vh", overflow: "auto" }}>
                <Navbar isLargeScreen={isLargeScreen} />
                <Toolbox />
                <Canvas />
                <Panels />
                <div className="">
                    <Footer isLargeScreen={isLargeScreen} />
                </div>
            </div>
        </>


    )
}

export default MobileEditor
