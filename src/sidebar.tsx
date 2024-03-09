import { ReactNode, useState } from "react";
import { OptionsType, StrokType } from "./App";
import { Eraser, Pencel, Square } from "./icons";

export function Sidebar({ children }: { children: ReactNode }) {
    return (
        <section className=" border-r border-slate-800">
            <nav className="px-9 py-8 space-y-8">{children}</nav>
        </section>
    );
}

const options = [
    { id: "draw", Comp: <Pencel />, type: "draw" },
    { id: "square", Comp: <Square />, type: "square" },
    { id: "erase", Comp: <Eraser />, type: "erase" },
];

export function Options({
    strokType,
    setOptions,
}: {
    strokType: StrokType;
    setOptions: React.Dispatch<React.SetStateAction<OptionsType>>;
}) {
    return (
        <ul className=" flex flex-col gap-2">
            {options.map((i) => (
                <li key={i.id}>
                    <button
                        className={`p-2 rounded-xl bg-gray-200 ${
                            strokType === i.type ? "outline outline-2 outline-black" : ""
                        }`}
                        onClick={() => {
                            setOptions((pre) => ({
                                ...pre,
                                strokType: i.type as StrokType,
                            }));
                        }}
                    >
                        {i.Comp}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export function StrokWidth({
    setOptions,
}: {
    setOptions: React.Dispatch<React.SetStateAction<OptionsType>>;
}) {
    return (
        <div>
            <p>stroke width</p>
            <input
                type="range"
                defaultValue={5}
                min={1}
                max={10}
                step={1}
                onChange={(event) => {
                    setOptions((pre) => ({
                        ...pre,
                        strokWidth: parseInt(event.target.value),
                    }));
                }}
            />
        </div>
    );
}

export function Colors({
    selectedColor,
    setOptions,
}: {
    selectedColor: string;
    setOptions: React.Dispatch<React.SetStateAction<OptionsType>>;
}) {
    const [colors, setColors] = useState([
        { id: "1", name: "white", color: "#fff" },
        { id: "2", name: "black", color: "#000" },
        { id: "3", name: "red", color: "#ff0000" },
        { id: "4", name: "green", color: "#00ff00" },
        { id: "5", name: "blue", color: "#0000ff" },
    ]);

    const handleColorClick = (color: string) => {
        setOptions((pre) => ({ ...pre, selectedColor: color }));
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleColorClick(event.target.value);
        setColors((pre) => {
            const newList = [...pre];
            const lastItem = newList[newList.length - 1];
            newList[newList.length - 1] = { ...lastItem, color: event.target.value };
            return newList;
        });
    };

    return (
        <div>
            <p>colors</p>
            <ul className="flex items-center gap-2">
                {colors.map((i, index) => (
                    <li
                        key={i.id}
                        className={`p-[2px] rounded-full  ${
                            i.color === selectedColor
                                ? "outline-black p-[2px] outline outline-1"
                                : ""
                        }`}
                        onClick={() => handleColorClick(i.color)}
                    >
                        <div
                            style={{ backgroundColor: i.color }}
                            className="w-5 h-5 rounded-full border border-slate-600 cursor-pointer"
                        >
                            {index === colors.length - 1 && (
                                <input
                                    type="color"
                                    className="opacity-0 w-5 h-5 cursor-pointer"
                                    onChange={handleColorChange}
                                />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ClearBtn({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className=" rounded-lg py-2 px-3 font-medium bg-[#fafafa] border border-[#27272A] shadow-sm"
        >
            Clear Canvas
        </button>
    );
}
