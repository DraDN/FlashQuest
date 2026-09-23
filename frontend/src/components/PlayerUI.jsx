import { useDraggable } from '@dnd-kit/core';
import { calculateTotalLevelXP, calculateLevelUpXP } from '../utils/xp_utils';

export function PlayerUI({ player, hand, get_card }) {
    return (
        <div className="flex flex-col w-full min-h-1/3 ">
            <XPBar xp={player.xp} previous_level_xp={calculateTotalLevelXP(player.level)} needed_xp={calculateLevelUpXP(player.level)} level={player.level} />
            <HealthBar health={player.health} max_health={player.max_health} />
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

function HealthBar({ health, max_health }) {
    return (
        <div className="space-y-1.5 relative border border-dungeon-yellow-glow">
            <div className="w-full h-8">
                {health > 0 && (
                    <div className={`flex flex-row h-full bg-dungeon-red-900 transition-all ${health < max_health && "rounded-r-xl"} duration-500 ease-out`}
                        style={{ width: `${health / max_health * 100}%`}}>
                    </div>
                )}
                <p className="text-white absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 italic">Health: {health}</p>
            </div>
        </div>
    )
}

function XPBar({ xp, previous_level_xp, needed_xp, level}) {
    return (
        <div className="space-y-1.5 relative rounded-t-xl">
            <div className="w-full h-8 inline-flex gap-2">
                <p className="text-dungeon-yellow-glow font-bold ml-2 px-2 py-1 bg-dungeon-dark-900 italic">XP: {xp}</p>
                <div className="grow h-full">
                    <div className={`flex flex-row h-full bg-dungeon-yellow-glow transition-all rounded-t-xl duration-500 ease-out`}
                        style={{ width: `${(xp - previous_level_xp) / needed_xp * 100}%`}}>
                    </div>
                </div>
                <p className="text-dungeon-yellow-glow font-bold mr-2 px-2 py-1 bg-dungeon-dark-900 italic">Level: {level}</p>
            </div>
        </div>
    )
}