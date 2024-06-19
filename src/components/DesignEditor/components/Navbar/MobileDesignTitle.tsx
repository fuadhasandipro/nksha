import React from "react";
import { Input } from "baseui/input";
import { Block } from "baseui/block";
import CloudCheck from "@/components/DesignEditor/components/Icons/CloudCheck";
import { StatefulTooltip } from "baseui/tooltip";
import useDesignEditorContext from "@/components/DesignEditor/hooks/useDesignEditorContext";


interface State {
    name: string;
}

const MobileDesignTitle = () => {
    const { currentDesign, setCurrentDesign } = useDesignEditorContext();
    const [state, setState] = React.useState<State>({
        name: currentDesign?.name || "My First Design",
    });
    const inputTitleRef = React.useRef<Input>(null);

    const handleInputChange = (name: string) => {
        setState({ ...state, name });
        setCurrentDesign({ ...currentDesign, name });
    };

    React.useEffect(() => {
        const name = currentDesign.name;
        if (name || name === "") {
            setState({ ...state, name });
        }
    }, [currentDesign.name]);

    return (
        <div className="flex items-center justify-center text-white flex-1">
            <div className="flex items-center">
                <Input
                    onChange={(e) => handleInputChange(e.target.value)}
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
                                fontSize: "12px", // Reduced font size
                                minWidth: "100px",
                                maxWidth: "200px",
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
            </div>

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
                <div className="cursor-pointer p-2 flex items-center">
                    <CloudCheck size={24} />
                </div>
            </StatefulTooltip>
        </div>
    );
};

export default MobileDesignTitle;
