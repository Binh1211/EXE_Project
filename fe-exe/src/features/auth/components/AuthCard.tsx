import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  bannerSrc?: string;
  bannerAlt?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({
  title,
  bannerSrc,
  bannerAlt = "",
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/img/paper-texture.png')] bg-cover bg-center bg-[#fbf0ce] px-4 py-8 font-sans selection:bg-[#5f3713] selection:text-white">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        {bannerSrc && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              src={bannerSrc}
              alt={bannerAlt}
              className="h-[130px] w-full object-cover"
            />
          </div>
        )}

        <h2 className="mb-4 font-history text-2xl font-bold text-gray-900">
          {title}
        </h2>

        {children}

        {footer}

        <p className="mt-4 text-center text-[10px] tracking-wide text-gray-400">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}
