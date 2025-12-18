// app/entities/functions/achievements/SimpleAchievement.tsx
'use client'

import { useEffect, useState } from 'react'

// Простое хранилище для отслеживания выполненных миссий
const completedMissions = new Set<string>()

// Функции для работы с миссиями
export const markMissionComplete = (missionId: string) => {
    completedMissions.add(missionId)
    localStorage.setItem(`mission-${missionId}`, 'completed')

    // Проверяем все ли миссии выполнены
    checkAllMissionsCompleted()
}

export const isMissionCompleted = (missionId: string) => {
    return completedMissions.has(missionId) || localStorage.getItem(`mission-${missionId}`) === 'completed'
}

// Все ID миссий в игре
const ALL_MISSIONS = ['click-sprint-mission', 'computer-speed-mission']

// Проверка выполнения всех миссий
const checkAllMissionsCompleted = () => {
    const allCompleted = ALL_MISSIONS.every(missionId =>
        completedMissions.has(missionId) || localStorage.getItem(`mission-${missionId}`) === 'completed'
    )

    if (allCompleted && !localStorage.getItem('speed-achievement-shown')) {
        // Показываем достижение через 1 секунду
        setTimeout(() => {
            const event = new CustomEvent('show-achievement')
            window.dispatchEvent(event)
        }, 1000)
    }
}

// Компонент достижения
export default function SimpleAchievement() {
    const [showAchievement, setShowAchievement] = useState(false)

    useEffect(() => {
        // Загружаем выполненные миссии из localStorage при загрузке
        ALL_MISSIONS.forEach(missionId => {
            if (localStorage.getItem(`mission-${missionId}`) === 'completed') {
                completedMissions.add(missionId)
            }
        })

        // Проверяем сразу при загрузке
        checkAllMissionsCompleted()

        // Слушаем событие показа достижения
        const handleShowAchievement = () => {
            setShowAchievement(true)
            localStorage.setItem('speed-achievement-shown', 'true')
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

// Хук для использования в миссиях
export const useSimpleMission = (missionId: string) => {
    const complete = () => {
        markMissionComplete(missionId)
    }

    const isCompleted = () => {
        return isMissionCompleted(missionId)
    }

    return { complete, isCompleted }
}