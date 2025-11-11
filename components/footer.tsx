import {Footer} from "nextra-theme-docs";
import {IconHeartFilled} from "@tabler/icons-react";

type Props = {};

export function MyFooter(props: Props) {
    return (
        <Footer>
            <div className="flex justify-center text-center w-full gap-1">
                Built with <IconHeartFilled className="text-brand"/> by
                <a href="https://github.com/phucbm" target="_blank" className="hover:text-brand hover:underline">phucbm</a>
            </div>
        </Footer>
    );
}