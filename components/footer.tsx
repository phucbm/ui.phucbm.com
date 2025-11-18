import {Footer} from "nextra-theme-docs";
import {IconHeartFilled} from "@tabler/icons-react";
import {IconBrandGithub, IconBrandX} from "@tabler/icons-react";
import {getComponents} from "@/lib/getComponents";

export async function MyFooter() {
    const components = await getComponents();
    const componentCount = components.length;

    return (
        <Footer>
            <div className="flex flex-col gap-4 w-full">
                {/* Main credit line with stats */}
                <div className="flex justify-center items-center text-center gap-1 text-sm">
                    <span>{componentCount} components</span>
                    <span className="text-muted-foreground">•</span>
                    Built with <IconHeartFilled className="w-4 h-4 text-brand"/>
                    <span>by</span>
                    <a href="https://phucbm.com" target="_blank" className="hover:text-brand hover:underline font-medium">phucbm</a>
                </div>

                {/* Social links */}
                <div className="flex justify-center items-center gap-3">
                    <a
                        href="https://github.com/phucbm/ui.phucbm.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand transition-colors"
                        aria-label="GitHub"
                    >
                        <IconBrandGithub className="w-5 h-5"/>
                    </a>
                    <a
                        href="https://x.com/phucbm_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand transition-colors"
                        aria-label="X / Twitter"
                    >
                        <IconBrandX className="w-5 h-5"/>
                    </a>
                    <a
                        href="https://phucbm.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-brand transition-colors text-sm font-medium"
                        aria-label="Personal website"
                    >
                        phucbm.com
                    </a>
                </div>
            </div>
        </Footer>
    );
}