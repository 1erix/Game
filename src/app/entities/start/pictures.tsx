import { useGLTF } from "@react-three/drei";

export default function Pictures() {
    const { scene } = useGLTF('/models/pictures.glb')

    return (
        <primitive
            object={scene}
            position={[3.5, 0, 1.5]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.03}
        />
    )
}

useGLTF.preload('/models/pictures.glb')