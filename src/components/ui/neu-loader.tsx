export function NeuLoader() {
    return (
        <div className="flex items-center justify-center gap-3 h-24" aria-label="Cargando...">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="w-5 h-5 rounded-full bg-[#FBF9F6] shadow-[4px_4px_8px_#bebbb8,-4px_-4px_8px_#ffffff] animate-bounce"
                    style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.8s'
                    }}
                />
            ))}
        </div>
    );
}
