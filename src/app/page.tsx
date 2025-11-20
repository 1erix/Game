import Link from "next/link";

export default function Main() {
  return (
    <div className="bg-amber-100 w-screen h-screen flex justify-center flex-col items-center gap-y-2.5 text-center">
      <Link href={'/pages/start'} className="border-2 w-3xs h-12 text-2xl rounded-2xl font-[bebas] font-medium">Начать игру</Link>
      <Link href={'/pages/achievements'} className="border-2 w-3xs h-12 text-2xl rounded-2xl font-[bebas] font-medium">Достижения</Link>
      <Link href={'/pages/settings'} className="border-2 w-3xs h-12 text-2xl rounded-2xl font-[bebas] font-medium">Настройки</Link>
    </div>
  )
}