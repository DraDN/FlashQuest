export default function IntermittentMessage({ title, subtitle }) {
    return (
        <div className="text-white flex flex-col flex-1 w-full">
            <div className="flex grow flex-col gap-6 items-center justify-center">
                <h1 className='text-7xl font-bold'>{title}</h1>
                <h2 className='text-lg font-medium'>{subtitle}</h2>
            </div>
        </div>
    );
}
