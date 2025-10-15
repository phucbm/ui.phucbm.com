"use client";

import * as React from "react";

/** Sync a Dialog's open state with a URL hash like `#<hashId>` */
export function useDialogHash(hashId: string) {
    const targetHash = `#${hashId}`;
    const [open, _setOpen] = React.useState(false);

    // Open if the current hash matches
    React.useEffect(() => {
        const syncFromLocation = () => _setOpen(window.location.hash === targetHash);
        syncFromLocation(); // on mount
        window.addEventListener("hashchange", syncFromLocation);
        return () => window.removeEventListener("hashchange", syncFromLocation);
    }, [targetHash]);

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (typeof window === "undefined") return;
            // If opening, push hash (so Back closes)
            if (next) {
                if (window.location.hash !== targetHash) {
                    history.pushState(null, "", targetHash);
                }
                _setOpen(true);
                return;
            }
            // If closing and we own the hash, go back (preferred)
            if (window.location.hash === targetHash) {
                history.back();
            } else {
                // Fallback: remove hash without adding history entry
                history.replaceState(
                    null,
                    "",
                    window.location.pathname + window.location.search
                );
            }
            _setOpen(false);
        },
        [targetHash]
    );

    return {open, setOpen, hash: targetHash};
}