"use client";
import { useState } from "react";

export function NeuToggle({ label }: { label?: string }) {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <label className="relative inline-block w-[80px] h-[80px] cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />

            {/* Base del botón */}
            <div className="absolute inset-0 rounded-full bg-[#FBF9F6] shadow-neu-flat peer-checked:shadow-neu-pressed transition-all duration-300 flex items-center justify-center">

                {/* Indicador de luz (Power Light) */}
                <div className={`
          w-6 h-6 rounded-full transition-all duration-300 shadow-inner
          ${isChecked
                        ? "bg-inforia-green shadow-[0_0_10px_#2E403B]"
                        : "bg-gray-200 shadow-none"}
        `}></div>
            </div>

            {label && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-sans text-sm text-gray-500 font-bold">{label}</span>}
        </label>
    );
}
