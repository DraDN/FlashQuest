import { useDraggable } from '@dnd-kit/core';

export function PlayerUI({ player, hand, get_card }) {
    return (
        <div className="flex flex-col w-full min-h-1/3 border border-dungeon-yellow">
            <HealthBar player_health={player.health} />
            <div className="flex flex-row grow gap-4 p-4 items-center md:justify-center justify-start bg-dungeon-dark-500 border border-dungeon-yellow overflow-x-auto overflow-y-hidden">
                {hand.map((card) => {
                    return <PlayerCard key={card.id} card={get_card(card.id)} fresh={true} index={card.id} />
                })}
            </div>
        </div>
    );
};

export function PlayerCard({ card, fresh, index }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: index
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined;

    let font_size = "text-lg";
    if (card.question.length >= 75) {
        font_size = "text-sm";
    } else if (card.question.length >= 55) {
        font_size = "text-md";
    }

    return (
        <div ref={setNodeRef} 
            className={`${isDragging ? "bg-dungeon-orange-glow" : "bg-dungeon-dark-900"} text-white border border-dungeon-yellow p-4 w-40 h-40 shrink-0 text-center font-bold ${font_size} rounded-xl ${fresh ? "animate-card-draw" : ""}`}
            style={{
            ...style,
            /* 1. Tell it exactly where your visual Deck Pile lives on the viewport screen */
            '--slide-from-x': '150px',
            '--slide-from-y': '-200px', // Slide down from top-right corner deck pile location
            
            /* 2. Stagger each card draw sequence by 100 milliseconds per index step */
            animationDelay: `${(index + 1) * 100}ms`,
            
            /* Keep card invisible until its individual delay timer starts running */
            animationFillMode: 'both' 
            }}
            {...attributes} {...listeners}>
            <p>{card.question}</p>
        </div>
    );
}

function HealthBar({ player_health: health }) {
    return (
        <div className="space-y-1.5 relative">
            <div className="w-full h-8">
                {health > 0 && (
                    <div className={`flex flex-row h-full bg-dungeon-red-900 transition-all ${health < 100 && "rounded-r-xl"} duration-500 ease-out`}
                        style={{ width: `${health}%`}}>
                    </div>
                )}
                <p className="text-white absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 italic">Health: {health}</p>
            </div>
        </div>
    )
}