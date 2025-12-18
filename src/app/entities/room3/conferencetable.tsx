import { useGLTF } from "@react-three/drei";

export default function ConferenceTable() {
    const { scene } = useGLTF('/models/room3/conference_table_-_rectangular_6m.glb')
    return (
        <primitive
            object={scene}
            position={[1.5, -1, 1.5]}
            rotation={[0, 0, 0]}
            scale={0.7}
        />
    )
}

useGLTF.preload('/models/room3/conference_table_-_rectangular_6m.glb')