import { useGLTF } from "@react-three/drei"

interface CupsProps {
    position: [number, number, number]
}

export default function CoffeeCups({ position }: CupsProps) {
    const { scene } = useGLTF('/models/room1/coffee_cup.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            scale={0.07}
        />
    )
}

useGLTF.preload('/models/room1/coffee_cup.glb')