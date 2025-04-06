"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'

interface ButtonToastProps {
  toastText: string;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset"; // Ajoutez 'type' ici
  variant?: "outline" | "secondary" 

}

const ButtonToast: React.FC<ButtonToastProps> = ({ toastText, type, variant, className, children }) => {
  return (
    <Button 
      onClick={() =>
        toast(toastText, {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
      className={className}
      type = {type}
      variant = {variant}
    >
      {children}
    </Button>
  )
}

export default ButtonToast;
