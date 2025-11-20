import { useGLTF } from "@react-three/drei";

export default function Monstera() {
    const { scene } = useGLTF('/models/monstera.glb')

    return (
        <primitive
            object={scene}
            position={[-0.3, -0.3, 1.9]}
            rotation={[0, 0, 0]}
            scale={0.7}
        />
    )
}

useGLTF.preload('/models/monstera.glb')