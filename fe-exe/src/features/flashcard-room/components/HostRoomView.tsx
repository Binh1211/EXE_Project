import { useState } from "react";
import * as XLSX from "xlsx";
import { flashcardRoomApi } from "../api/flashcard-room-api";
import { Upload, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function HostRoomView() {
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState<any[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Cột A: Câu hỏi, B, C, D, E: Đáp án, F: Số của đáp án đúng (1-4)
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const parsedQuestions = jsonData
          .slice(1) // Bỏ qua header
          .filter((row) => row.length >= 6) // Đảm bảo đủ dữ liệu
          .map((row) => {
            return {
              text: row[0],
              options: [
                { text: row[1]?.toString() || "" },
                { text: row[2]?.toString() || "" },
                { text: row[3]?.toString() || "" },
                { text: row[4]?.toString() || "" },
              ],
              correctOptionIndex: parseInt(row[5]) - 1, // Chuyển từ 1-4 sang 0-3
              points: parseInt(row[6]) || 10,
            };
          });

        if (parsedQuestions.length === 0) {
          setError("Không tìm thấy câu hỏi hợp lệ trong file Excel. Vui lòng kiểm tra lại định dạng.");
          return;
        }

        setQuestions((prev) => [...prev, ...parsedQuestions]);
        setError("");
      } catch (err) {
        setError("Lỗi khi đọc file Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const addManualQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctOptionIndex: 0,
        points: 10,
      },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateRoom = async () => {
    setError("");
    if (!title.trim()) {
      setError("Vui lòng nhập tên phòng thi.");
      return;
    }
    if (questions.length === 0) {
      setError("Phòng thi phải có ít nhất 1 câu hỏi.");
      return;
    }

    // Validate
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text) {
        setError(`Câu hỏi ${i + 1} chưa có nội dung.`);
        return;
      }
      if (questions[i].options.some((opt: any) => !opt.text)) {
        setError(`Câu hỏi ${i + 1} chưa điền đủ các đáp án.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await flashcardRoomApi.createRoom({
        title,
        timeLimitSec: timeLimit * 60,
        questions,
      });
      setJoinCode(res.joinCode);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tạo phòng");
    } finally {
      setIsLoading(false);
    }
  };

  if (joinCode) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#5f3713] mb-2">Tạo phòng thành công!</h2>
          <p className="text-gray-600 mb-6">Mã phòng thi của bạn là:</p>
          <div className="bg-gray-100 rounded-xl py-4 px-6 text-4xl font-mono font-bold tracking-widest text-[#d87c32] mb-6">
            {joinCode}
          </div>
          <p className="text-sm text-gray-500 mb-8">
            Hãy gửi mã này cho người chơi để họ tham gia bài kiểm tra.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setJoinCode("");
                setQuestions([]);
                setTitle("");
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Tạo phòng khác
            </button>
            <Link
              to={`/flashcard-rooms/${joinCode}/leaderboard`}
              className="flex-1 px-4 py-2 bg-[#d87c32] text-white rounded-lg hover:bg-[#b86725] transition font-medium"
            >
              Xem Bảng điểm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-[#5f3713] mb-6">Tạo Phòng Flashcard </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên bài thi / Chủ đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d87c32]/20 focus:border-[#d87c32]"
              placeholder="VD: Lịch sử nhà Trần"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian làm bài (Phút)</label>
            <input
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d87c32]/20 focus:border-[#d87c32]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách câu hỏi ({questions.length})</h2>
        <div className="flex gap-3">
          <button
            onClick={addManualQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm thủ công
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition cursor-pointer text-sm font-medium border border-indigo-100">
            <Upload className="w-4 h-4" />
            Nhập từ Excel
            <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
            <button
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="mb-4 pr-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Câu hỏi {qIndex + 1}</label>
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d87c32]/20 focus:border-[#d87c32]"
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt: any, oIndex: number) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctOptionIndex === oIndex}
                    onChange={() => updateQuestion(qIndex, "correctOptionIndex", oIndex)}
                    className="w-4 h-4 text-[#d87c32] focus:ring-[#d87c32]"
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#d87c32] ${
                      q.correctOptionIndex === oIndex ? "border-green-400 bg-green-50" : "border-gray-200"
                    }`}
                    placeholder={`Đáp án ${oIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">Chưa có câu hỏi nào. Nhập thủ công hoặc upload từ file Excel.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreateRoom}
          disabled={isLoading || questions.length === 0}
          className="px-8 py-3 bg-[#d87c32] text-white rounded-xl font-semibold hover:bg-[#b86725] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#d87c32]/20"
        >
          {isLoading ? "Đang xử lý..." : "Tạo phòng thi"}
        </button>
      </div>
    </div>
  );
}
