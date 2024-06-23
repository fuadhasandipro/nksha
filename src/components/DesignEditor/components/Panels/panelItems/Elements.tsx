import React, { useState } from "react";
import { useEditor } from "@layerhub-io/react";
import { useStyletron } from "baseui";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import AngleDoubleLeft from "@/components/DesignEditor/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/DesignEditor/components/Scrollable";
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen";
import ShapesPanel, { ShapeItem } from "./subpanel/ShapesPanel";
import GraphicsPanel, { GraphicItem } from "./subpanel/GraphicsPanel";
import ImagesPanel, { ImageItem } from "./subpanel/ImagesPanel";
import { graphics, images, vectors } from "@/components/DesignEditor/constants/mock-data";

// import IconsPanel from "./subpanel/IconsPanel";

const Elements = () => {
  const [activePanel, setActivePanel] = useState(null); // To manage sub-panel state
  const editor = useEditor();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const [css] = useStyletron();

  const openSubPanel = (panel) => setActivePanel(panel);
  const closeSubPanel = () => setActivePanel(null);

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column", }}>
      {activePanel ? (
        // Render the active sub-panel
        <SubPanel
          panel={activePanel}
          closeSubPanel={closeSubPanel}
          editor={editor}
        />
      ) : (
        // Render the main elements panel
        <>
          <Block
            $style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              justifyContent: "space-between",
              padding: "1.5rem",
              color: "#000"
            }}
          >
            <Block>Elements</Block>
            <Block
              onClick={() => setIsSidebarOpen(false)}
              $style={{ cursor: "pointer", display: "flex" }}
            >
              <AngleDoubleLeft size={18} />
            </Block>
          </Block>
          <Scrollable>
            <Block $style={{ padding: "1.5rem", color: "#252525" }}>
              <CategoryPreview
                title="Shapes"
                items={graphics.slice(0, 8)} // Displaying a few preview items
                onClick={() => openSubPanel("Shapes")}
              />
              <CategoryPreview
                title="Graphics"
                items={vectors.slice(0, 6)} // Displaying a few preview items
                onClick={() => openSubPanel("Graphics")}
              />
              <CategoryPreview
                title="Images"
                items={images.slice(0, 6)} // Displaying a few preview items
                onClick={() => openSubPanel("Images")}
              />
              {/* <CategoryPreview
                title="Icons"
                items={icons.slice(0, 4)} // Displaying a few preview items
                onClick={() => openSubPanel("Icons")}
              /> */}
            </Block>
          </Scrollable>
        </>
      )}
    </Block>
  );
};

// Category Preview Component
const CategoryPreview = ({ title, items, onClick }) => {
  const [css] = useStyletron();
  const editor = useEditor()

  return (
    <Block $style={{ marginBottom: "16px" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Block $style={{ fontWeight: "bold" }}>{title}</Block>
        <Button
          onClick={onClick}
          size={SIZE.mini}
          overrides={{
            Root: {
              style: {
                alignSelf: "flex-start",
                paddingLeft: "8px",
                paddingRight: "8px",
              },
            },
          }}
        >
          See All
        </Button>
      </Block>
      <hr className="mt-2 mb-6" />

      {title == "Shapes" && <Block
        $style={{
          display: "grid",
          gap: "8px",
          padding: "0",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
        }}
      >
        {items.map((shape, index) => (
          <ShapeItem
            onClick={() => {
              if (editor) {
                editor.objects.add(shape);
              }
            }}
            key={index}
            preview={shape.preview}
          />
        ))}
      </Block>}

      {/* {title == "Graphics" && <Block padding="0" $style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {items.map((vector, index) => (
          <GraphicItem key={index} onClick={() => {
            if (editor) {
              const options = {
                type: "StaticVector",
                src: vector,
              };
              editor.objects.add(options);
            }
          }} preview={vector} />
        ))}
      </Block>} */}

      {title == "Images" && <Block padding="0">
        <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {items.map((image, index) => {
            return <ImageItem key={index} onClick={() => {
              if (editor) {
                const options = {
                  type: "StaticImage",
                  src: image.src.large,
                };
                editor.objects.add(options);
              }
            }} preview={image.src.small} />
          })}
        </div>
      </Block>}


    </Block>
  );
};

// Preview Item Component
const PreviewItem = ({ preview, onClick }) => {
  const [css] = useStyletron();

  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        borderRadius: "4px",
        overflow: "hidden",
        cursor: "pointer",
        ":hover": {
          opacity: 0.8,
        },
      })}
    >
      <img
        src={preview}
        className={css({
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "cover",
        })}
        alt="Preview"
      />
    </div>
  );
};

// SubPanel Component to handle different panels
const SubPanel = ({ panel, closeSubPanel, editor }) => {
  switch (panel) {
    case "Shapes":
      return <ShapesPanel onBack={closeSubPanel} editor={editor} />;
    case "Graphics":
      return <GraphicsPanel onBack={closeSubPanel} editor={editor} />;
    case "Images":
      return <ImagesPanel onBack={closeSubPanel} editor={editor} />;
    case "Icons":
      return <IconsPanel onBack={closeSubPanel} editor={editor} />;
    default:
      return null;
  }
};

export default Elements;
