import { useGLTF } from "@react-three/drei";

export default function MacBook() {
    const { scene } = useGLTF('/models/room3/macbook_pro_2021.glb')
    return (
        <primitive
            object={scene}
            position={[2.6, -0.25, 1]}
            rotation={[0, -2, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/macbook_pro_2021.glb')