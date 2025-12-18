import { useGLTF } from "@react-three/drei";

export default function Kitchen() {
    const { scene } = useGLTF('/models/room2/kitchen_set_3d_model_5.glb')

    return (
        <primitive
            object={scene}
            position={[1.49, -1, 3.1]}
            rotation={[0, 3.12, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/kitchen_set_3d_model_5.glb')