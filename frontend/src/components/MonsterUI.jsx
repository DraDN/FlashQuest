import { useDroppable } from "@dnd-kit/core";

export function MonsterUI({ monsters }) {
    return (
        <>
            <div className="flex flex-row grow gap-4 p-4 h-2/3 items-center justify-center flex-wrap overflow-y-auto overflow-x-hidden max-h-full dungeon-bg">
                {monsters.map((mon, index) => (
                    <MonsterCard key={index} monster={mon} index={index} />
                ))}
            </div>
        </>
    )
}

function MonsterCard({ monster, index }) {
    const { setNodeRef, isOver } = useDroppable({
        id: index,
    })

    const name_colors = {
        "Weak": "text-zinc-400",
        "Normal": "",
        "Hard": "text-dungeon-orange-glow",
        "Elite": "text-dungeon-yellow-glow",
        "Boss": "text-dungeon-red-500"
    };

    const sizes = {
        "Weak": "w-35 h-40",
        "Normal": "w-35 h-40",
        "Hard": "w-45 h-50",
        "Elite": "w-45 h-50",
        "Boss": "w-55 h-60"
    }

    return (
        <div ref={setNodeRef}
            className="p-4 text-center space-y-2 shrink-0 text-white bg-dungeon-dark-900/85 rounded-b-2xl rounded-t-full transition-transform">
            <div className={`${sizes[monster.tier]} ${isOver ? "bg-dungeon-red-900" : ""} ${(monster.is_hit && monster.is_hit == true) ? (`${monster.health <= 0 ? "animate-float-up pointer-events-none" : "animate-shake"} border-2 border-dungeon-red-900/50`) : "border-white"} text-center rounded-b-xl rounded-t-full`}>
                <img src={`${monster.asset.image}`} className="w-full h-full object-contain crisp-edges" />
            </div>
            <p className="text-dungeon-red-500">Health: {monster.health} / {monster.max_health}</p>
            <p className={`${name_colors[monster.tier]} font-bold`}>{monster.tier === "Normal" ? "" : monster.tier} {monster.asset.name}</p>
        </div>
    );
}