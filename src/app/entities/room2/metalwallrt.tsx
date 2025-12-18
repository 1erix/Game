import { useGLTF } from "@react-three/drei";

export default function MetalWallArt() {
    const { scene } = useGLTF('/models/room2/metal_art_wall_frame.glb')

    return (
        <primitive
            object={scene}
            position={[-0.5, 0.7, 4.8]}
            rotation={[-0.14, 1.6, 0]}
            scale={0.3}
        />
    )
}

useGLTF.preload('/models/room2/metal_art_wall_frame.glb')