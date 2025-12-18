import { useGLTF } from "@react-three/drei"

interface BottleProps {
    position: [number, number, number]
}

export default function Bottle({ position }: BottleProps) {
    const { scene } = useGLTF('/models/room3/trash/bottle.glb')

    return (
        <primitive
            object={scene}
            position={position}
            scale={0.09}
        />
    )
}

useGLTF.preload('/models/room3/trash/bottle.glb')