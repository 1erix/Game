import { useGLTF } from "@react-three/drei";

export default function OfficeSofa() {
    const { scene } = useGLTF('/models/room1/juno_5_seater_corner_sofa_marl_grey.glb')

    return (
        <primitive
            object={scene}
            position={[3.3, -0.9, -3]}
            rotation={[0, 4.7, 0]}
            scale={0.015}
        />
    )
}

useGLTF.preload('/models/room1/juno_5_seater_corner_sofa_marl_grey.glb')