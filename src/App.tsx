import { useState, useRef } from "react";
import { ClearBtn, Colors, Options, Sidebar, StrokWidth } from "./sidebar";
import { Board, BoardHandle } from "./board";

export type StrokType = "draw" | "erase" | "square";

export type OptionsType = {
    selectedColor: string;
    strokWidth: number;
    strokType: StrokType;
};

function App() {
    const ref = useRef<BoardHandle>(null);
    const [options, setOptions] = useState<OptionsType>({
        selectedColor: "#000",
        strokWidth: 5,
        strokType: "draw",
    });

    const handleOnClear = () => {
        ref.current?.onClear();
    };

    return (
        <main className="flex w-screen h-screen">
            <Sidebar>
                <Options strokType={options.strokType} setOptions={setOptions} />
                <StrokWidth setOptions={setOptions} />
                <Colors selectedColor={options.selectedColor} setOptions={setOptions} />
                <ClearBtn onClick={handleOnClear} />
            </Sidebar>
            <Board
                ref={ref}
                strokType={options.strokType}
                strokWidth={options.strokWidth}
                strokStyle={options.selectedColor}
            />
        </main>
    );
}

export default App;
