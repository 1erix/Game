import { useGLTF } from "@react-three/drei";

export default function Carpet() {
    const { scene } = useGLTF('/models/carpet.glb')

    return (
        <primitive
            object={scene}
            position={[-0.2, -1, -1]}
            rotation={[0, 0, 0]}
            scale={1.5} />
    )
}

useGLTF.preload('/models/carpet.glb')