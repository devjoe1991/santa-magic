import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        vibrant: "min-h-[60px] px-8 bg-gradient-to-r from-christmasRed to-[#A71D23] text-white font-heading text-xl font-bold uppercase tracking-wider border-4 border-white rounded-2xl shadow-[0_8px_0_rgba(139,0,0,1),0_12px_24px_rgba(193,39,45,0.3)] hover:scale-105 hover:shadow-[0_10px_0_rgba(139,0,0,1),0_16px_32px_rgba(193,39,45,0.4)] active:translate-y-2 active:shadow-[0_4px_0_rgba(139,0,0,1),0_8px_16px_rgba(193,39,45,0.3)] transition-all duration-200",
        electric: "min-h-[60px] px-8 bg-evergreen text-white font-heading text-xl font-bold uppercase border-4 border-[#00FF88] rounded-2xl shadow-[0_8px_0_rgba(0,100,50,1),0_12px_24px_rgba(0,255,136,0.3)] hover:bg-gradient-to-br hover:from-evergreen hover:to-[#00FF88] hover:scale-105 hover:-rotate-1 active:rotate-0 active:scale-100 transition-all duration-300",
        premium: "min-h-[65px] px-10 bg-gradient-to-br from-warmGold via-yellow-300 to-warmGold text-charcoal font-heading text-2xl font-black uppercase border-[6px] border-warmGold rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.5),0_10px_0_rgba(218,165,32,1)] hover:shadow-[0_0_60px_rgba(255,215,0,0.7),0_12px_0_rgba(218,165,32,1)] hover:scale-110 hover:rotate-2 active:scale-105 active:rotate-1 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        chunky: "min-h-[60px] px-8 text-xl font-bold",
        massive: "min-h-[70px] px-12 text-2xl font-black",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [isClicked, setIsClicked] = React.useState(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'vibrant' || variant === 'electric' || variant === 'premium') {
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 600)
      }
      if (props.onClick) {
        props.onClick(e)
      }
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {/* Sparkle overlay for chunky buttons */}
        {(variant === 'vibrant' || variant === 'electric' || variant === 'premium') && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute -top-2 -left-2 text-white animate-ping">✨</div>
            <div className="absolute -bottom-2 -right-2 text-warmGold animate-ping delay-200">✨</div>
          </div>
        )}
        {/* Shimmer effect for premium */}
        {variant === 'premium' && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent opacity-30 animate-shimmer" />
        )}
        {/* Click sparkle burst */}
        {isClicked && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xl opacity-0"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 100}ms`,
                  animation: 'sparkle-burst 0.6s ease-out'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
