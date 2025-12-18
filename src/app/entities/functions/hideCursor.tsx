import { useEffect } from "react";

export default function HideCursor() {
    useEffect(() => {
        document.body.style.cursor = 'none'

        return () => {
            document.body.style.cursor = 'default'
        }
    }, [])

    return null
}