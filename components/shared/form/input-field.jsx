"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InputField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  icon: Icon,
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative group">
              {Icon && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon className="h-5 w-5 text-zinc-500 group-focus-within:text-fuchsia-500 transition-colors duration-300" />
                </div>
              )}
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "h-auto w-full bg-black border-zinc-700 rounded-xl py-3.5 pr-4",
                  "text-zinc-400 placeholder:text-zinc-600 font-medium",
                  "focus-visible:ring-2 focus-visible:ring-fuchsia-500/20 focus-visible:border-fuchsia-500",
                  "transition-all duration-300",
                  Icon ? "pl-12" : "pl-4"
                )}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage className="ml-1 text-red-400" />
        </FormItem>
      )}
    />
  );
}