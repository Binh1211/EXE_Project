import type { GoogleAuthMode } from "@/features/auth/types";
import { authApi } from "@/features/auth/api/auth-api";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.37 1 3.44 3.68 1.54 7.6l3.78 2.93c.89-2.67 3.39-4.49 6.68-4.49z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.46h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.15-1.98 3.75-4.89 3.75-8.53z"
      />
      <path
        fill="#FBBC05"
        d="M5.32 14.77c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.54 7.44C.56 9.4 0 11.64 0 14s.56 4.6 1.54 6.56l3.78-2.93-.36-1.5z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.68-2.85c-1.02.68-2.33 1.09-3.96 1.09-3.29 0-5.79-2.02-6.78-4.69l-3.78 2.93C3.44 20.32 7.37 23 12 23z"
      />
    </svg>
  );
}

type GoogleAuthButtonProps = {
  mode: GoogleAuthMode;
  label: string;
  disabled?: boolean;
};

export default function GoogleAuthButton({
  mode,
  label,
  disabled = false,
}: GoogleAuthButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => authApi.startGoogleAuth(mode)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-70"
    >
      <GoogleIcon />
      {label}
    </button>
  );
}
