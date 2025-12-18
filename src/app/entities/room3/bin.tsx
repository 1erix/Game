import { useGLTF } from "@react-three/drei"

export default function Bin() {
    const { scene } = useGLTF('/models/room3/office_bin.glb')

    return (
        <primitive
            object={scene}
            position={[-1.5, -1, 2.5]}
            rotation={[0, 0, 0]}
            scale={0.2}
        />
    )
}

useGLTF.preload('/models/room3/office_bin.glb')