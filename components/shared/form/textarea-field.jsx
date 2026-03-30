"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function TextareaField({
  control,
  name,
  label,
  placeholder,
  disabled,
  rows = 4,
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                "h-auto w-full bg-black border-zinc-700 rounded-xl py-3.5 pr-4 resize-none",
                "text-zinc-100 placeholder:text-zinc-600",
                "focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 focus-visible:border-fuchsia-500",
                "transition-all duration-300"
              )}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}