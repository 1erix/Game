import { useGLTF } from "@react-three/drei";

export default function WallDecoration() {
    const { scene } = useGLTF('/models/room3/geo_wall_decoration.glb')
    return (
        <primitive
            object={scene}
            position={[-3.4, 0.5, 0.5]}
            rotation={[0, 0, 0.01]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/geo_wall_decoration.glb')