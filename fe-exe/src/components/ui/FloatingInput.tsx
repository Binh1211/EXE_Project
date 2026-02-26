import { useState, useEffect } from "react";
import type { InputHTMLAttributes } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export default function FloatingInput({
  id,
  label,
  error,
  className = "",
  disabled,
  value,
  onFocus,
  onBlur,
  ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const isFloating = focused || hasValue;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          {...props}
          id={id}
          disabled={disabled}
          value={value ?? ""}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={`
            block w-full rounded-md border bg-transparent
            px-3 pb-2.5 pt-4 text-sm outline-none transition-all duration-200
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-600"
            }
            ${className}
          `}
        />

        <label
          htmlFor={id}
          className={`
            absolute left-3 z-10 bg-white px-1 text-sm
            transition-all duration-200 ease-in-out
            ${
              isFloating
                ? "top-2 -translate-y-4 scale-75"
                : "top-1/2 -translate-y-1/2 scale-100"
            }
            ${error ? "text-red-500" : "text-gray-500"}
          `}
        >
          {label}
        </label>
      </div>

      <p
        className={`mt-1 text-xs min-h-[18px] transition-opacity duration-200 ${
          error ? "text-red-500 opacity-100" : "opacity-0"
        }`}
      >
        {error || "placeholder"}
      </p>
    </div>
  );
}
