import React from "react";
import { useStyletron } from "baseui";
import { Block } from "baseui/block";
import AngleDoubleLeft from "@/components/DesignEditor/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/DesignEditor/components/Scrollable";
import { images } from "@/components/DesignEditor/constants/mock-data";
import { useEditor } from "@layerhub-io/react";

const ImagesPanel = ({ onBack }) => {
    const editor = useEditor();
    const [css] = useStyletron();

    const addObject = (url) => {
        if (editor) {
            const options = {
                type: "StaticImage",
                src: url,
            };
            editor.objects.add(options);
        }
    };

    return (
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
                <Block onClick={onBack} $style={{ cursor: "pointer", display: "flex" }}>
                    <AngleDoubleLeft size={18} />
                </Block>
                <Block>Images</Block>
            </Block>
            <Scrollable>
                <Block padding="0 1rem">
                    <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 1fr" }}>
                        {images.map((image, index) => (
                            <ImageItem key={index} onClick={() => addObject(image.src.large)} preview={image.src.small} />
                        ))}
                    </div>
                </Block>
            </Scrollable>
        </Block>
    );
};

export const ImageItem = ({ preview, onClick }) => {
    const [css] = useStyletron();
    return (
        <div
            onClick={onClick}
            className={css({
                position: "relative",
                background: "#f8f8fb",
                cursor: "pointer",
                borderRadius: "8px",
                overflow: "hidden",
                "::before:hover": {
                    opacity: 1,
                },
            })}
        >
            <div
                className={css({
                    backgroundImage: `linear-gradient(to bottom,
            rgba(0, 0, 0, 0) 0,
            rgba(0, 0, 0, 0.006) 8.1%,
            rgba(0, 0, 0, 0.022) 15.5%,
            rgba(0, 0, 0, 0.047) 22.5%,
            rgba(0, 0, 0, 0.079) 29%,
            rgba(0, 0, 0, 0.117) 35.3%,
            rgba(0, 0, 0, 0.158) 41.2%,
            rgba(0, 0, 0, 0.203) 47.1%,
            rgba(0, 0, 0, 0.247) 52.9%,
            rgba(0, 0, 0, 0.292) 58.8%,
            rgba(0, 0, 0, 0.333) 64.7%,
            rgba(0, 0, 0, 0.371) 71%,
            rgba(0, 0, 0, 0.403) 77.5%,
            rgba(0, 0, 0, 0.428) 84.
            rgba(0, 0, 0, 0.444) 91.9%,
            rgba(0, 0, 0, 0.45) 100%)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    transition: "opacity 0.3s ease-in-out",
                    height: "100%",
                    width: "100%",
                    ":hover": {
                        opacity: 1,
                    },
                })}
            />
            <img
                src={preview}
                className={css({
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    verticalAlign: "middle",
                })}
            />
        </div>
    );
};

export default ImagesPanel;
