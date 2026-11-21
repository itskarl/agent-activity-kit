"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { spring } from "@/kit/motion";

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className="seg">
      <legend className="seg__legend">{label}</legend>
      <div className="seg__track">
        {options.map((option) => (
          <label key={option.value} className="seg__option" data-checked={option.value === value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            {option.value === value && (
              <motion.span layoutId={`${name}-pill`} className="seg__pill" transition={spring.snappy} />
            )}
            <span className="seg__text">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
