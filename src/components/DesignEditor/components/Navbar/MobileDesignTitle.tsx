import React from "react"
import { Input } from "baseui/input"
import { Block } from "baseui/block"
import CloudCheck from "@/components/DesignEditor/components/Icons/CloudCheck"
import { StatefulTooltip } from "baseui/tooltip"
import useDesignEditorContext from "@/components/DesignEditor/hooks/useDesignEditorContext"

interface State {
    name: string
}

const MobileDesignTitle = () => {
    const { currentDesign, setCurrentDesign } = useDesignEditorContext()
    const [state, setState] = React.useState<State>({ name: currentDesign?.name || "My First Design" })
    const inputTitleRef = React.useRef<Input>(null)
    const spanRef = React.useRef<HTMLDivElement | null>(null)

    const handleInputChange = (name: string) => {
        setState({ ...state, name: name })
        setCurrentDesign({ ...currentDesign, name })
    }

    React.useEffect(() => {
        const name = currentDesign.name
        if (name || name === "") {

            setState({ ...state, name: name })
        }
    }, [currentDesign.name])

    React.useEffect(() => {
        setState({ ...state })
    }, [state.name])

    return (
        <Block
            $style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                opacity: 1,
            }}
        >
            <Block width={`auto`} display="flex">
                <Input
                    onChange={(e: any) => handleInputChange(e.target.value)}
                    overrides={{
                        Root: {
                            style: {
                                backgroundColor: "transparent",
                                borderTopStyle: "none",
                                borderBottomStyle: "none",
                                borderRightStyle: "none",
                                borderLeftStyle: "none",
                            },
                        },
                        InputContainer: {
                            style: {
                                backgroundColor: "transparent",
                                paddingRight: 0,
                            },
                        },
                        Input: {
                            style: {
                                fontWeight: 500,
                                fontSize: "14px",
                                width: `${state.width}px`,
                                fontFamily: "Uber Move Text",
                                backgroundColor: "transparent",
                                color: "#ffffff",
                                paddingRight: 0,
                            },
                        },
                    }}
                    value={state.name}
                    ref={inputTitleRef}
                />
            </Block>


            <StatefulTooltip
                showArrow={true}
                overrides={{
                    Inner: {
                        style: {
                            backgroundColor: "#ffffff",
                        },
                    },
                }}
                content={() => <Block backgroundColor="#ffffff">Enter Design Title</Block>}
            >
                <Block
                    $style={{
                        cursor: "pointer",
                        padding: "10px",
                        display: "flex",
                        color: "#ffffff",
                    }}
                >
                    <CloudCheck size={24} />
                </Block>
            </StatefulTooltip>
        </Block>
    )
}

export default MobileDesignTitle
