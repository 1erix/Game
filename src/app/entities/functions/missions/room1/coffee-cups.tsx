// app/entities/functions/missions/room1/coffee-cups.tsx
'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import CoffeeCups from '@/app/entities/room1/coffee-cups'

// === ПРОСТАЯ СИСТЕМА ДОСТИЖЕНИЙ (встроенная) ===
const ALL_MISSIONS = ['click-sprint-mission', 'computer-speed-mission']

// Функция для отметки выполнения миссии
const markMissionComplete = (missionId: string) => {
    // Сохраняем в localStorage
    localStorage.setItem(`mission-${missionId}`, 'completed')

    // Проверяем все ли миссии выполнены
    const allCompleted = ALL_MISSIONS.every(id =>
        localStorage.getItem(`mission-${id}`) === 'completed'
    )

    if (allCompleted && !localStorage.getItem('speed-achievement-shown')) {
        // Показываем достижение через 1 секунду
        setTimeout(() => {
            const event = new CustomEvent('show-achievement')
            window.dispatchEvent(event)
            localStorage.setItem('speed-achievement-shown', 'true')
        }, 1000)
    }
}

// Хук для миссии
const useSimpleMission = (missionId: string) => {
    const complete = () => {
        markMissionComplete(missionId)
    }

    const isCompleted = () => {
        return localStorage.getItem(`mission-${missionId}`) === 'completed'
    }

    return { complete, isCompleted }
}
// === КОНЕЦ СИСТЕМЫ ДОСТИЖЕНИЙ ===

// Простое глобальное состояние для связи между компонентами
const missionGlobal = {
    showHint: false,
    gameActive: false,
    missionComplete: false, // ТОЛЬКО для текущей сессии
    timer: 20,
    cupsRemaining: 3,
    showCompletionMessage: false,
    wasPreviouslyCompleted: false // Флаг для хранения информации о прошлых выполнениях
}

// Компонент иконки задания
function MissionIcon({ completed = false, visible = true }) {
    if (!visible) return null

    return (
        <Html
            position={[2.6, 0.5, -2.4]} // Над столом
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
                        : 'linear-gradient(135deg, #ff9900, #ff6600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: completed
                        ? '0 8px 20px rgba(46, 204, 113, 0.4)'
                        : '0 8px 20px rgba(255, 153, 0, 0.4)',
                    border: completed
                        ? '2px solid #2ecc71'
                        : '2px solid #ff9900',
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
                    {!completed && !missionGlobal.gameActive && (
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
                    color: completed ? '#2ecc71' : '#ff9900',
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

export default function ClickSprintMission() {
    const { scene, camera } = useThree()
    const [cups, setCups] = useState<Array<{ id: number, position: [number, number, number] }>>([])
    const timerRef = useRef<NodeJS.Timeout>()
    const cameraLocked = useRef(false)
    const playerRef = useRef<THREE.Object3D | null>(null)
    const playerControlsRef = useRef<any>(null)

    // Используем простой хук для достижения (встроенный в этот файл)
    const { complete, isCompleted } = useSimpleMission('click-sprint-mission')

    // Рефы для управления камерой
    const originalCameraPos = useRef<THREE.Vector3>(new THREE.Vector3())
    const originalCameraRotation = useRef<THREE.Euler>(new THREE.Euler())
    const cameraRotationAngle = useRef(0)
    const isCameraTopView = useRef(false)

    // 1. Инициализация - ВСЕГДА показываем задание как НЕ ВЫПОЛНЕННОЕ при загрузке
    useEffect(() => {
        console.log('Инициализация миссии скорости - ВСЕГДА НАЧИНАЕМ С НАЧАЛА')

        // ПРИ ЗАГРУЗКЕ ВСЕГДА СБРАСЫВАЕМ ВСЕ СОСТОЯНИЯ
        missionGlobal.missionComplete = false
        missionGlobal.showCompletionMessage = false
        missionGlobal.gameActive = false
        missionGlobal.showHint = false
        missionGlobal.cupsRemaining = 3
        missionGlobal.timer = 20

        // Запоминаем, была ли миссия выполнена ранее (только для информации)
        missionGlobal.wasPreviouslyCompleted = isCompleted()

        // Находим игрока
        const player = scene.getObjectByName('player')
        if (player) {
            playerRef.current = player
            // Сохраняем контролы игрока если они есть
            if (player.userData && player.userData.controls) {
                playerControlsRef.current = player.userData.controls
            }
        }

        // Сохраняем исходное положение камеры
        originalCameraPos.current.copy(camera.position)
        originalCameraRotation.current.copy(camera.rotation)

        // ВСЕГДА создаем 3 кружки при загрузке, даже если миссия была пройдена ранее
        const initialCups = [
            { id: 1, position: [2.4, 0.1, -2.3] as [number, number, number] },
            { id: 2, position: [2.6, 0.1, -2.4] as [number, number, number] },
            { id: 3, position: [2.8, 0.1, -2.5] as [number, number, number] }
        ]

        setCups(initialCups)
        missionGlobal.cupsRemaining = initialCups.length

        console.log('Миссия инициализирована как НЕВЫПОЛНЕННАЯ, кружки созданы')

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            // Всегда разблокируем камеру при размонтировании
            unlockCamera()
        }
    }, [scene, camera])

    // 2. Проверка близости игрока к столу
    useFrame(() => {
        if (missionGlobal.gameActive) return

        const player = scene.getObjectByName('player')
        if (!player) return

        const playerPos = new THREE.Vector3()
        player.getWorldPosition(playerPos)

        const TABLE_POSITION = new THREE.Vector3(2.6, 0, -2.4)
        const distance = playerPos.distanceTo(TABLE_POSITION)
        const isNear = distance < 2.5

        if (isNear !== missionGlobal.showHint) {
            missionGlobal.showHint = isNear
        }
    })

    // 3. Обработка клавиши F
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()
            if ((key === 'f' || key === 'а') &&
                missionGlobal.showHint &&
                !missionGlobal.gameActive &&
                !missionGlobal.missionComplete) {
                startMission()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    // Фиксация камеры сверху (исправленная версия)
    const lockCameraTopView = () => {
        console.log('Фиксация камеры сверху без вращения')
        cameraLocked.current = true
        isCameraTopView.current = false // Отключаем вращение

        // Показываем курсор
        document.body.style.cursor = 'default'

        // Отключаем движение игрока через его контролы
        if (playerControlsRef.current) {
            playerControlsRef.current.enabled = false
        }

        // Устанавливаем камеру сверху (ближе к столу, без вращения)
        const tablePosition = new THREE.Vector3(2.6, 0, -2.4)

        // Фиксированная позиция камеры сверху (ближе, чтобы лучше видеть кружки)
        const topViewPosition = new THREE.Vector3(
            tablePosition.x,
            tablePosition.y + 2.5, // Опускаем камеру ниже (было 5)
            tablePosition.z + 1.5  // Сдвигаем немного назад для лучшего обзора
        )

        // Мгновенно устанавливаем позицию камеры (без lerp)
        camera.position.copy(topViewPosition)

        // Направляем камеру на стол (немного под углом)
        camera.lookAt(tablePosition.x, tablePosition.y + 0.2, tablePosition.z)

        // Сохраняем позицию для разблокировки
        originalCameraPos.current.copy(topViewPosition)

        // Отключаем все анимации камеры
        camera.matrixAutoUpdate = false
        camera.updateMatrix()
    }

    // Разблокировка камеры и игрока
    const unlockCamera = () => {
        console.log('Разблокировка камеры и игрока')
        cameraLocked.current = false
        isCameraTopView.current = false

        // Включаем обновление матрицы камеры
        camera.matrixAutoUpdate = true

        // Скрываем курсор
        document.body.style.cursor = 'none'

        // Включаем движение игрока
        if (playerControlsRef.current) {
            playerControlsRef.current.enabled = true
        }
    }

    // 4. Фиксация камеры во время игры (убираем вращение)
    useFrame((state, delta) => {
        if (!cameraLocked.current) return

        // Когда камера зафиксирована, просто оставляем её на месте
        // Не делаем никаких анимаций или вращений
    })

    // 4. Начало миссии
    const startMission = () => {
        console.log('Начало миссии скорости')

        // Фиксируем камеру сверху
        lockCameraTopView()

        // Меняем состояние
        missionGlobal.gameActive = true
        missionGlobal.timer = 20

        // Очищаем старые кружки и создаем 10 новых
        setCups([])

        // Небольшая задержка перед созданием новых кружек
        setTimeout(() => {
            const missionCups = []
            for (let i = 0; i < 10; i++) {
                missionCups.push({
                    id: 10 + i,
                    position: [
                        2.6 + (Math.random() - 0.5) * 0.4, // Уменьшаем разброс
                        0.1,
                        -2.4 + (Math.random() - 0.5) * 0.4  // Уменьшаем разброс
                    ] as [number, number, number]
                })
            }

            setCups(missionCups)
            missionGlobal.cupsRemaining = missionCups.length
        }, 100)

        // Таймер 20 секунд
        let timeLeft = 20
        missionGlobal.timer = timeLeft

        timerRef.current = setInterval(() => {
            timeLeft--
            missionGlobal.timer = timeLeft

            if (timeLeft <= 0) {
                console.log('Время вышло!')
                endMission(false)
            }
        }, 1000)
    }

    // 5. Клик по кружке
    const handleClick = (cupId: number) => {
        if (!missionGlobal.gameActive) {
            console.log('Клик вне активной миссии')
            return
        }

        console.log(`Клик по кружке ${cupId}`)

        // Убираем кружку
        const newCups = cups.filter(cup => cup.id !== cupId)
        setCups(newCups)
        missionGlobal.cupsRemaining = newCups.length

        // Проверяем завершение миссии
        if (newCups.length === 0) {
            console.log('Все кружки убраны!')
            endMission(true)
        }
    }

    // 6. Завершение миссии
    const endMission = (success: boolean) => {
        console.log(success ? 'Миссия выполнена успешно!' : 'Миссия провалена')

        // Останавливаем таймер
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

        // Разблокируем камеру
        unlockCamera()

        // Меняем состояние
        missionGlobal.gameActive = false

        if (success) {
            missionGlobal.missionComplete = true
            missionGlobal.showCompletionMessage = true // ВКЛЮЧАЕМ показ сообщения
            // Записываем выполнение миссии в систему достижений
            complete()
            console.log('Миссия "click-sprint-mission" отмечена как выполненная')
            // Стол остается пустым
            setCups([]) // Очищаем все кружки

            // Автоматически скрываем сообщение через 5 секунд
            setTimeout(() => {
                missionGlobal.showCompletionMessage = false
            }, 5000)
        } else {
            // Возвращаем 3 постоянные кружки через 2 секунды
            setTimeout(() => {
                console.log('Возвращаем постоянные кружки')
                const initialCups = [
                    { id: 1, position: [2.4, 0.1, -2.3] as [number, number, number] },
                    { id: 2, position: [2.6, 0.1, -2.4] as [number, number, number] },
                    { id: 3, position: [2.8, 0.1, -2.5] as [number, number, number] }
                ]

                setCups(initialCups)
                missionGlobal.cupsRemaining = initialCups.length
                missionGlobal.missionComplete = false
            }, 2000)
        }
    }

    // 8. Рендер
    return (
        <>
            {/* Иконка задания - показываем "ВЫПОЛНЕНО" только если миссия выполнена в ЭТОЙ сессии */}
            <MissionIcon
                completed={missionGlobal.missionComplete}
                visible={!missionGlobal.gameActive}
            />

            {/* Рендерим кружки только если миссия не выполнена в ЭТОЙ сессии */}
            {!missionGlobal.missionComplete && cups.map(cup => (
                <group
                    key={cup.id}
                    position={cup.position}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClick(cup.id)
                    }}
                    onPointerOver={() => {
                        if (missionGlobal.gameActive) {
                            document.body.style.cursor = 'pointer'
                        }
                    }}
                    onPointerOut={() => {
                        if (missionGlobal.gameActive) {
                            document.body.style.cursor = 'default'
                        }
                    }}
                >
                    <CoffeeCups
                        position={[0, -0.3, 0]}
                    />
                </group>
            ))}
        </>
    )
}

// UI компонент
export function SpeedMissionUI() {
    const [state, setState] = useState({
        showHint: missionGlobal.showHint,
        gameActive: missionGlobal.gameActive,
        missionComplete: missionGlobal.missionComplete,
        timer: missionGlobal.timer,
        cupsRemaining: missionGlobal.cupsRemaining,
        showCompletionMessage: missionGlobal.showCompletionMessage
    })

    // 1. Подписка на обновления глобального состояния
    useEffect(() => {
        const updateState = () => {
            setState({
                showHint: missionGlobal.showHint,
                gameActive: missionGlobal.gameActive,
                missionComplete: missionGlobal.missionComplete,
                timer: missionGlobal.timer,
                cupsRemaining: missionGlobal.cupsRemaining,
                showCompletionMessage: missionGlobal.showCompletionMessage
            })
        }

        // Проверяем состояние каждые 50ms для плавности
        const interval = setInterval(updateState, 50)
        return () => clearInterval(interval)
    }, [])

    // 2. Управление курсором
    useEffect(() => {
        if (state.gameActive) {
            // Курсор виден во время миссии
            document.body.style.cursor = 'default'
        } else if (!state.missionComplete) {
            // Курсор скрыт когда не в миссии
            document.body.style.cursor = 'none'
        }
    }, [state.gameActive, state.missionComplete])

    // 3. Рендер UI
    return (
        <>
            {/* Подсказка о нажатии F - показываем только если миссия не выполнена в ЭТОЙ сессии */}
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
                    border: '2px solid #ff9900',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(5px)'
                }}>
                    Нажмите F чтобы начать миссию
                </div>
            )}

            {/* Интерфейс во время миссии */}
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
                        ⚡ Миссия: Скорость
                    </div>

                    <div style={{
                        fontSize: '18px',
                        marginBottom: '5px'
                    }}>
                        Осталось: <span style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#2ecc71'
                        }}>{state.cupsRemaining}/10</span>
                    </div>

                    <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: state.timer <= 10 ? '#e74c3c' : '#2ecc71',
                        margin: '10px 0',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {state.timer} сек
                    </div>

                    <div style={{
                        fontSize: '14px',
                        opacity: 0.8
                    }}>
                        Кликайте на кружки чтобы убрать их
                    </div>
                </div>
            )}

            {/* Сообщение об успехе - показываем ТОЛЬКО если специально включен флаг showCompletionMessage */}
            {state.showCompletionMessage && (
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
                        Вы убрали все кружки за {20 - state.timer} секунд!
                    </div>

                    <div style={{
                        fontSize: '16px',
                        marginBottom: '20px',
                        color: '#3498db',
                        padding: '10px',
                        background: 'rgba(52, 152, 219, 0.1)',
                        borderRadius: '8px'
                    }}>
                        <strong>Ценность компании: Скорость</strong>
                    </div>

                    <button
                        onClick={() => {
                            missionGlobal.showCompletionMessage = false
                        }}
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
                </div>
            )}
        </>
    )
}

// Компонент для отображения достижения (добавьте его в ваш главный файл FirstRoom.tsx)
export function SimpleAchievement() {
    const [showAchievement, setShowAchievement] = useState(false)

    useEffect(() => {
        // Слушаем событие показа достижения
        const handleShowAchievement = () => {
            setShowAchievement(true)
        }

        window.addEventListener('show-achievement', handleShowAchievement)

        return () => {
            window.removeEventListener('show-achievement', handleShowAchievement)
        }
    }, [])

    if (!showAchievement) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '40px',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                animation: 'slideIn 0.5s ease-out'
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '20px',
                    animation: 'bounce 1s infinite alternate'
                }}>
                    🏆
                </div>

                <h2 style={{
                    color: 'white',
                    fontSize: '32px',
                    marginBottom: '15px',
                    fontWeight: 'bold'
                }}>
                    Достижение разблокировано!
                </h2>

                <div style={{
                    color: 'white',
                    fontSize: '24px',
                    marginBottom: '25px',
                    fontWeight: '600',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    borderRadius: '10px'
                }}>
                    Вы освоили ценность "Скорость"!
                </div>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    marginBottom: '30px',
                    lineHeight: '1.5'
                }}>
                    Поздравляем! Вы успешно завершили все задания.
                </p>

                <button
                    onClick={() => setShowAchievement(false)}
                    style={{
                        background: 'white',
                        color: '#764ba2',
                        border: 'none',
                        padding: '12px 40px',
                        fontSize: '18px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Продолжить
                </button>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes bounce {
                    from {
                        transform: translateY(0);
                    }
                    to {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </div>
    )
}