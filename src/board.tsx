import { useRef, useCallback, useImperativeHandle, forwardRef, useMemo, useState } from "react";
import { StrokType } from "./App";

export type BoardHandle = {
    onClear: () => void;
};

type BoardProps = {
    strokType: StrokType;
    strokWidth: number;
    strokStyle: string;
};

function getSafeContext(canvasNode: HTMLCanvasElement | null) {
    if (!canvasNode) return null;
    const ctx = canvasNode.getContext("2d");
    if (!ctx) return null;
    return { canvas: canvasNode, ctx };
}

export const Board = forwardRef<BoardHandle, BoardProps>(function Board(
    { strokType, strokWidth, strokStyle },
    ref
) {
    const [canvasNode, setCanvasNode] = useState<HTMLCanvasElement | null>(null);
    const isDrawing = useRef(false);
    const startPoint = useRef({ x: 0, y: 0 });
    const snapshot = useRef<ImageData>();

    const safeContext = useMemo(() => {
        return getSafeContext(canvasNode);
    }, [canvasNode]);

    useImperativeHandle(
        ref,
        () => {
            return {
                onClear: () => {
                    if (safeContext) {
                        safeContext.ctx.clearRect(
                            0,
                            0,
                            safeContext.canvas.width,
                            safeContext.canvas.height
                        );
                    }
                },
            };
        },
        [safeContext]
    );

    const canvasCallbackRef = useCallback((node: HTMLCanvasElement) => {
        if (!node) return;
        node.width = node.parentElement?.clientWidth || 0;
        node.height = node.parentElement?.clientHeight || 0;
        setCanvasNode(node);
        return node;
    }, []);

    const handleOnMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (safeContext) {
            const { canvas, ctx } = safeContext;
            isDrawing.current = true;
            ctx.beginPath();
            ctx.lineWidth = strokWidth;
            ctx.strokeStyle = strokStyle;
            startPoint.current.x = event.nativeEvent.offsetX;
            startPoint.current.y = event.nativeEvent.offsetY;
            if (strokType === "square") {
                snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const handleOnMouseMove = (event: React.MouseEvent) => {
        if (!isDrawing.current) return;
        if (safeContext) {
            const { ctx } = safeContext;
            if (strokType === "draw") {
                ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
                ctx.stroke();
            } else if (strokType === "erase") {
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = strokWidth * 5;
                ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
                ctx.stroke();
            } else if (strokType === "square") {
                if (!snapshot.current) return;
                ctx.putImageData(snapshot.current, 0, 0);
                drawRect(event);
            }
        }
    };

    const handleOnMouseUp = () => {
        isDrawing.current = false;
    };

    const drawRect = (event: React.MouseEvent) => {
        if (safeContext) {
            const { ctx } = safeContext;
            ctx.strokeRect(
                startPoint.current.x,
                startPoint.current.y,
                event.nativeEvent.offsetX - startPoint.current.x,
                event.nativeEvent.offsetY - startPoint.current.y
            );
        }
    };

    return (
        <section className="w-full">
            <canvas
                ref={canvasCallbackRef}
                onMouseUp={handleOnMouseUp}
                onMouseMove={handleOnMouseMove}
                onMouseDown={handleOnMouseDown}
            ></canvas>
        </section>
    );
});
