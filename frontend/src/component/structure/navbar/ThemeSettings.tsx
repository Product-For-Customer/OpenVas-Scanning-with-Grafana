import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { themeColors } from "../sidebar/data";
import { useStateContext } from "../../../contexts/ProviderContext";

type TooltipPosition =
  | "Top"
  | "TopCenter"
  | "BottomCenter"
  | "RightCenter"
  | "LeftCenter";

type SimpleTooltipProps = {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
};

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  position,
  children,
}) => {
  void content;
  void position;

  return <>{children}</>;
};

const ThemeSettings = () => {
  const { setColor, setMode, currentMode, currentColor, setThemeSettings } =
    useStateContext();

  return (
    <div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
      <div className="float-right h-screen dark:text-gray-200 bg-white dark:bg-[#484B52] w-400">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-lg">Settings</p>
          <button
            type="button"
            onClick={() => setThemeSettings(false)}
            style={{
              color: "rgb(153, 171, 180)",
              borderRadius: "50%",
              WebkitTapHighlightColor: "transparent",
            }}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray focus:outline-none focus:ring-0"
            aria-label="Close settings"
          >
            <MdOutlineCancel />
          </button>
        </div>

        <div className="flex-col border-t border-color p-4 ml-4">
          <p className="font-semibold text-xl">Theme Option</p>

          <div className="mt-4">
            <input
              type="radio"
              id="light"
              name="theme"
              value="Light"
              className="cursor-pointer"
              onChange={setMode}
              checked={currentMode === "Light"}
            />
            <label htmlFor="light" className="ml-2 text-md cursor-pointer">
              Light
            </label>
          </div>

          <div className="mt-2">
            <input
              type="radio"
              id="dark"
              name="theme"
              value="Dark"
              onChange={setMode}
              className="cursor-pointer"
              checked={currentMode === "Dark"}
            />
            <label htmlFor="dark" className="ml-2 text-md cursor-pointer">
              Dark
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-color ml-4">
          <p className="font-semibold text-xl">Theme Colors</p>
          <div className="flex gap-3">
            {themeColors.map((item) => (
              <SimpleTooltip
                key={item.name}
                content={item.name}
                position="TopCenter"
              >
                <div className="relative mt-2 cursor-pointer flex gap-5 items-center">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-full cursor-pointer focus:outline-none focus:ring-0"
                    style={{
                      backgroundColor: item.color,
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onClick={() => setColor(item.color)}
                    aria-label={item.name}
                  >
                    <BsCheck
                      className={`ml-2 text-2xl text-white ${
                        item.color === currentColor ? "block" : "hidden"
                      }`}
                    />
                  </button>
                </div>
              </SimpleTooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;