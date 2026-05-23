type AuthAlertProps = {
  type: "error" | "success";
  message: string;
};

export default function AuthAlert({ type, message }: AuthAlertProps) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-red-100 bg-red-50 text-red-600"
      : "border-green-100 bg-green-50 text-green-600";

  return (
    <div className={`mb-3 rounded-xl border p-2.5 text-xs ${styles}`}>
      {message}
    </div>
  );
}
