// "use client";
//
// import {Button} from "@/components/ui/button";
// import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
// import {useDialogHash} from "@/hooks/useDialogHash";
// import {MaximizeIcon} from "@/components/ui/maximize";
// import React, {useEffect, useRef, useState} from "react";
// import {XIcon} from "@/components/ui/x";
// import {KeyBoard} from "@/components/KeyBoard";
// import {RegistryItem} from "shadcn/schema";
// import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
// import CodeBlockView, {CodeItem} from "@/components/code-block-view";
// import {cn} from "@/lib/utils";
// import {RegistryInstall} from "@/components/registry-install";
// import {RefreshCWIcon} from "@/components/ui/refresh-cw";
//
// type Props = {
//     children: React.ReactNode;
//     registryItem?: RegistryItem;
//     code: CodeItem[];
//     hashId?: string;
//     subtitle?: string;
// };
//
// export function MaximizeRegistry({
//                                      children,
//                                      registryItem,
//                                      code,
//                                      subtitle,
//                                      hashId = "preview",
//                                  }: Props) {
//     const showRefreshButton = false;
//     const refreshDelay = 500;
//     const {open, setOpen} = useDialogHash(hashId);
//     const [tab, setTab] = useState("");
//     const hasFiles = registryItem?.files?.length > 0;
//
//     // header measuring
//     const headerRef = useRef<HTMLDivElement>(null);
//     const [headerHeight, setHeaderHeight] = useState(0);
//     useEffect(() => {
//         const updateHeight = () => {
//             const h = headerRef.current?.offsetHeight ?? 0;
//             setHeaderHeight(h);
//         };
//         updateHeight();
//         window.addEventListener("resize", updateHeight);
//         const observer = new MutationObserver(updateHeight);
//         if (headerRef.current) observer.observe(headerRef.current, {childList: true, subtree: true});
//         return () => {
//             window.removeEventListener("resize", updateHeight);
//             observer.disconnect();
//         };
//     }, [tab]);
//
//     // preview refresh controls
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [previewReady, setPreviewReady] = useState(false);
//     const [previewNonce, setPreviewNonce] = useState(0);
//     const refreshTimerRef = useRef<number | undefined>(undefined);
//
//     const clearRefreshTimer = () => {
//         if (refreshTimerRef.current) {
//             clearTimeout(refreshTimerRef.current);
//             refreshTimerRef.current = undefined;
//         }
//     };
//
//     // Button-triggered refresh for <TabsContent value="preview">
//     const refreshPreview = (delayMs = refreshDelay) => {
//         clearRefreshTimer();
//         setPreviewReady(false);
//         refreshTimerRef.current = window.setTimeout(() => {
//             setPreviewNonce((n) => n + 1);
//             setPreviewReady(true);
//             // (optional) notify children that want to re-measure without remount
//             const el = contentRef.current;
//             if (el) el.dispatchEvent(new CustomEvent("perxel:layout-refresh"));
//             refreshTimerRef.current = undefined;
//         }, delayMs);
//     };
//
//     // Auto-refresh 1s after dialog is opened/mounted
//     useEffect(() => {
//         if (!open) {
//             clearRefreshTimer();
//             setPreviewReady(false);
//             return;
//         }
//         // show loader immediately, then remount after delay
//         refreshPreview(refreshDelay);
//         return clearRefreshTimer;
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [open]);
//
//     return (
//         <div data-component="maximizable-registry">
//             <Dialog open={open} onOpenChange={setOpen}>
//                 {/* Inline button */}
//                 <DialogTrigger asChild>
//                     <Button variant="ghost" size="icon" aria-label="Maximize">
//                         <MaximizeIcon/>
//                     </Button>
//                 </DialogTrigger>
//
//                 <DialogContent
//                     ref={contentRef}
//                     forceMount
//                     showCloseButton={false}
//                     className={cn(
//                         "w-screen h-screen !max-w-none rounded-none border-none p-0 gap-0 overflow-hidden px-bg-pattern-transparent"
//                     )}
//                     style={{
//                         ["--header-height" as any]: `${headerHeight}px`,
//                     }}
//                 >
//                     <Tabs defaultValue="preview" className="w-screen" onValueChange={(v) => setTab(v)}>
//                         <DialogHeader
//                             ref={headerRef}
//                             className="absolute top-0 left-0 w-full z-20 border-b px-bg-blur"
//                         >
//                             <div className="flex justify-between items-center px-4 py-2 w-full">
//                                 {/* header left */}
//                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 max-sm:w-2/3">
//                                     <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
//                                         <DialogTitle>{registryItem?.title}</DialogTitle>
//                                         {subtitle && <div>{subtitle}</div>}
//                                     </div>
//                                     <TabsList>
//                                         <TabsTrigger value="preview">Preview</TabsTrigger>
//                                         {hasFiles && <TabsTrigger value="code">Code</TabsTrigger>}
//                                         <TabsTrigger value="installation">Installation</TabsTrigger>
//                                     </TabsList>
//                                 </div>
//
//                                 {/* header right */}
//                                 <div className="flex justify-end items-center gap-2 max-sm:w-1/3">
//                                     {/* Refresh Preview Button */}
//                                     {showRefreshButton && <Button
//                                         variant="outline"
//                                         size="icon-sm"
//                                         aria-label="Refresh preview layout"
//                                         onClick={() => refreshPreview(0)}
//                                     >
//                                         <RefreshCWIcon/>
//                                     </Button>}
//
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         aria-label="Close"
//                                         onClick={() => setOpen(false)}
//                                     >
//                                         <KeyBoard keyName="ESC"/>
//                                         <XIcon className="h-4 w-4"/>
//                                     </Button>
//                                 </div>
//                             </div>
//                         </DialogHeader>
//
//                         <TabsContent value="preview">
//                             <div className="flex justify-center items-center @container h-screen">
//                                 <div className="overflow-auto size-full max-h-screen">
//                                     {!previewReady ? (
//                                         <div className="grid place-items-center h-[calc(100vh-var(--header-height))]">
//                       <span className="animate-pulse text-sm text-muted-foreground">
//                         Preparing preview…
//                       </span>
//                                         </div>
//                                     ) : (
//                                         // key forces a clean mount → re-run layout calculations
//                                         <div key={previewNonce}>{children}</div>
//                                     )}
//                                 </div>
//                             </div>
//                         </TabsContent>
//
//                         {hasFiles && (
//                             <TabsContent value="code" className="pt-[var(--header-height)] w-full">
//                                 <div className="container mx-auto px-4 pt-6">
//                                     <CodeBlockView
//                                         code={code}
//                                         contentClassName="h-[calc(90vh-var(--header-height)-45px)] max-h-none"
//                                     />
//                                 </div>
//                             </TabsContent>
//                         )}
//
//                         <TabsContent value="installation" className="pt-[var(--header-height)] w-full">
//                             <div className="container mx-auto px-4">
//                                 <RegistryInstall name={registryItem?.name || ""}/>
//                             </div>
//                         </TabsContent>
//                     </Tabs>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }