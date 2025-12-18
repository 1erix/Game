import { useGLTF } from "@react-three/drei";

export default function Flowers() {
    const { scene } = useGLTF('/models/room1/flowers_with_the_vase.glb')

    return (
        <primitive
            object={scene}
            position={[2.6, -0.3, -2.4]}
            rotation={[0, 0, 0]}
            scale={0.5}
        />
    )
}

useGLTF.preload('/models.room1/flowers_with_the_vase.glb')