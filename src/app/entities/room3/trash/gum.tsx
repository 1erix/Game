import { useGLTF } from "@react-three/drei"

interface GumProps {
    position: [number, number, number]
}

export default function Gum({ position }: GumProps) {
    const { scene } = useGLTF('/models/room3/trash/chewing_gum_jar.glb')

    return (
        <primitive
            object={scene}
            position={position}
            scale={0.1}
        />
    )
}

useGLTF.preload('/models/room3/trash/chewing_gum_jar.glb')