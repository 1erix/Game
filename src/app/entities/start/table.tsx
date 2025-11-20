import { useGLTF } from "@react-three/drei";

export default function Table() {
    const { scene } = useGLTF('/models/table.glb')

    return (
        <primitive
            object={scene}
            position={[-0.8, -1, 1.6]}
            rotation={[0, 0, 0]}
            scale={0.045}
        />
    )
}

useGLTF.preload('/models/table.glb')