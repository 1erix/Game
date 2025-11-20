import { useGLTF } from "@react-three/drei";

export default function BusinessCards() {
    const { scene } = useGLTF('/models/business_card.glb')

    return (
        <primitive
            object={scene}
            position={[0.6, -0.3, 1.9]}
            rotation={[0, Math.PI / 1, 0]}
            scale={1.5}
        />
    )
}

useGLTF.preload('/models/business_card.glb')