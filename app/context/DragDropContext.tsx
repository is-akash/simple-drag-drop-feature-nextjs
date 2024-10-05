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
