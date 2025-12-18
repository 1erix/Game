import { useGLTF } from "@react-three/drei";

export default function WallMountedTv() {
    const { scene } = useGLTF('/models/room3/0a07d88a6bb64475a0b043678a73b319.glb')
    return (
        <primitive
            object={scene}
            position={[3.35, 0.5, 1.5]}
            rotation={[0, -1.55, 0]}
            scale={0.7}
        />
    )
}

useGLTF.preload('/models/room3/0a07d88a6bb64475a0b043678a73b319.glb')