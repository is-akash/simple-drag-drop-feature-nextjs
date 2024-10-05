# react-dnd & react-dnd-html5-backend

How to create a drag and drop feature using this in react/nextjs

![preview](/preview/preview.png)

step 1

Let’s create a next.js project

```bash
npx create-next-app@latest ./
```

step 2

Install the dependencies

```bash
npm i react-dnd react-dnd-html5-backend
```

step 3

context for state management

```bash
import React, { createContext, useContext, useState } from "react";

export interface ITEM {
    id: string;
    text: string;
    status: string;
}

interface DragDropContextProps {
    droppedItems: ITEM[];
    handleDropItem: (item: ITEM) => void;
}

const DragDropContext = createContext<DragDropContextProps | undefined>(
    undefined
);

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const initialData: ITEM[] = [
        { id: "item1", text: "item1", status: "today" },
        { id: "item2", text: "item2", status: "tomorrow" },
        { id: "item3", text: "item3", status: "today" },
    ];

    const [droppedItems, setDroppedItems] = useState<ITEM[]>(initialData);

    const handleDropItem = (droppedItem: ITEM) => {
        setDroppedItems((prevItems) => {
            const filteredItems = prevItems.filter(
                (item) => item.id !== droppedItem.id
            );
            return [...filteredItems, droppedItem];
        });
    };

    return (
        <DragDropContext.Provider value={{ droppedItems, handleDropItem }}>
            {children}
        </DragDropContext.Provider>
    );
};

export const useDragDrop = () => {
    const context = useContext(DragDropContext);
    if (!context) {
        throw new Error("useDragDrop must be used within a DragDropProvider");
    }
    return context;
};
```

step 4

Create Draggable and Droppable Components

1. **Create a new component `DraggableItem.tsx`**:
This will be the item that users can drag around.

```bash
import { useDrag } from "react-dnd";

export const ITEM_TYPE = "task";

export interface ITEM {
    id: string;
    text: string;
    status: string;
}

const DraggableItem: React.FC<ITEM> = ({ id, text, status }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE,
        item: { id, text, status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={(instance) => {
                drag(instance);
            }}
            className={`p-4 bg-blue-500 text-white rounded-lg cursor-pointer ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
        >
            {text}
        </div>
    );
};

export default DraggableItem;
```

b. **Create a new component `DroppableArea.tsx`**:
This component will accept draggable items.

```bash
import { useDrop } from "react-dnd";
import { useDragDrop, ITEM } from "../context/DragDropContext";
import DraggableItem from "./DraggableItem";

interface DroppableAreaProps {
    status: string;
    children: React.ReactNode;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ children, status }) => {
    const { droppedItems, handleDropItem } = useDragDrop();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item: ITEM) => handleDropItem({ ...item, status }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={(instance) => {
                drop(instance);
            }}
            className={`w-full space-y-2 p-8 border-2 border-dashed rounded-lg ${
                isOver ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
        >
            {children}
            {droppedItems
                .filter((item) => item.status === status)
                .map((item) => (
                    <DraggableItem key={item.id} {...item} />
                ))}
        </div>
    );
};

export default DroppableArea;
```

step 5

Lastly The main container for drag and drop

For that the main container must warpped with `DndProvider`

page.tsx:

```bash
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
```