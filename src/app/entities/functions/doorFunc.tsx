'use client'

import { Text } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

interface DoorInteractionProps {
    doorPositions: Array<{
        position: [number, number, number]
        onInteract: () => void
    }>
}

export default function DoorInteraction({ doorPositions }: DoorInteractionProps) {
    const { scene } = useThree()
    const [showIcon, setShowIcon] = useState(false)
    const [currentDoor, setCurrentDoor] = useState<number | null>(null)
    const [iconPosition, setIconPosition] = useState<[number, number, number]>([0, 0, 0])

    const showIconRef = useRef(showIcon)
    const currentDoorRef = useRef(currentDoor)

    useEffect(() => {
        showIconRef.current = showIcon
        currentDoorRef.current = currentDoor
    }, [showIcon, currentDoor])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const isFKey = event.key === 'f' || event.key === 'F' || event.key === 'а' || event.key === 'А'

            if (isFKey && showIconRef.current && currentDoorRef.current !== null) {
                setTimeout(() => {
                    doorPositions[currentDoorRef.current!].onInteract()
                }, 0)
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [doorPositions])

    useFrame(() => {
        const player = scene.getObjectByName('player')
        if (!player) {
            setShowIcon(false)
            return
        }

        const playerPos = player.position
        let closestDoor: number | null = null
        let minDistance = Infinity

        doorPositions.forEach((door, index) => {
            const doorPosition = new THREE.Vector3(...door.position)
            const distance = playerPos.distanceTo(doorPosition)

            if (distance < 2 && distance < minDistance) {
                minDistance = distance
                closestDoor = index

                const doorObject = scene.getObjectByName(`door${index}`)
                if (doorObject) {
                    const bbox = new THREE.Box3().setFromObject(doorObject)
                    const center = new THREE.Vector3()
                    bbox.getCenter(center)
                    setIconPosition([center.x, center.y + 1, center.z + 0.2])
                } else {
                    setIconPosition([door.position[0], door.position[1] + 1, door.position[2] + 0.2])
                }
            }
        })

        if (closestDoor !== null) {
            setShowIcon(true)
            setCurrentDoor(closestDoor)
        } else {
            setShowIcon(false)
            setCurrentDoor(null)
        }
    })

    if (!showIcon) return null

    return (
        <Text
            position={iconPosition}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="black"
        >
            [F]
        </Text>
    )
}