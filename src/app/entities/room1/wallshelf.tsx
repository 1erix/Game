import { useGLTF } from "@react-three/drei";

export default function WallShelf() {
    const { scene } = useGLTF('/models/room1/wall_decoration_shelf.glb')

    return (
        <primitive
            object={scene}
            position={[2, 0.5, 4.9]}
            rotation={[0, 0, 0]}
            scale={0.2}
        />
    )
}

useGLTF.preload('/models/room1/wall_decoration_shelf.glb')