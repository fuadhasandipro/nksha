import React from "react";
import { HexColorPicker } from "react-colorful";
import { useActiveObject, useEditor } from "@layerhub-io/react";
import { TextState } from "../../../../MobileEditor/components/Panels/panelItems/TextEffects";
import { StatefulPopover } from "baseui/popover";
import { PLACEMENT } from "baseui/toast";
import { debounce } from "lodash";

interface Options {
  enabled: boolean;
  stroke: string;
  strokeWidth: number;
}

const Outline = ({ state }: { state: TextState }) => {
  const editor = useEditor();
  const activeObject = useActiveObject();

  const [options, setOptions] = React.useState<Options>({
    enabled: false,
    stroke: state.stroke || "#000000", // Default stroke color
    strokeWidth: state.strokeWidth || 0, // Default strokeWidth
  });

  React.useEffect(() => {
    if (activeObject) {
      updateOptions(activeObject);
    }
  }, [activeObject, state]);


  const updateOptions = (object: any) => {
    const { stroke, strokeWidth, metadata } = object;
    setOptions({ ...options, stroke, strokeWidth, enabled: metadata?.outline || false });
  };

  // Debounced function for backend updates
  const updateEditorObjects = React.useCallback(
    debounce((key: string, value: any) => {
      if (editor) {
        if (key === "enabled") {
          editor.objects.update({
            metadata: { ...activeObject.metadata, outline: value },
          });
        } else {
          editor.objects.update({ [key]: value });
        }
      }
    }, 100),
    [editor, activeObject]
  );

  const handleChange = (type: string, value: any) => {
    setOptions((prevOptions) => {
      const updatedOptions = { ...prevOptions, [type]: value };
      if (type === "enabled") {
        updateEditorObjects(type, value); // Debounced backend update
        if (value) {
          // If enabling outline, set stroke and metadata
          editor.objects.update({
            strokeWidth: options.strokeWidth || 1, // Ensure a default width if not set
            metadata: { ...activeObject.metadata, outline: true },
          });
        } else {
          // If disabling outline, set strokeWidth to 0 and update metadata
          editor.objects.update({
            strokeWidth: 0,
            metadata: { ...activeObject.metadata, outline: false },
          });
        }
      } else {
        // For other properties like stroke and strokeWidth
        updateEditorObjects(type, value); // Debounced backend update
      }
      return updatedOptions;
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md my-5">
      <div className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.enabled}
            onChange={(e) => handleChange("enabled", e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm font-medium">Outline</span>
        </div>
        <div className="relative">
          <StatefulPopover
            placement={PLACEMENT.topLeft}
            content={
              <div className="p-4 bg-white rounded-lg shadow-lg w-[233px] text-center">
                <HexColorPicker
                  color={options.stroke}
                  onChange={(color) => handleChange("stroke", color)}
                />
                <input
                  type="text"
                  value={options.stroke}
                  onChange={(e) => handleChange("stroke", e.target.value)}
                  className="w-full mt-2 p-1 border rounded-md text-center"
                  placeholder="#000000"
                />
              </div>
            }
            accessibilityType="tooltip"
          >
            <div>
              <div
                className="w-7 h-7 cursor-pointer rounded-full"
                style={{ backgroundColor: options.stroke }}
              />
            </div>
          </StatefulPopover>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Size</label>
        <div className="mt-1">
          <input
            type="range"
            min="0"
            max="100"
            value={options.strokeWidth}
            onChange={(e) => handleChange("strokeWidth", Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="text-right text-sm">{options.strokeWidth}</div>
      </div>
    </div>
  );
};

export default Outline;
