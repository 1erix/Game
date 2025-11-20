import { useGLTF } from "@react-three/drei";

export default function Magazines() {
    const { scene } = useGLTF('/models/magazines.glb')

    return (
        <primitive
            object={scene}
            position={[-0.3, -0.7, 2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.01}
        />
    )
}

useGLTF.preload('/models/magazines.glb')