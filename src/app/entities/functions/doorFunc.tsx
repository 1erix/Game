'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

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
                    setIconPosition([center.x, center.y + 1.5, center.z + 0.2])
                } else {
                    setIconPosition([door.position[0], door.position[1] + 1.5, door.position[2] + 0.2])
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
        <Html
            position={iconPosition}
            center
            style={{
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
            }}
        >
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateY(-100%)'
            }}>
                <div style={{
                    color: 'white',
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: '2px solid #ff9900',
                    backdropFilter: 'blur(5px)',
                    whiteSpace: 'nowrap',
                    minWidth: '220px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    Нажмите F
                </div>

                <div style={{
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid rgba(0,0,0,0.85)',
                    position: 'relative',
                    top: '-1px'
                }} />
            </div>
        </Html>
    )
}