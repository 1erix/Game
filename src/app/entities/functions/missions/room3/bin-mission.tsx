'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import Paper from '@/app/entities/room3/trash/paper'
import Cups from '@/app/entities/room3/trash/empty-cup'
import Bottle from '@/app/entities/room3/trash/empty-bottle'
import Gum from '@/app/entities/room3/trash/gum'
import Pen from '@/app/entities/room3/trash/pen'
import Pencil from '@/app/entities/room3/trash/pen-pencil'
import Bin from '@/app/entities/room3/bin'

// Глобальное состояние миссии
export const transparencyMission = {
    showHint: false,
    gameActive: false,
    missionComplete: false,
    draggedItems: new Set<string>(),
    targetItems: ['pencil1', 'pen1', 'gum1', 'bottle1', 'cup1', 'paper1'],
    itemsToKeep: ['notebook', 'cleanPaper']
}

// Позиции для миссии
const TABLE_POSITION = new THREE.Vector3(1.5, -1, 1.5)
const TABLE_HEIGHT = 0.12
const BIN_POSITION: [number, number, number] = [-1.2, -1, 2.5]
const BIN_SCALE = 1

// Переменные для управления камерой и игроком
let originalCameraPos: THREE.Vector3 | null = null
let originalCameraRotation: THREE.Euler | null = null
let cameraLocked = false
let playerControls: any = null

// Глобальная переменная для текущего перетаскиваемого предмета
let currentDraggedItem: THREE.Group | null = null

// Функция для фиксации камеры сверху
function lockCameraTopView(camera: THREE.Camera, gl: THREE.WebGLRenderer) {
    console.log('Фиксация камеры сверху')
    cameraLocked = true

    if (!originalCameraPos) {
        originalCameraPos = camera.position.clone()
    }
    if (!originalCameraRotation) {
        originalCameraRotation = camera.rotation.clone()
    }

    document.body.style.cursor = 'default'
    gl.domElement.style.pointerEvents = 'auto'

    const tablePosition = TABLE_POSITION.clone()
    const topViewPosition = new THREE.Vector3(
        tablePosition.x + 0.5,
        tablePosition.y + 3.5,
        tablePosition.z - 2.0
    )

    camera.position.copy(topViewPosition)

    const lookAtPosition = new THREE.Vector3(
        tablePosition.x,
        tablePosition.y + 0.2,
        tablePosition.z
    )
    camera.lookAt(lookAtPosition)

    if (playerControls) {
        playerControls.enabled = false
    }

    const originalCamera = camera as any
    if (originalCamera.userData) {
        originalCamera.userData.originalControlsEnabled = originalCamera.userData.controls?.enabled
    }

    if (originalCamera.updateMatrixWorld) {
        const originalUpdate = originalCamera.updateMatrixWorld
        originalCamera.updateMatrixWorld = function () {
            if (cameraLocked) {
                camera.position.copy(topViewPosition)
                camera.lookAt(lookAtPosition)
            }
            return originalUpdate.apply(this, arguments as any)
        }
    }
}

// Функция для разблокировки камеры
function unlockCamera(camera: THREE.Camera, gl: THREE.WebGLRenderer) {
    console.log('Разблокировка камеры')
    cameraLocked = false

    if (originalCameraPos && originalCameraRotation) {
        camera.position.copy(originalCameraPos)
        camera.rotation.copy(originalCameraRotation)
    }

    document.body.style.cursor = 'none'
    gl.domElement.style.pointerEvents = 'auto'

    if (playerControls) {
        playerControls.enabled = true
    }

    const originalCamera = camera as any
    if (originalCamera.userData && originalCamera.userData.originalControlsEnabled !== undefined) {
        originalCamera.userData.controls.enabled = originalCamera.userData.originalControlsEnabled
    }
}

// React компонент для UI
interface UIState {
    showHint: boolean
    gameActive: boolean
    missionComplete: boolean
    itemsRemaining: number
    totalItems: number
}

export function TransparencyMissionUI() {
    const [state, setState] = useState<UIState>({
        showHint: transparencyMission.showHint,
        gameActive: transparencyMission.gameActive,
        missionComplete: transparencyMission.missionComplete,
        itemsRemaining: transparencyMission.targetItems.length - transparencyMission.draggedItems.size,
        totalItems: transparencyMission.targetItems.length
    })

    useEffect(() => {
        const updateState = () => {
            setState({
                showHint: transparencyMission.showHint,
                gameActive: transparencyMission.gameActive,
                missionComplete: transparencyMission.missionComplete,
                itemsRemaining: transparencyMission.targetItems.length - transparencyMission.draggedItems.size,
                totalItems: transparencyMission.targetItems.length
            })
        }

        const interval = setInterval(updateState, 50)
        const handleProgressUpdate = () => updateState()
        const handleMissionComplete = () => {
            transparencyMission.missionComplete = true
            updateState()
        }

        window.addEventListener('missionProgressUpdate', handleProgressUpdate)
        window.addEventListener('missionComplete', handleMissionComplete)

        return () => {
            clearInterval(interval)
            window.removeEventListener('missionProgressUpdate', handleProgressUpdate)
            window.removeEventListener('missionComplete', handleMissionComplete)
        }
    }, [])

    useEffect(() => {
        if (state.gameActive) {
            document.body.style.cursor = 'default'
        } else if (!state.missionComplete) {
            document.body.style.cursor = 'none'
        }
    }, [state.gameActive, state.missionComplete])

    const handleReset = () => {
        transparencyMission.missionComplete = false
        transparencyMission.gameActive = false
        transparencyMission.draggedItems.clear()
        transparencyMission.showHint = false

        setState({
            showHint: false,
            gameActive: false,
            missionComplete: false,
            itemsRemaining: transparencyMission.targetItems.length,
            totalItems: transparencyMission.targetItems.length
        })

        window.location.reload()
    }

    const handleClose = () => {
        transparencyMission.missionComplete = false
        setState(prev => ({ ...prev, missionComplete: false }))
    }

    return (
        <>
            {/* Подсказка о нажатии F - стили как в ClickSprintMission */}
            {state.showHint && !state.gameActive && !state.missionComplete && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    zIndex: 1000,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: '2px solid #00BCD4',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(5px)',
                    whiteSpace: 'nowrap'
                }}>
                    Нажмите F чтобы начать миссию "Прозрачность"
                </div>
            )}

            {/* Интерфейс во время миссии - стили как в ClickSprintMission */}
            {state.gameActive && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.9)',
                    padding: '15px 25px',
                    borderRadius: '10px',
                    zIndex: 1000,
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    border: '2px solid #3498db',
                    minWidth: '250px',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        fontSize: '20px',
                        marginBottom: '10px',
                        color: '#3498db',
                        fontWeight: 'bold'
                    }}>
                        💎 Миссия: Прозрачность
                    </div>

                    <div style={{
                        fontSize: '18px',
                        marginBottom: '5px'
                    }}>
                        Осталось: <span style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#2ecc71'
                        }}>{state.itemsRemaining}/6</span>
                    </div>

                    <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: state.itemsRemaining === 0 ? '#2ecc71' : '#3498db',
                        margin: '10px 0',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {state.itemsRemaining}
                    </div>

                    <div style={{
                        fontSize: '14px',
                        opacity: 0.8,
                        marginTop: '10px'
                    }}>
                        Перетащите мусор в корзину
                    </div>
                </div>
            )}

            {/* Сообщение об успехе - стили как в ClickSprintMission */}
            {state.missionComplete && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.95)',
                    padding: '30px',
                    borderRadius: '15px',
                    zIndex: 1000,
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    border: '3px solid #2ecc71',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
                }}>
                    <div style={{
                        fontSize: '28px',
                        marginBottom: '20px',
                        color: '#2ecc71',
                        fontWeight: 'bold'
                    }}>
                        🎉 Миссия выполнена!
                    </div>

                    <div style={{
                        fontSize: '18px',
                        marginBottom: '25px'
                    }}>
                        Вы навели порядок на рабочем столе!
                    </div>

                    <div style={{
                        fontSize: '16px',
                        marginBottom: '20px',
                        color: '#3498db',
                        padding: '10px',
                        background: 'rgba(52, 152, 219, 0.1)',
                        borderRadius: '8px'
                    }}>
                        <strong>💎 Ценность компании: Прозрачность</strong>
                        <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.9 }}>
                            Прозрачность начинается с ясности и порядка на рабочем месте,
                            устранения всего лишнего, что мешает сосредоточиться на сути.
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '15px',
                        marginTop: '20px'
                    }}>
                        <button
                            onClick={handleClose}
                            style={{
                                padding: '10px 20px',
                                background: 'linear-gradient(45deg, #4CAF50, #2ecc71)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Отлично!
                        </button>

                        <button
                            onClick={handleReset}
                            style={{
                                padding: '10px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                                e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            Начать заново
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

// Компонент корзины
function TrashBin() {
    const { scene } = useThree()
    const [hovered, setHovered] = useState(false)
    const [highlighted, setHighlighted] = useState(false)
    const highlightTimer = useRef<NodeJS.Timeout>()
    const trashBinRef = useRef<THREE.Group>(null)

    useEffect(() => {
        if (transparencyMission.gameActive && !transparencyMission.missionComplete) {
            highlightTimer.current = setInterval(() => {
                setHighlighted(prev => !prev)
            }, 1000)
        } else {
            setHighlighted(false)
        }

        return () => {
            if (highlightTimer.current) clearInterval(highlightTimer.current)
        }
    }, [transparencyMission.gameActive, transparencyMission.missionComplete])

    useFrame(() => {
        if (!transparencyMission.gameActive || transparencyMission.missionComplete) return

        const trashBin = trashBinRef.current
        if (!trashBin) return

        const binBox = new THREE.Box3().setFromObject(trashBin)

        transparencyMission.targetItems.forEach(itemName => {
            const item = scene.getObjectByName(itemName)
            if (item && item.userData?.isDragging) {
                const itemBox = new THREE.Box3().setFromObject(item)
                const intersects = binBox.intersectsBox(itemBox)

                if (intersects) {
                    setHovered(true)
                } else if (hovered) {
                    setHovered(false)
                }
            }
        })
    })

    return (
        <group
            ref={trashBinRef}
            name="trashBin"
            position={BIN_POSITION}
            scale={BIN_SCALE}
            onPointerOver={() => {
                if (transparencyMission.gameActive && !transparencyMission.missionComplete) {
                    setHovered(true)
                }
            }}
            onPointerOut={() => setHovered(false)}
        >
            <Bin />

            {hovered && (
                <>
                    <pointLight
                        position={[0, 1, 0]}
                        intensity={1.5}
                        color="#4CAF50"
                        distance={3}
                    />
                </>
            )}

            {transparencyMission.gameActive && !transparencyMission.missionComplete && (
                <pointLight
                    position={[0, 0.5, 0]}
                    intensity={0.3}
                    color="#FF9800"
                    distance={2}
                />
            )}

            {highlighted && (
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshBasicMaterial
                        color="#FF9800"
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            )}
        </group>
    )
}

// Компонент предмета для перетаскивания
interface DraggableItemProps {
    name: string
    position: [number, number, number]
    type: 'pencil' | 'pen' | 'gum' | 'bottle' | 'cup' | 'paper' | 'notebook' | 'cleanPaper'
    onDragStart?: () => void
    onDragEnd?: (success: boolean) => void
}

function DraggableItem({ name, position, type, onDragStart, onDragEnd }: DraggableItemProps) {
    const { scene, camera, gl } = useThree()
    const [isDragging, setIsDragging] = useState(false)
    const [isInTrash, setIsInTrash] = useState(false)
    const [isRemoved, setIsRemoved] = useState(false)
    const [originalPosition] = useState(new THREE.Vector3(...position))
    const dragPlane = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), -position[1]))
    const raycaster = useRef(new THREE.Raycaster())
    const mouse = useRef(new THREE.Vector2())
    const itemRef = useRef<THREE.Group>(null)
    const dragOffset = useRef(new THREE.Vector3())
    const isDraggingStarted = useRef(false)
    const currentHeight = useRef(position[1])
    const binWorldPosition = useRef<THREE.Vector3 | null>(null)

    // Улучшенная функция для проверки находится ли предмет в корзине
    const checkIfInTrash = (): boolean => {
        if (!itemRef.current) return false

        const trashBin = scene.getObjectByName('trashBin')
        if (!trashBin) return false

        // Получаем мировые позиции
        const itemWorldPos = new THREE.Vector3()
        itemRef.current.getWorldPosition(itemWorldPos)

        const binWorldPos = new THREE.Vector3()
        trashBin.getWorldPosition(binWorldPos)

        // Сохраняем позицию корзины для анимации
        binWorldPosition.current = binWorldPos

        // Определяем размеры корзины
        const binRadius = 0.5
        const binHeight = 1.0

        // Проверяем расстояние по горизонтали
        const horizontalDistance = Math.sqrt(
            Math.pow(itemWorldPos.x - binWorldPos.x, 2) +
            Math.pow(itemWorldPos.z - binWorldPos.z, 2)
        )

        // Проверяем высоту
        const verticalDistance = Math.abs(itemWorldPos.y - binWorldPos.y)

        return horizontalDistance < binRadius && verticalDistance < binHeight
    }

    // Обработчик начала перетаскивания
    const handlePointerDown = (e: any) => {
        e.stopPropagation()

        if (!transparencyMission.gameActive || transparencyMission.missionComplete || isRemoved) return

        setIsDragging(true)
        isDraggingStarted.current = true

        if (itemRef.current) {
            itemRef.current.userData.isDragging = true
            currentDraggedItem = itemRef.current
        }

        if (onDragStart) onDragStart()

        const worldPos = new THREE.Vector3()
        e.object.getWorldPosition(worldPos)
        currentHeight.current = worldPos.y

        const mouseX = (e.clientX / window.innerWidth) * 2 - 1
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1
        mouse.current.set(mouseX, mouseY)
        raycaster.current.setFromCamera(mouse.current, camera)

        const intersectionPoint = new THREE.Vector3()
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -worldPos.y)
        raycaster.current.ray.intersectPlane(plane, intersectionPoint)

        if (intersectionPoint) {
            dragOffset.current.copy(worldPos).sub(intersectionPoint)
        }

        dragPlane.current.constant = -worldPos.y
        gl.domElement.style.cursor = 'grabbing'
    }

    // Обновление позиции при перетаскивании
    useFrame((state) => {
        if (!isDragging || !itemRef.current || !isDraggingStarted.current) return

        const mouseX = state.pointer.x
        const mouseY = state.pointer.y
        mouse.current.set(mouseX, mouseY)

        raycaster.current.setFromCamera(mouse.current, camera)

        const intersectionPoint = new THREE.Vector3()
        const intersects = raycaster.current.ray.intersectPlane(dragPlane.current, intersectionPoint)

        if (intersects && intersectionPoint) {
            const newPosition = intersectionPoint.clone().add(dragOffset.current)
            newPosition.y = currentHeight.current
            newPosition.y = Math.min(2.0, newPosition.y)

            itemRef.current.position.lerp(newPosition, 0.3)

            const isActuallyInTrashNow = checkIfInTrash()

            if (isActuallyInTrashNow !== isInTrash) {
                setIsInTrash(isActuallyInTrashNow)

                if (isActuallyInTrashNow) {
                    itemRef.current.scale.setScalar(1.1)
                } else {
                    itemRef.current.scale.setScalar(1)
                }
            }
        }
    })

    // Обработчик отпускания мыши - исправленная версия
    const handlePointerUp = () => {
        if (!isDragging) return

        setIsDragging(false)
        isDraggingStarted.current = false

        if (itemRef.current) {
            itemRef.current.userData.isDragging = false
            if (currentDraggedItem === itemRef.current) {
                currentDraggedItem = null
            }
            itemRef.current.scale.setScalar(1)
        }

        // Проверяем, находился ли предмет в корзине в момент отпускания
        const isActuallyInTrash = checkIfInTrash()

        if (isActuallyInTrash && transparencyMission.targetItems.includes(name)) {
            console.log(`🎯 Предмет "${name}" попал в корзину!`)

            setIsRemoved(true)

            if (!transparencyMission.draggedItems.has(name)) {
                transparencyMission.draggedItems.add(name)
                console.log(`✅ Предмет "${name}" удален. Всего удалено: ${transparencyMission.draggedItems.size}/${transparencyMission.targetItems.length}`)

                window.dispatchEvent(new CustomEvent('missionProgressUpdate'));

                // Визуальная обратная связь
                if (itemRef.current) {
                    // Анимация падения в корзину
                    const targetPosition = new THREE.Vector3(
                        binWorldPosition.current?.x || -1.2,
                        binWorldPosition.current?.y || -1,
                        binWorldPosition.current?.z || 2.5
                    )

                    const startPosition = itemRef.current.position.clone()
                    const duration = 300
                    const startTime = Date.now()

                    const animateFall = () => {
                        const elapsed = Date.now() - startTime
                        const progress = Math.min(elapsed / duration, 1)

                        if (itemRef.current && progress < 1) {
                            const newPos = new THREE.Vector3()
                            newPos.lerpVectors(startPosition, targetPosition, progress)

                            const parabolaHeight = 0.5
                            const t = progress
                            newPos.y += parabolaHeight * Math.sin(Math.PI * t)

                            itemRef.current.position.copy(newPos)

                            itemRef.current.scale.setScalar(1 - progress * 0.5)

                            requestAnimationFrame(animateFall)
                        } else if (itemRef.current) {
                            itemRef.current.visible = false
                        }
                    }

                    animateFall()
                }
            }

            if (onDragEnd) onDragEnd(true)

            // Проверяем завершение миссии
            if (transparencyMission.draggedItems.size === transparencyMission.targetItems.length) {
                setTimeout(() => {
                    transparencyMission.missionComplete = true
                    transparencyMission.gameActive = false
                    console.log('🎉 Все предметы убраны! Миссия завершена!')
                    window.dispatchEvent(new CustomEvent('missionComplete'));
                }, 500)
            }
        } else {
            console.log(`❌ Предмет "${name}" не попал в корзину`)

            if (itemRef.current) {
                const startPos = itemRef.current.position.clone()
                const endPos = originalPosition.clone()

                const animateReturn = (progress: number) => {
                    if (!itemRef.current || isRemoved) return

                    const newPos = new THREE.Vector3()
                    newPos.lerpVectors(startPos, endPos, progress)
                    itemRef.current.position.copy(newPos)

                    if (progress < 1) {
                        requestAnimationFrame(() => animateReturn(progress + 0.1))
                    }
                }

                animateReturn(0)
            }

            if (onDragEnd) onDragEnd(false)
        }

        setIsInTrash(false)
        gl.domElement.style.cursor = 'default'
    }

    // Настройка событий мыши и клавиатуры
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handlePointerUp()
            }
        }

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging && itemRef.current) {
                const mouseX = (e.clientX / window.innerWidth) * 2 - 1
                const mouseY = -(e.clientY / window.innerHeight) * 2 + 1
                mouse.current.set(mouseX, mouseY)
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isDragging || !itemRef.current || itemRef.current !== currentDraggedItem) return

            const step = 0.1

            if (e.key === 'ArrowUp') {
                currentHeight.current = Math.min(currentHeight.current + step, 2.0)
                dragPlane.current.constant = -currentHeight.current
                e.preventDefault()
            } else if (e.key === 'ArrowDown') {
                currentHeight.current = Math.max(currentHeight.current - step)
                dragPlane.current.constant = -currentHeight.current
                e.preventDefault()
            }
        }

        window.addEventListener('mouseup', handleGlobalMouseUp)
        window.addEventListener('mousemove', handleGlobalMouseMove)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp)
            window.removeEventListener('mousemove', handleGlobalMouseMove)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isDragging, isInTrash, isRemoved])

    // Определяем какой компонент рендерить
    const renderModel = () => {
        switch (type) {
            case 'pencil':
                return (
                    <group rotation={[0, Math.PI / 2, 0]} >
                        <Pencil position={[0, 0, 0]} />
                    </group>
                )
            case 'pen':
                return (
                    <group rotation={[0, Math.PI / 2, 0]} >
                        <Pen position={[0, 0.6, 0]} />
                    </group>
                )
            case 'gum':
                return (
                    <group >
                        <Gum position={[0, 0.6, 0]} />
                    </group>
                )
            case 'bottle':
                return (
                    <group >
                        <Bottle position={[0, 0.6, -1]} />
                    </group>
                )
            case 'cup':
                return (
                    <group >
                        <Cups position={[0, 0.6, 0]} />
                    </group>
                )
            case 'paper':
                return (
                    <group >
                        <Paper position={[0, 0.7, 0]} />
                    </group>
                )
            default:
                return (
                    <mesh>
                        <boxGeometry args={[0.1, 0.1, 0.1]} />
                        <meshStandardMaterial color="gray" />
                    </mesh>
                )
        }
    }

    if (isRemoved) return null

    return (
        <group
            ref={itemRef}
            name={name}
            position={position}
            onPointerDown={handlePointerDown}
            onPointerOver={() => {
                if (transparencyMission.gameActive &&
                    !transparencyMission.missionComplete &&
                    !isRemoved &&
                    !isDragging) {
                    gl.domElement.style.cursor = 'grab'
                }
            }}
            onPointerOut={() => {
                if (!isDragging && transparencyMission.gameActive) {
                    gl.domElement.style.cursor = 'default'
                }
            }}
        >
            {renderModel()}

            {isDragging && (
                <pointLight
                    position={[0, 0.2, 0]}
                    intensity={0.5}
                    color={isInTrash ? '#4CAF50' : '#FF9800'}
                    distance={1}
                />
            )}

            {isDragging && (
                <Html
                    position={[0, 0.5, 0]}
                    center
                    style={{
                        pointerEvents: 'none',
                        fontSize: '16px',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                        opacity: 0.9,
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div style={{
                        background: isInTrash ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 152, 0, 0.9)',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        transform: isInTrash ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s ease'
                    }}>
                        {isInTrash ? '✓' : '↑↓'}
                    </div>
                    <div style={{
                        marginTop: '5px',
                        fontSize: '12px',
                        color: 'white',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '3px 6px',
                        borderRadius: '4px'
                    }}>
                        Стрелки ↑/↓ для высоты
                    </div>
                </Html>
            )}
        </group>
    )
}

// Компонент иконки задания - стили как в ClickSprintMission
interface MissionIconProps {
    visible?: boolean
}

function MissionIcon({ visible = true }: MissionIconProps) {
    if (!visible) return null

    const completed = transparencyMission.missionComplete

    return (
        <Html
            position={[TABLE_POSITION.x, TABLE_POSITION.y + 0.8, TABLE_POSITION.z]}
            center
            style={{
                pointerEvents: 'none',
                userSelect: 'none'
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translate(-50%, -50%)'
            }}>
                {/* Основная иконка */}
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: completed
                        ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                        : 'linear-gradient(135deg, #00BCD4, #0097A7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: completed
                        ? '0 8px 20px rgba(46, 204, 113, 0.4)'
                        : '0 8px 20px rgba(0, 188, 212, 0.4)',
                    border: completed
                        ? '2px solid #2ecc71'
                        : '2px solid #00BCD4',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Внутренний круг */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Иконка */}
                        {completed ? (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                            >
                                <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8V12" strokeLinecap="round" />
                                <path d="M12 16H12.01" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>

                    {/* Анимация пульсации для активного задания */}
                    {!completed && !transparencyMission.gameActive && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '12px',
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            animation: 'pulse 2s infinite'
                        }} />
                    )}
                </div>

                {/* Текст под иконкой */}
                <div style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: completed ? '#2ecc71' : '#00BCD4',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap'
                }}>
                    {completed ? 'ВЫПОЛНЕНО' : 'ЗАДАНИЕ'}
                </div>

                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.05); opacity: 0.2; }
                        100% { transform: scale(1); opacity: 0.5; }
                    }
                `}</style>
            </div>
        </Html>
    )
}

// Интерфейс для предмета
interface ItemData {
    id: string
    name: string
    position: [number, number, number]
    type: 'pencil' | 'pen' | 'gum' | 'bottle' | 'cup' | 'paper' | 'notebook' | 'cleanPaper'
}

// Основной компонент миссии
export default function TransparencyMission() {
    const { scene, camera, gl } = useThree()
    const [items, setItems] = useState<ItemData[]>([])

    // Фрейм для принудительной фиксации камеры
    useFrame(() => {
        if (cameraLocked) {
            const tablePosition = TABLE_POSITION.clone()
            const topViewPosition = new THREE.Vector3(
                tablePosition.x + 0.5,
                tablePosition.y + 3.5,
                tablePosition.z - 2.0
            )

            camera.position.copy(topViewPosition)

            const lookAtPosition = new THREE.Vector3(
                tablePosition.x,
                tablePosition.y + 0.2,
                tablePosition.z
            )
            camera.lookAt(lookAtPosition)

            if (camera.matrixAutoUpdate) {
                camera.matrixAutoUpdate = false
            }
        } else {
            if (!camera.matrixAutoUpdate) {
                camera.matrixAutoUpdate = true
            }
        }
    })

    // Инициализация предметов
    useEffect(() => {
        console.log('Инициализация миссии прозрачности')

        const player = scene.getObjectByName('player')
        if (player && player.userData && player.userData.controls) {
            playerControls = player.userData.controls
        }

        const initialItems: ItemData[] = [
            // Мусор (для удаления)
            {
                id: 'pencil1', name: 'pencil1', position: [
                    TABLE_POSITION.x - 0.4,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z + 0.1
                ] as [number, number, number], type: 'pencil'
            },
            {
                id: 'pen1', name: 'pen1', position: [
                    TABLE_POSITION.x + 0.3,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z + 0.15
                ] as [number, number, number], type: 'pen'
            },
            {
                id: 'gum1', name: 'gum1', position: [
                    TABLE_POSITION.x + 0.4,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z - 0.1
                ] as [number, number, number], type: 'gum'
            },
            {
                id: 'bottle1', name: 'bottle1', position: [
                    TABLE_POSITION.x - 0.3,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z + 0.3
                ] as [number, number, number], type: 'bottle'
            },
            {
                id: 'cup1', name: 'cup1', position: [
                    TABLE_POSITION.x + 0.2,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z + 0.25
                ] as [number, number, number], type: 'cup'
            },
            {
                id: 'paper1', name: 'paper1', position: [
                    TABLE_POSITION.x - 0.1,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z + 0.35
                ] as [number, number, number], type: 'paper'
            },

            // Предметы которые должны остаться
            {
                id: 'notebook', name: 'notebook', position: [
                    TABLE_POSITION.x - 0.2,
                    TABLE_POSITION.y + TABLE_HEIGHT,
                    TABLE_POSITION.z - 0.05
                ] as [number, number, number], type: 'notebook'
            },
            {
                id: 'cleanPaper', name: 'cleanPaper', position: [
                    TABLE_POSITION.x + 0.1,
                    TABLE_POSITION.y + TABLE_HEIGHT - 0.005,
                    TABLE_POSITION.z + 0.05
                ] as [number, number, number], type: 'cleanPaper'
            },
        ]

        setItems(initialItems)
        transparencyMission.draggedItems.clear()

        return () => {
            if (cameraLocked) {
                unlockCamera(camera, gl)
            }
        }
    }, [scene, camera, gl])

    // Проверка близости к столу
    useFrame(() => {
        if (transparencyMission.gameActive || transparencyMission.missionComplete) return

        const player = scene.getObjectByName('player')
        if (!player) return

        const playerPos = new THREE.Vector3()
        player.getWorldPosition(playerPos)

        const distance = playerPos.distanceTo(TABLE_POSITION)
        const isNear = distance < 2.5

        if (isNear !== transparencyMission.showHint) {
            transparencyMission.showHint = isNear
        }
    })

    // Обработка клавиши F
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()
            if ((key === 'f' || key === 'а') &&
                transparencyMission.showHint &&
                !transparencyMission.gameActive &&
                !transparencyMission.missionComplete) {
                startMission()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    const startMission = () => {
        console.log('Начало миссии прозрачности')
        transparencyMission.gameActive = true
        transparencyMission.draggedItems.clear()

        lockCameraTopView(camera, gl)
    }

    const handleItemDragged = (itemName: string, success: boolean) => {
        console.log(`🔄 Обработка предмета "${itemName}", успех: ${success}`)

        if (success && transparencyMission.targetItems.includes(itemName)) {
            console.log(`📌 Предмет "${itemName}" должен быть удален`)

            if (!transparencyMission.draggedItems.has(itemName)) {
                transparencyMission.draggedItems.add(itemName)
                console.log(`✅ Предмет "${itemName}" добавлен. Всего: ${transparencyMission.draggedItems.size}`)
            } else {
                console.log(`⚠️ Предмет "${itemName}" уже был добавлен`)
            }

            if (transparencyMission.draggedItems.size === transparencyMission.targetItems.length) {
                console.log('🎉 Миссия завершена! Все предметы удалены.')
                completeMission()
            }
        }
    }

    const completeMission = () => {
        console.log('Миссия прозрачности выполнена!')
        transparencyMission.gameActive = false
        transparencyMission.missionComplete = true

        unlockCamera(camera, gl)
    }

    return (
        <>
            <MissionIcon visible={!transparencyMission.gameActive} />
            <TrashBin />

            {items.map(item => (
                <DraggableItem
                    key={item.id}
                    name={item.name}
                    position={item.position}
                    type={item.type}
                    onDragEnd={(success) => handleItemDragged(item.name, success)}
                />
            ))}
        </>
    )
}