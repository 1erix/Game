import { useGLTF } from "@react-three/drei"

interface PaperProps {
    position: [number, number, number]
}

export default function Paper({ position }: PaperProps) {
    const { scene } = useGLTF('/models/room3/trash/crumpled_up_paper.glb')

    return (
        <primitive
            object={scene}
            position={position}
            scale={0.05}
        />
    )
}

useGLTF.preload('/models/room3/trash/crumpled_up_paper.glb')