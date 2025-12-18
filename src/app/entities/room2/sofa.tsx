import { useGLTF } from "@react-three/drei";

export default function Sofa() {
    const { scene } = useGLTF('/models/room2/jet_set_lounge_sofa.glb')

    return (
        <primitive
            object={scene}
            position={[-3.52, -0.5, 3.52]}
            rotation={[0, 1.5, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/jet_set_lounge_sofa.glb')