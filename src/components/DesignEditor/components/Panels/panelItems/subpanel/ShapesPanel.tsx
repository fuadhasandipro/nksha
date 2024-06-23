import React, { useState } from "react";
import { useEditor } from "@layerhub-io/react";
import { useStyletron } from "baseui";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import AngleDoubleLeft from "@/components/DesignEditor/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/DesignEditor/components/Scrollable";
import { graphics } from "@/components/DesignEditor/constants/mock-data"; // Assuming mock data for shapes
import useSetIsSidebarOpen from "@/components/DesignEditor/hooks/useSetIsSidebarOpen";

const ShapesPanel = ({ onBack }) => {
    const [filteredShapes, setFilteredShapes] = useState(graphics); // State to hold filtered shapes
    const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
    const editor = useEditor();
    const setIsSidebarOpen = useSetIsSidebarOpen();
    const [css] = useStyletron();

    const addObject = React.useCallback(
        (item) => {
            if (editor) {
                editor.objects.add(item);
            }
        },
        [editor]
    );

    // Function to handle search input change
    const handleSearchChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        // Filter shapes based on search term
        const filtered = graphics.filter((shape) =>
            shape.id.toLowerCase().includes(value)
        );
        setFilteredShapes(filtered);
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
                <Block>Shapes</Block>
            </Block>
            <Scrollable>
                <Block padding="0 1.5rem">
                    {/* Search box */}
                    <Block marginBottom="16px">
                        <input
                            type="text"
                            placeholder="Search shapes..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={css({
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                            })}
                        />
                    </Block>

                    <Block>
                        {/* Display filtered shapes */}
                        <Block
                            $style={{
                                display: "grid",
                                gap: "8px",
                                padding: "0",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                            }}
                        >
                            {filteredShapes.map((shape, index) => (
                                <ShapeItem
                                    onClick={() => addObject(shape)}
                                    key={index}
                                    preview={shape.preview}
                                />
                            ))}
                        </Block>
                    </Block>
                </Block>
            </Scrollable>
        </Block>
    );
};

export const ShapeItem = ({ preview, onClick }) => {
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
                ":hover": {
                    opacity: 1,
                    background: "rgb(233,233,233)",
                },
            })}
        >
            <img
                src={preview}
                className={css({
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    verticalAlign: "middle",
                })}
                alt="Shape Preview"
            />
        </div>
    );
};

export default ShapesPanel;
