import {Magnetic} from "@/registry/phucbm/blocks/magnetic/magnetic";

export default function Example() {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Magnetic distance={50} attraction={0.5}>
                <button
                    className="relative inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/50 transition-colors duration-200"
                >
                    HOVER ON ME
                </button>
            </Magnetic>
        </div>
    );
}