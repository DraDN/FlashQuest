import { useDraggable } from '@dnd-kit/core';

export function PlayerCards({ hand }) {
    return (
        <>
            <div className="flex flex-row flex-wrap min-h-1/3 gap-4 p-4 md:items-center justify-center bg-red-400 overflow-clip">
                {hand.map((c, index) => (
                    <DraggableCard key={c.id} card={c} index={index} />
                ))}
            </div>
        </>
    )
}

export function DraggableCard({ card, index }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: index
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} 
            className={`${isDragging ? "bg-dungeon-yellow" : "bg-white"} touch-none p-4 w-40 h-40 text-center font-bold text-lg rounded-xl`}
            {...attributes} {...listeners}>
            <p>{card.question}</p>
        </div>
    );
}