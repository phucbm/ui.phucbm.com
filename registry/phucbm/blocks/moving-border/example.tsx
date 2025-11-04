import {MovingBorder} from "@/registry/phucbm/blocks/moving-border/moving-border";

export default function Example() {
    return (
        <div className="flex justify-center items-center h-screen gap-3">
            <MovingBorder radius={18} borderWidth={2} gradientWidth={40} duration={3}>
                <div
                    className="w-[100px] aspect-video border border-border bg-accent rounded-[18px] flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-robot-face">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z"/>
                        <path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1"/>
                        <path d="M9 7l-1 -4"/>
                        <path d="M15 7l1 -4"/>
                        <path d="M9 12v-1"/>
                        <path d="M15 12v-1"/>
                    </svg>
                </div>
            </MovingBorder>
            <MovingBorder radius={18} borderWidth={2} gradientWidth={60} duration={2}
                          colors={["#dce817", "#10f400", "#75ba33"]}>
                <div
                    className="w-[100px] aspect-video border border-border bg-accent rounded-[18px] flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="icon icon-tabler icons-tabler-outline icon-tabler-mood-sing">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                        <path d="M9 9h.01"/>
                        <path d="M15 9h.01"/>
                        <path d="M15 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                    </svg>
                </div>
            </MovingBorder>

            <MovingBorder radius={200} borderWidth={4} gradientWidth={150} duration={7}
                          colors={["#176be8", "#291777", "#cb92ff"]}>
                <div
                    className="w-[200px] aspect-square bg-accent rounded-full overflow-hidden flex justify-center items-center">
                    <img
                        className="object-cover w-full h-full"
                        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJrZ3NlejZ4ZXlvaDRnbTR1b2VmcG1waGM1Y3hvNGU4aGE0aHcweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BkNnO2qmCWTQuac/giphy.gif"
                        alt="A blurry photo of white flowers in a field"/>
                </div>
            </MovingBorder>
        </div>
    );
}