"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import * as RadixSwitch from "@radix-ui/react-switch";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isLight = theme === "light" || isSSR;

  const onCheckedChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <RadixSwitch.Root
      checked={isLight}
      onCheckedChange={onCheckedChange}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={clsx(
        "relative inline-flex h-6 w-10 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none",
        className
      )}
    >
      <RadixSwitch.Thumb className="h-4 w-4 transform rounded-full bg-white dark:bg-gray-300  cursor-pointer transition-transform duration-200 ease-in-out translate-x-1 data-[state=checked]:translate-x-5 flex items-center justify-center">
        {isLight ? (
          <SunIcon className="size-3" />
        ) : (
          <MoonIcon className="size-3" />
        )}
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  );
};
