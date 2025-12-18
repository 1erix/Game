import { useGLTF } from "@react-three/drei";

export default function TV() {
    const { scene } = useGLTF('/models/room2/tv_with_a_wall_mount.glb')

    return (
        <primitive
            object={scene}
            position={[-4.8, 0.8, 0]}
            rotation={[0, 1.55, 0]}
            scale={0.5}
        />
    )
}

useGLTF.preload('/models/room2/tv_with_a_wall_mount.glb')