import { useEffect, useState } from "react";
import { adminApi } from "../api/admin-api";
import { BookOpen, Edit, Trash2, Plus } from "lucide-react";

export function ChapterEditor() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", description: "", order: 1, requiredLevel: 1, timelineId: "" });

  const fetchChapters = () => {
    setLoading(true);
    adminApi.getChapters()
      .then(setChapters)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.createChapter(formData);
    setShowForm(false);
    fetchChapters();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will delete the chapter.")) {
      await adminApi.deleteChapter(id);
      fetchChapters();
    }
  };

  if (loading) return <div className="text-white">Loading chapters...</div>;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-indigo-400" /> Quản lý Khóa học (Chapters)
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Thêm Chapter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-slate-900/50 p-6 rounded-lg border border-slate-700 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Tiêu đề</label>
              <input
                required
                type="text"
                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Slug</label>
              <input
                required
                type="text"
                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Thứ tự (Order)</label>
              <input
                required
                type="number"
                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Level yêu cầu</label>
              <select
                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                value={formData.requiredLevel}
                onChange={e => setFormData({ ...formData, requiredLevel: Number(e.target.value) })}
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Mô tả</label>
            <textarea
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white h-20"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-medium">
            Lưu Chapter
          </button>
        </form>
      )}

      <div className="space-y-3">
        {chapters.map(chapter => (
          <div key={chapter._id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-lg">{chapter.order}. {chapter.title}</div>
              <div className="text-sm text-slate-400">/{chapter.slug} • Yêu cầu Level {chapter.requiredLevel}</div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded">
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(chapter._id)}
                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
