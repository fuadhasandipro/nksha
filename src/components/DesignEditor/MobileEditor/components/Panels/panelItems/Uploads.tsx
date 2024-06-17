import React, { useState } from "react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "@/components/DesignEditor/components/Icons/AngleDoubleLeft"
import Scrollable from "@/components/DesignEditor/components/Scrollable"
import { Button, SIZE } from "baseui/button"
import DropZone from "@/components/DesignEditor/components/Dropzone"
import { useEditor } from "@layerhub-io/react"
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen"
import { nanoid } from "nanoid"
import { captureFrame, loadVideoResource } from "@/components/DesignEditor/utils/video"
import { ILayer } from "@layerhub-io/types"
import { toBase64 } from "@/components/DesignEditor/utils/data"
import axios from "axios"
import Image from "next/image"
import { SpinnerIcon } from "@/components/icons/spinner-icon"


export default function () {
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = React.useState<any[]>([])
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const [loading, setIsLoading] = useState(false)

  const handleDropFiles = async (files: FileList) => {
    const file = files[0]

    const isVideo = file.type.includes("video")
    const base64 = (await toBase64(file)) as string

    const apiKey = '007aff46bb49446f04020287cfbcb445';
    const apiUrl = 'https://api.imgbb.com/1/upload';
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64);

    let preview
    setIsLoading(true)
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      preview = res.data.data.display_url
      setIsLoading(false)
    }).catch(e => {
      alert("Upload Error, Please try again later")
      setIsLoading(false)
    });


    if (isVideo) {
      const video = await loadVideoResource(base64)
      const frame = await captureFrame(video)
      preview = frame
    }

    const type = isVideo ? "StaticVideo" : "StaticImage"

    const upload = {
      id: nanoid(),
      src: preview,
      preview: preview,
      type: type,
    }

    setUploads([...uploads, upload])
  }

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!)
  }

  const addImageToCanvas = (props: Partial<ILayer>) => {
    editor.objects.add(props)
  }
  return (
    <DropZone handleDropFiles={handleDropFiles}>
      <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Block
          $style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            justifyContent: "space-between",
            padding: "1.5rem",
          }}
        >
          <Block>Uploads</Block>

          <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
            <AngleDoubleLeft size={18} />
          </Block>
        </Block>
        <Scrollable>
          <Block padding={"0 1.5rem"}>
            <Button
              onClick={handleInputFileRefClick}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              Upload from Device
            </Button>
            <div className="my-3">
              {loading && <SpinnerIcon className="h-auto w-5 animate-spin" />}
            </div>
            <input onChange={handleFileInput} type="file" id="file" ref={inputFileRef} style={{ display: "none" }} />
            {uploads.length == 0 && <div className="flex items-center flex-col text-center justify-center h-[80vh]">
              <Image alt="drop bg" src="https://i.ibb.co/3yWJrsY/drop-bg.png" width={150} height={150} className="pointer-events-none" />
              <p className="font-body mt-5">Choose a file or drag it here</p>
            </div>}
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    addImageToCanvas(upload)
                    setIsSidebarOpen(false)
                  }}
                >
                  <div>
                    <img width="100%" src={upload.preview ? upload.preview : upload.url} alt="preview" />
                  </div>
                </div>
              ))}
            </div>
          </Block>
        </Scrollable>
      </Block>
    </DropZone>
  )
}
