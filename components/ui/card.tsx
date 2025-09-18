import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'chunky' | 'festive' | 'premium'
    decorations?: boolean
  }
>(({ className, variant = 'default', decorations = false, ...props }, ref) => {
  const cardVariants = {
    default: "rounded-lg border bg-card text-card-foreground shadow-sm",
    chunky: "rounded-3xl border-[6px] border-christmasRed bg-gradient-to-br from-cream via-white to-frostBlue/10 shadow-[12px_12px_0_rgba(255,0,64,0.2)] hover:shadow-[16px_16px_0_rgba(255,0,64,0.3)] hover:rotate-1 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group",
    festive: "rounded-[32px] border-[8px] border-electricGreen bg-white shadow-[8px_8px_0_rgba(0,255,136,0.3)] hover:shadow-[12px_12px_0_rgba(0,255,136,0.4)] hover:-rotate-2 hover:scale-105 transition-all duration-300 relative group cursor-pointer",
    premium: "rounded-[40px] border-[10px] border-warmGold bg-gradient-to-br from-white via-cream to-warmGold/10 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] hover:scale-[1.03] transition-all duration-300 relative overflow-hidden"
  }

  return (
    <div
      ref={ref}
      className={cn(cardVariants[variant], className)}
      {...props}
    >
      {/* Christmas Corner Decorations */}
      {decorations && (
        <>
          <div className="absolute -top-4 -left-4 text-4xl z-10">🎅</div>
          <div className="absolute -top-4 -right-4 text-4xl z-10">🎄</div>
          <div className="absolute -bottom-4 -left-4 text-4xl z-10">🎁</div>
          <div className="absolute -bottom-4 -right-4 text-4xl z-10">⭐</div>
        </>
      )}


      {/* Sparkle burst for festive cards */}
      {variant === 'festive' && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
          {[...Array(6)].map((_, i) => (
            <div key={i}
                 className="absolute text-2xl animate-ping"
                 style={{
                   top: `${Math.random() * 100}%`,
                   left: `${Math.random() * 100}%`,
                   animationDelay: `${i * 100}ms`
                 }}>
              ✨
            </div>
          ))}
        </div>
      )}

      {props.children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
