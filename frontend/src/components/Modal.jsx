export default function Modal({ children }) {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-md relative p-6 bg-zinc-900">
                    {children}
                </div>
            </div>
        </>
    );
}