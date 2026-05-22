import { useDroppable } from "@dnd-kit/core";

export default function Monsters({ monsters }) {
    return (
        <>
            <div className="flex flex-row grow gap-4 p-4 items-center justify-center flex-wrap bg-red-100">
                {monsters.map((mon, index) => (
                    <MonsterCard key={mon.id} monster={mon} index={index} />
                ))}
            </div>
        </>
    )
}

function MonsterCard({ monster, index }) {
    const { setNodeRef, isOver } = useDroppable({
        id: index,
    })

    return (
        <div ref={setNodeRef}
            className="p-4 w-40 md:h-1/2 h-1/3 text-center space-y-2">
            <div className={`h-full ${isOver ? "bg-dungeon-red-900" : "bg-white"} p-4 text-center rounded-xl`}>
            </div>
            <p>Health: {monster.health} / {monster.max_health}</p>
            <p>{monster.tier} {monster.asset.name}</p>
        </div>
    );
}