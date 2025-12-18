import { useTexture } from "@react-three/drei"
import { RepeatWrapping } from 'three'
import { useMemo } from "react"

interface FloorProps {
    widthSize: number,
    heightSize: number,
}

export default function Room2Floor({ widthSize, heightSize, }: FloorProps) {
    const baseTexture = useTexture('/models/textures/laminate_floor_02_diff_2k.webp')
    const floorTexture = useMemo(() => {
        const tex = baseTexture.clone()
        tex.wrapS = tex.wrapT = RepeatWrapping
        tex.repeat.set(10, 10)
        tex.needsUpdate = true
        return tex
    }, [baseTexture])
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
            userData={{ isFloor: true }}>
            <planeGeometry args={[widthSize, heightSize]} />
            <meshStandardMaterial map={floorTexture} />
        </mesh>
    )
}