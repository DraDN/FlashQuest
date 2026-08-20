export default function IntermittentMessage({ title, subtitle, back }) {
    return (
        <div className="text-white bg-dungeon-dark-900 flex flex-col flex-1 w-full h-full">
            <div className="flex grow flex-col gap-6 items-center justify-center">
                <h1 className='text-7xl font-bold'>{title}</h1>
                <h2 className='text-lg font-medium'>{subtitle}</h2>
                {back && (
                    <button className="px-4 py-2 m-4 border border-dungeon-red-900 rounded-xl text-dungeon-red-900 font-bold hover:bg-dungeon-red-900 hover:text-dungeon-dark-900 transition-colors" onClick={back}>- Back -</button>
                )}
            </div>
        </div>
    );
}
