import { useGLTF } from "@react-three/drei";

export default function WallArt() {
    const { scene } = useGLTF('/models/room2/abstract_wall_art_set__game-ready_3d_models.glb')

    return (
        <primitive
            object={scene}
            position={[5.6, -0.3, -1]}
            rotation={[0, 3.15, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/abstract_wall_art_set__game-ready_3d_models.glb')