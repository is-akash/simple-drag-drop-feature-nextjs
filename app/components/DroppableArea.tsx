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
