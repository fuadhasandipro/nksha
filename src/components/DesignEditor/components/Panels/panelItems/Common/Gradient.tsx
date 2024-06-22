import React from "react";
import { HexColorPicker } from "react-colorful";
import { StatefulPopover } from "baseui/popover";
import { Checkbox } from "baseui/checkbox";
import { Slider } from "baseui/slider";
import { Input } from "baseui/input";
import { useActiveObject, useEditor } from "@layerhub-io/react";
import { debounce } from "lodash";
import { PLACEMENT } from "baseui/toast";

interface Options {
  angle: number;
  colors: string[];
  enabled: boolean;
}

const Gradient = () => {
  const editor = useEditor();
  const activeObject = useActiveObject();
  const [options, setOptions] = React.useState<Options>({
    angle: 0,
    colors: ["#24C6DC", "#514A9D"],
    enabled: false,
  });

  const initialOptions = {
    angle: 0,
    colors: ["#24C6DC", "#514A9D"],
    enabled: false,
  };

  const getGradientOptions = (object: any) => {
    const isNotGradient = typeof object?.fill === "string" || object?.fill instanceof String;
    if (!isNotGradient) {
      const colorStops = object.fill.colorStops;
      const colors = [colorStops[0].color, colorStops[1].color];
      return {
        angle: 0,
        colors: colors,
        enabled: true,
      };
    } else {
      return initialOptions;
    }
  };

  React.useEffect(() => {
    if (activeObject) {
      const initialOptions = getGradientOptions(activeObject);
      setOptions({ ...options, ...initialOptions });
    }
  }, [activeObject]);

  const handleChange = debounce((key: string, value: any) => {
    setOptions((prevOptions) => {
      const updatedOptions = { ...prevOptions, [key]: value };
      if (key === "enabled") {
        if (value) {
          editor.objects.setGradient({ ...updatedOptions });
        } else {
          editor.objects.update({
            fill: "#000000",
          });
        }
      } else {
        if (options.enabled) {
          editor.objects.setGradient({ ...updatedOptions });
        }
      }
      return updatedOptions;
    });
  }, 100);

  const handleGradientColorChange = (index: number, color: string) => {
    const updatedColors = [...options.colors];
    updatedColors[index] = color;
    handleChange("colors", updatedColors);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md my-5">
      <div className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={options.enabled}
            onChange={(e) => handleChange("enabled", (e.target as any).checked)}
          />
          <span className="text-sm font-medium">Gradient</span>
        </div>
        <div className="relative">
          <StatefulPopover
            placement={PLACEMENT.topLeft}
            content={
              <div className="p-4 bg-white rounded-lg shadow-lg w-[233px] text-center">
                <HexColorPicker
                  color={options.colors[0]}
                  onChange={(color) => handleGradientColorChange(0, color)}
                />
                <input
                  value={options.colors[0]}
                  onChange={(e) => handleGradientColorChange(0, (e.target as any).value)}
                  placeholder="#000000"

                  className="w-full mt-2 p-1 border rounded-md text-center"
                />
                <HexColorPicker
                  color={options.colors[1]}
                  onChange={(color) => handleGradientColorChange(1, color)}
                />
                <input
                  value={options.colors[1]}
                  onChange={(e) => handleGradientColorChange(1, (e.target as any).value)}
                  placeholder="#000000"

                  className="w-full mt-2 p-1 border rounded-md text-center"
                />
              </div>
            }
            accessibilityType="tooltip"
          >
            <div>
              <div
                className="w-7 h-7 cursor-pointer rounded-full"
                style={{ background: `linear-gradient(${options.angle + 90}deg, ${options.colors[0]}, ${options.colors[1]})` }}
              />
            </div>
          </StatefulPopover>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Direction</label>
        <div className="mt-1">
          <Slider
            max={360}
            value={[options.angle]}
            onChange={({ value }) => handleChange("angle", value[0])}
            className="w-full"
          />
        </div>
        <div className="text-right text-sm">{options.angle}°</div>
      </div>
    </div>
  );
};

export default Gradient;
