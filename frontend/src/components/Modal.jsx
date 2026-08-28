export default function Modal({ children, basic = false }) {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                {basic ?
                    children : (
                    <div className="w-full max-w-md relative p-6 bg-dungeon-dark-900 rounded-xl border border-dungeon-yellow">
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}