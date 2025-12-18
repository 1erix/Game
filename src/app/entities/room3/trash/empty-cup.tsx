import { useGLTF } from "@react-three/drei"

interface CupProps {
    position: [number, number, number]
}

export default function Cups({ position }: CupProps) {
    const { scene } = useGLTF('/models/room3/trash/empty_cup.glb')

    return (
        <primitive
            object={scene}
            position={position}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/trash/empty_cup.glb')