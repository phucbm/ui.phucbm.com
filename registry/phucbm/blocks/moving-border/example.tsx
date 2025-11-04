import {MovingBorder} from "@/registry/phucbm/blocks/moving-border/moving-border";

export default function Example() {
    return (
        <div className="flex justify-center items-center flex-wrap h-screen gap-x-12 gap-y-6 bg-emerald-50">

            <div className="flex flex-col gap-3 justify-center items-center">

                {/* The radius prop should be identical with your rounded value */}
                <MovingBorder radius={10} borderWidth={2} gradientWidth={60} duration={3}
                              colors={["#dce817", "#10f400", "#75ba33"]}>
                    <button
                        className="rounded-[10px] w-[100px] aspect-video bg-emerald-200 flex justify-center items-center transition-all duration-500 hover:bg-emerald-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sing">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                            <path d="M9 9h.01"/>
                            <path d="M15 9h.01"/>
                            <path d="M15 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                        </svg>
                    </button>
                </MovingBorder>

                <div>Button</div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center">

                {/* Circle */}
                <MovingBorder isCircle={true}
                              borderWidth={4}
                              gradientWidth={150}
                              duration={4}
                              colors={["#84b5ff", "#dad7f8", "#cb92ff"]}>
                    <div
                        className="w-[200px] aspect-square bg-accent rounded-full overflow-hidden flex justify-center items-center">
                        <img
                            className="object-cover w-full h-full"
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJrZ3NlejZ4ZXlvaDRnbTR1b2VmcG1waGM1Y3hvNGU4aGE0aHcweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BkNnO2qmCWTQuac/giphy.gif"
                            alt="A blurry photo of white flowers in a field"/>
                    </div>
                </MovingBorder>

                <div>Avatar</div>
            </div>
        </div>
    );
}