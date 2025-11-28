"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracker";

export default function SessionTracker() {
    useEffect(() => {

        const sessionId =
            sessionStorage.getItem("session_id") || crypto.randomUUID();
        sessionStorage.setItem("session_id", sessionId);

        trackEvent("session_start", { session_id: sessionId });

        const handleBeforeUnload = () => {
            trackEvent("session_end", { session_id: sessionId });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    return null;
}
