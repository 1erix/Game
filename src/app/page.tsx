import Link from "next/link";

export default function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 relative">

      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-500/5 to-orange-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-cyan-600/5 rounded-full blur-xl"></div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">

        <div className="relative mb-24">
          <h1 className="text-7xl md:text-8xl font-bold font-[bebas] tracking-tighter">
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              CORE RUNNER
            </span>
          </h1>
          <div className="text-center mt-4">
            <span className="text-sm font-light tracking-widest text-gray-400">
              ПРИНЦИПЫ В ДЕЙСТВИИ
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs mb-32">
          <Link
            href={'/pages/start'}
            className="block w-full py-4 text-center text-xl rounded-lg relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            <span className="relative font-[bebas] tracking-wider text-white">
              НАЧАТЬ ИГРУ
            </span>
          </Link>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="flex justify-center items-center gap-8 text-gray-500 text-xs tracking-widest">
            <span>ОТВЕТСТВЕННОСТЬ</span>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <span>ПРОЗРАЧНОСТЬ</span>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <span>СКОРОСТЬ</span>
          </div>
        </div>

      </div>
    </div>
  );
}