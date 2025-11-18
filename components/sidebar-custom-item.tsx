import {Component} from "@/lib/getComponents";
import * as React from "react";
import {IconDeviceGamepad} from "@tabler/icons-react";
import {Tooltip} from "@/components/tooltip";

export function SidebarCustomItem(component: Component): React.ReactElement {
    const isPlayground = component.mdx.frontMatter?.tags && Array.from(component.mdx.frontMatter.tags).includes('playground');

    // temporarily disable new badge as not works as expected
    component.isNew = false;
    return (
        <div className="flex justify-between gap-2 relative w-full">
            <div>{component.title}</div>
            <div className="hidden [aside_&]:flex items-center gap-2">
                {isPlayground &&
                    <Tooltip tooltip={
                        <span className="text-[10px] w-[60px] block text-center leading-[1.05] py-0.5">
                            Interactive playground
                        </span>
                    } classNameTooltip="whitespace-normal">
                        <IconDeviceGamepad className="w-5 text-brand"/>
                    </Tooltip>
                }
                {component.isNew &&
                    <Tooltip tooltip={component.isNew}>
                        <div
                            className="
                            text-nowrap
                            text-xs bg-green-200 px-border border-green-500 px-1 pb-0.5 font-mono rounded-[2px] text-gray-900">new
                        </div>
                    </Tooltip>
                }
            </div>
        </div>
    );
}