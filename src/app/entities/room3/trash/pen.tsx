import { useGLTF } from "@react-three/drei"

interface PenProps {
    position: [number, number, number]
}

export default function Pen({ position }: PenProps) {
    const { scene } = useGLTF('/models/room3/trash/pen.glb')

    return (
        <primitive
            object={scene}
            position={position}
            scale={0.05}
        />
    )
}

useGLTF.preload('/models/room3/trash/pen.glb')