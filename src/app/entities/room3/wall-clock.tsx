import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect } from "react"

interface ClockProps {
    position: [number, number, number],
    rotation: [number, number, number]
}

export default function Clock({ position, rotation }: ClockProps) {

    const { scene, animations } = useGLTF('/models/room3/wall_clock.glb')
    const { actions } = useAnimations(animations, scene)

    useEffect(() => {

        const Animation = actions['Animation']

        if (Animation) {
            Animation.play()
        }

        return () => {
            Object.values(actions).forEach(action => action?.stop())
        }
    }, [actions])

    return (
        <primitive
            object={scene}
            position={position}
            rotation={rotation}
            scale={0.1}
        />
    )
}

useGLTF.preload('/models/room3/wall_clock.glb')