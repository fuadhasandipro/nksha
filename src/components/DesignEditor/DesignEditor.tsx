
import { useEffect, useState } from "react"
import Container from "./Container"
import GraphicEditor from "./GraphicEditor"
import Provider from "./Provider"
import Preview from "./components/Preview/Preview"
import useDesignEditorContext from "./hooks/useDesignEditorContext"
import MobileContainer from "./MobileContainer"
import MobileEditor from "./MobileEditor/MobileEditor"


const DesignEditor = ({ initialData }) => {
  const { displayPreview, setDisplayPreview } = useDesignEditorContext()


  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}

      <Provider>
        {isLargeScreen ? <Container>
          <GraphicEditor initialData={initialData} />
        </Container> : <MobileContainer>
          <MobileEditor initialData={initialData} />
        </MobileContainer>}
      </Provider>
    </>
  )
}

export default DesignEditor
