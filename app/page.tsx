"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableArea from "./components/DroppableArea";
import { DragDropProvider } from "./context/DragDropContext";

const dropTypes = ["today", "tomorrow"];

export default function Home() {
    return (
        <DragDropProvider>
            <DndProvider backend={HTML5Backend}>
                <main className='h-screen w-full flex items-center justify-center'>
                    <div className='p-10 w-full h-full'>
                        <h1 className='text-3xl mb-8 font-bold'>
                            Drag and Drop Example:
                        </h1>
                        <div className='flex justify-between space-x-4 bg-gray-100 p-4 w-full h-full'>
                            {dropTypes.map((area, i) => (
                                <DroppableArea key={i} status={area}>
                                    <h1>{area}</h1>
                                    <h2 className='text-xl font-semibold mb-4'>
                                        Drop Here
                                    </h2>
                                </DroppableArea>
                            ))}
                        </div>
                    </div>
                </main>
            </DndProvider>
        </DragDropProvider>
    );
}
