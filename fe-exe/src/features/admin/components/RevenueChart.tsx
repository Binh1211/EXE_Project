import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi, getApiErrorMessage, type RevenueData } from "../api/admin-api";
import { DollarSign, TrendingUp, Calendar, RefreshCw } from "lucide-react";
import {
  AdminBadge,
  AdminCard,
  AdminCardHeader,
  AdminEmpty,
  AdminErrorBox,
  AdminGhostBtn,
  AdminLoading,
} from "./admin-ui";

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRevenue = () => {
    setLoading(true);
    setError("");
    adminApi
      .getRevenue()
      .then(setData)
      .catch((e) => setError(getApiErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgDaily =
    data.length > 0 ? Math.round(totalRevenue / data.length) : 0;
  const peakDay = data.reduce(
    (max, item) => (item.revenue > max.revenue ? item : max),
    { date: "—", revenue: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-[#5f3713] p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Tổng doanh thu
            </p>
            <DollarSign className="h-5 w-5 text-white/70" />
          </div>
          <p className="mt-2 text-2xl font-bold">
            {totalRevenue.toLocaleString("vi-VN")}
            <span className="ml-1 text-sm font-normal text-white/70">₫</span>
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Trung bình / ngày
            </p>
            <TrendingUp className="h-5 w-5 text-[#5f3713]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#623715]">
            {avgDaily.toLocaleString("vi-VN")} ₫
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-[#fff3e9] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cao nhất
            </p>
            <Calendar className="h-5 w-5 text-[#5f3713]" />
          </div>
          <p className="mt-2 text-lg font-bold text-[#623715]">
            {peakDay.revenue.toLocaleString("vi-VN")} ₫
          </p>
          <p className="text-xs text-gray-500">{peakDay.date}</p>
        </div>
      </div>

      <AdminCard>
        <AdminCardHeader
          icon={DollarSign}
          title="Biểu đồ doanh thu"
          subtitle="Giao dịch thanh toán thành công theo ngày"
          action={
            <div className="flex items-center gap-2">
              <AdminBadge variant="success">
                {data.length} ngày có dữ liệu
              </AdminBadge>
              <AdminGhostBtn onClick={fetchRevenue}>
                <RefreshCw className="h-3.5 w-3.5" />
                Tải lại
              </AdminGhostBtn>
            </div>
          }
        />

        {error && <AdminErrorBox message={error} />}

        {loading ? (
          <AdminLoading label="Đang tải dữ liệu doanh thu..." />
        ) : data.length === 0 ? (
          <AdminEmpty
            title="Chưa có giao dịch"
            description="Doanh thu sẽ hiển thị khi có thanh toán VIP thành công."
          />
        ) : (
          <div className="h-80 w-full px-4 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5f3713" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#5f3713" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#a8a29e"
                  tick={{ fontSize: 11, fill: "#78716c" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#a8a29e"
                  tick={{ fontSize: 11, fill: "#78716c" }}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e7e5e4",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ color: "#623715", fontWeight: 600 }}
                  formatter={(value) => [
                    `${Number(value).toLocaleString("vi-VN")} ₫`,
                    "Doanh thu",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5f3713"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
