import React, { useState, useEffect } from "react";
import { useStyletron } from "baseui";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import ClipLoader from "react-spinners/ClipLoader";
import AngleDoubleLeft from "@/components/DesignEditor/components/Icons/AngleDoubleLeft";
import Scrollable from "@/components/DesignEditor/components/Scrollable";
import { useEditor } from "@layerhub-io/react";


const GraphicsPanel = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [imagesSmall, setImagesSmall] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [searchButtonClicked, setSearchButtonClicked] = useState(false);

    const editor = useEditor();
    const [css] = useStyletron();

    const fetchImagesByPage = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://noksha-assets.vercel.app/api/fetch-pngs?search=${searchTerm}&page=${page}`
            );
            const htmlString = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");

            const listItemElements = doc.querySelectorAll(".ez-resource-grid__item");
            const imgElements = [];
            const imgElementsSmall = [];

            listItemElements.forEach((item) => {
                const img = item.querySelector("img");
                if (img) {
                    const originalSrc = img.src.replace("/small/", "/large/");
                    imgElements.push(originalSrc);
                    imgElementsSmall.push(img.src);
                }
            });

            if (page === 1) {
                setImages(imgElements);
                setImagesSmall(imgElementsSmall);
            } else {
                setImages((prevImages) => [...prevImages, ...imgElements]);
                setImagesSmall((prevImagesSmall) => [...prevImagesSmall, ...imgElementsSmall]);
            }

            const nextPageExists = doc.querySelector(
                ".search-results__footer-pagination__next-button"
            );
            setHasMorePages(nextPageExists !== null);

            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching or parsing HTML content:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreImages = () => {
        const nextPage = currentPage + 1;
        fetchImagesByPage(nextPage);
    };

    const handleSearch = () => {
        if (searchTerm.trim().length >= 2) {
            setSearchButtonClicked(true);
            fetchImagesByPage(1);
        }
    };

    const addObject = (url) => {
        if (editor) {
            const options = {
                type: "StaticImage",
                // type: "StaticVector",
                src: url,
            };
            editor.objects.add(options);
        }
    };

    useEffect(() => {
        if (searchButtonClicked && searchTerm.trim().length >= 2) {
            fetchImagesByPage(1);
            setSearchButtonClicked(false); // Reset search button click state
        }
    }, [searchButtonClicked, searchTerm]);

    return (
        <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Block
                $style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                    justifyContent: "space-between",
                    padding: "1.5rem",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 10,
                }}
            >
                <Block onClick={onBack} $style={{ cursor: "pointer", display: "flex" }}>
                    <AngleDoubleLeft size={18} />
                </Block>
                <Block>Extracted Images</Block>
            </Block>
            <Block
                padding="1.5rem"
                $style={{
                    position: "sticky",
                    top: "3rem",
                    backgroundColor: "#fff",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Enter search term (min. 2 characters)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={css({
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    })}
                />
                <Button
                    onClick={handleSearch}
                    disabled={loading || searchTerm.trim().length < 2}
                    overrides={{ BaseButton: { style: { marginLeft: "1rem" } } }}
                >
                    Search
                </Button>
            </Block>
            {loading && (
                <Block className="spinner-container">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </Block>
            )}
            <Scrollable>
                <Block
                    padding="1rem"
                    $style={{
                        display: "grid",
                        gap: "8px",
                        gridTemplateColumns: "1fr 1fr",
                    }}
                >
                    {imagesSmall.map((src, index) => (
                        <GraphicItem
                            key={index}
                            preview={src}
                            onClick={() => addObject(images[index])}
                            searchTerm={searchTerm}
                        />
                    ))}
                </Block>

                {hasMorePages && (
                    <Block
                        padding="1rem"
                        $style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button onClick={loadMoreImages} disabled={loading}>
                            Load More
                        </Button>
                    </Block>
                )}
            </Scrollable>
        </Block>
    );
};

export default GraphicsPanel;



export const GraphicItem = ({ preview, onClick, searchTerm }) => {
    const [css] = useStyletron();

    return (
        <div
            onClick={onClick}
            className={css({
                position: "relative",
                height: "84px",
                background: "#f8f8fb",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                width: "auto",
                overflow: "hidden",
            })}
        >
            <img
                src={preview}
                className={css({
                    width: "auto",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    verticalAlign: "middle",
                })}
            />
        </div>
    );
};

