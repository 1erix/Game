import { useGLTF } from "@react-three/drei";

export default function PenOrganizer() {
    const { scene } = useGLTF('/models/room3/office_decor_organiser_pen.glb')
    return (
        <primitive
            object={scene}
            position={[3.3, 0.4, -2.2]}
            rotation={[0, -1.5, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/office_decor_organiser_pen.glb')