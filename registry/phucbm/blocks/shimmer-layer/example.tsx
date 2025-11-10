import {ShimmerLayer} from "@/registry/phucbm/blocks/shimmer-layer/shimmer-layer";

export default function Example() {
    return (
        <div className="h-screen flex items-center justify-center gap-10 bg-slate-50">
            {/*button*/}
            <a
                href="#"
                className="group/shimmer overflow-hidden relative
                px-5 py-3 bg-blue-600 text-white rounded-lg text-sm
                border-t-[2px] border-x-[2px] border-b-[4px] border-black/15
                transition-all duration-300 ease-in-out
                hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:bg-blue-600/90 hover:border-b-[2px]
                "
            >
                HOVER ON ME
                <ShimmerLayer/>
            </a>


            {/*image*/}
            <div
                className="w-56 aspect-square rounded-full group/shimmer relative overflow-hidden ring-1 ring-slate-300">
                <img src={`https://picsum.photos/400/400?random=${Math.random()}`}
                     alt="Image demo"
                     className="object-cover w-full h-full"/>
                <ShimmerLayer skew={-20} duration={1000} width={15}/>
            </div>

        </div>
    );
}