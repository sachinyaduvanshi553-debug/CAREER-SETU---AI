"use client"

import { HTMLMotionProps, motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  duration?: number
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 20,
  duration = 0.5,
  ...props
}: FadeInProps) {
  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
