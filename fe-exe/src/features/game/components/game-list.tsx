import { useNavigate } from "react-router-dom";
import { Gamepad2, Swords, Trophy, Play } from "lucide-react";
import { IMG } from "@/lib/images";

export default function GameList() {
  const navigate = useNavigate();

  const GAMES = [
    {
      id: "vuot-rao",
      title: "Vượt Rào",
      description: "Trả lời câu hỏi quiz để vượt qua các chướng ngại vật trên đường chạy.",
      icon: <Swords size={32} className="text-amber-500" />,
      color: "from-amber-500 to-orange-600",
      bgClass: "bg-amber-50",
      features: ["Trắc nghiệm nhanh", "Phản xạ"]
    },
    {
      id: "dua-rong",
      path: "/game/dua-rong",
      title: "Đua Rồng",
      description: "Tham gia cuộc đua kỳ thú và trả lời câu hỏi để tăng tốc cho rồng của bạn.",
      icon: <Gamepad2 size={32} className="text-emerald-500" />,
      color: "from-emerald-500 to-teal-600",
      bgClass: "bg-emerald-50",
      features: ["Đua tốc độ", "Câu hỏi hóc búa", "Nhiều người chơi"]
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Banner */}
      <div className="relative  text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          }}
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-10 py-16 flex items-center gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Trophy size={28} className="text-yellow-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                Thử Thách
              </span>
            </div>
            <h1 className="text-[48px] leading-[1.15] font-title font-bold italic mb-4">
              Chọn Trò Chơi
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Hãy chọn một chế độ chơi mà bạn yêu thích. Vượt qua thử thách và ôn tập lại toàn bộ kiến thức một cách thú vị nhất!
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 rounded-3xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center shadow-2xl">
              <img
                src={IMG.main}
                alt="Game character"
                className="w-32 h-32 object-contain drop-shadow-2xl animate-bounce"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="flex-1  py-16 px-10">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GAMES.map((game) => (
              <div
                key={game.id}
                className="group relative rounded-3xl border border-[#5c3a21]/10 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(game.path ?? `/game/${game.id}`)}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${game.bgClass} -z-0 opacity-50 transition-transform group-hover:scale-110`} />
                <div className="relative z-10 p-8 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
                    {game.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-[#5c3a21] mb-4 group-hover:text-amber-700 transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {game.features.map(feat => (
                      <span key={feat} className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600`}>
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <button className={`flex-1 py-3 px-6 rounded-xl bg-gradient-to-r ${game.color} text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all`}>
                      <Play size={18} fill="currentColor" />
                      Tham gia
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
