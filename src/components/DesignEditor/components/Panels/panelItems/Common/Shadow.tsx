import React from "react";
import { HexColorPicker } from "react-colorful";
import { useActiveObject, useEditor } from "@layerhub-io/react";
import { TextState } from "../../../../MobileEditor/components/Panels/panelItems/TextEffects";
import { StatefulPopover } from "baseui/popover";
import { PLACEMENT } from "baseui/toast";
import { Input } from "baseui/input";
import { debounce } from "lodash";

interface Options {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

const Shadow = ({ state }: { state: TextState }) => {
  const editor = useEditor();
  const [options, setOptions] = React.useState<Options>({ ...state.shadow });
  const [colorPickerOpen, setColorPickerOpen] = React.useState(false);

  const activeObject = useActiveObject();

  React.useEffect(() => {
    if (activeObject) {
      updateOptions(activeObject);
    }
  }, [activeObject, state]);

  const updateOptions = (object: any) => {
    if (object?.shadow) {
      const { blur, color, offsetX, offsetY } = object.shadow;
      setOptions({ ...options, blur, color, enabled: object.metadata.shadow, offsetX, offsetY });
    } else {
      setOptions({ ...options, enabled: false });
    }
  };

  const updateEditorObjects = React.useCallback(
    debounce((newOptions: Options) => {
      if (editor && activeObject) {
        editor.objects.setShadow(newOptions);
      }
    }, 100),
    [activeObject, editor]
  );

  const handleChange = (key: keyof Options, value: any) => {
    const updatedOptions = { ...options, [key]: value };

    if (key === "enabled") {
      updatedOptions.enabled = value;
      editor.objects.update({
        metadata: { ...activeObject.metadata, shadow: value },
      });
    }

    setOptions(updatedOptions);
    updateEditorObjects(updatedOptions);
  };


  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.enabled}
            onChange={(e) => handleChange("enabled", e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm font-medium">Shadow</span>
        </div>
        <div className="relative">
          <StatefulPopover
            placement={PLACEMENT.bottomLeft}
            content={
              <div className="p-4 bg-white rounded-lg shadow-lg w-[233px] text-center">
                <HexColorPicker
                  color={options.color}
                  onChange={(color) => handleChange("color", color)}
                />

                <input
                  type="text"
                  value={options.color}
                  onChange={(e) => handleChange("color", (e.target as any).value)}
                  className="w-full mt-2 p-1 border rounded-md text-center"
                  placeholder="#000000"
                />
              </div>
            }
            accessibilityType="tooltip"
          >
            <div
              className="w-7 h-7 cursor-pointer rounded-full"
              style={{ backgroundColor: options.color }}
            />
          </StatefulPopover>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Blur</label>
        <div className="mt-1">
          <input
            type="range"
            min="0"
            max="100"
            value={options.blur}
            onChange={(e) => handleChange("blur", Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="text-right text-sm">{options.blur}</div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Offset Y</label>
        <div className="mt-1">
          <input
            type="range"
            min="-100"
            max="100"
            value={options.offsetY}
            onChange={(e) => handleChange("offsetY", Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="text-right text-sm">{options.offsetY}</div>
      </div>

      <div>
        <label className="text-sm font-medium">Offset X</label>
        <div className="mt-1">
          <input
            type="range"
            min="-100"
            max="100"
            value={options.offsetX}
            onChange={(e) => handleChange("offsetX", Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="text-right text-sm">{options.offsetX}</div>
      </div>
    </div>
  );
};

export default Shadow;
