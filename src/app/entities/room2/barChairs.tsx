import { useGLTF } from "@react-three/drei"

export default function BarChairs({ position, rotation }:
    {
        position: [number, number, number],
        rotation: [number, number, number]
    }) {
    const { scene } = useGLTF('/models/room2/bar_chair.glb')

    return (
        <primitive
            object={scene.clone()}
            position={position}
            rotation={rotation}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/bar_chair.glb')