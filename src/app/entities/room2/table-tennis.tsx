import { useGLTF } from "@react-three/drei"

interface TennisProps {
    position: [number, number, number],
    rotation: [number, number, number]
}

export default function TennisTable({ position, rotation }: TennisProps) {

    const { scene } = useGLTF('/models/room2/table_tennis.glb')
    return (
        <primitive
            object={scene}
            position={position}
            rotation={rotation}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/table_tennis.glb')