import { useGLTF } from "@react-three/drei";

export default function Sofa() {
    const { scene } = useGLTF('/models/room3/sofa_free.glb')
    return (
        <primitive
            object={scene}
            position={[-2.9, -1, 0.3]}
            rotation={[0, 1.55, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/sofa_free.glb')