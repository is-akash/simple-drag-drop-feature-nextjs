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
