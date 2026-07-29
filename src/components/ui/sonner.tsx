import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * App toast surface.
 *
 * Reads the theme from this app's ThemeContext. It previously imported
 * `useTheme` from `next-themes`, but no NextThemesProvider is mounted
 * anywhere, so that hook always fell back to "system" and toasts ignored the
 * user's light/dark choice.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          // The background utility was missing here — the class list contained
          // a dangling `group-[.toaster]:` with no utility after it, which left
          // toasts with no surface of their own.
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground " +
            "group-[.toaster]:border group-[.toaster]:border-border " +
            "group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          closeButton:
            "group-[.toast]:bg-card group-[.toast]:text-muted-foreground group-[.toast]:border-border",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
