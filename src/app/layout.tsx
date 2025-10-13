import RootLayout from "@/components/RootLayout";
import React from "react";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Perxel UI",
    description: "A refined library of accessible Tailwind + GSAP components.",
};

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    )
}