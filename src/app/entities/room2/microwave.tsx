import { useGLTF } from "@react-three/drei";

export default function Microwave() {
    const { scene } = useGLTF('/models/room2/microwave.glb')

    return (
        <primitive
            object={scene}
            position={[2.8, 0.1, 4.7]}
            rotation={[0, 3.15, 0]}
            scale={0.01}
        />
    )
}

useGLTF.preload('/models/room2/microwave.glb')