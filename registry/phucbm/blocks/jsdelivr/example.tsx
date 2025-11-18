import {JsDelivrPackages} from "@/registry/phucbm/blocks/jsdelivr/jsdelivr";

export default function Example() {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <JsDelivrPackages username="phucbm"/>
        </div>
    );
}