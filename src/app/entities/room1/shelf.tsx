import { useGLTF } from "@react-three/drei";

export default function Shelf() {
    const { scene } = useGLTF('/models/room1/dlx_-_wall_decoration_shelf_wood.glb')

    return (
        <primitive
            object={scene}
            position={[4.9, -1, -0.3]}
            rotation={[0, -1.6, 0]}
            scale={1.5}
        />
    )
}

useGLTF.preload('/models/room1/dlx_-_wall_decoration_shelf_wood.glb')