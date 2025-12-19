import { useGLTF } from "@react-three/drei"

interface PencilProps {
    position: [number, number, number]
}

export default function Pencil({ position }: PencilProps) {
    const { scene } = useGLTF('/models/room3/trash/stationery_pencil_pen_and_eraser_lowpoly.glb')

    return (
        <primitive
            object={scene}
            position={position}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/trash/stationery_pencil_pen_and_eraser_lowpoly.glb')