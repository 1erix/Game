import Link from "next/link";

export default function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">

        <h1 className="text-7xl font-bold mb-24 font-[bebas] tracking-tighter text-gray-900">
          CHULAKOV
        </h1>

        <div className="space-y-6 w-full max-w-xs">

          <Link
            href={'/pages/start'}
            className="block w-full py-5 text-center text-2xl rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-150 font-[bebas] tracking-wider text-gray-800 shadow-sm hover:shadow"
          >
            НАЧАТЬ ИГРУ
          </Link>
        </div>

      </div>
    </div>
  );
}