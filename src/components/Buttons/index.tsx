import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ColorRing } from "react-loader-spinner";

const buttonVariants = cva(
  "inline-flex h-[55px] items-center px-[27px] justify-center rounded-lg text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-[#33333333] disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary text-primary hover:bg-primary/90 hover:text-primary/80",
        secondary: "bg-secondary text-[#111111] hover:bg-secondary/80",
        ghost: "hover:bg-slate-50 hover:text-slate-800",
        link: "underline-offset-4 hover:underline text-primary",
        black: "bg-black text-white hover:bg-black/80",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        full: "w-full ",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? React.Fragment : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={asChild ? undefined : ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <ColorRing
            visible={true}
            height="30"
            width="30"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#5B32E5", "#5B32E5", "#5B32E5", "#5B32E5", "#5B32E5"]}
          />
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
