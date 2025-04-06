"use client"
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut} from 'lucide-react';

export default function ButtonSignOut() {

  const  router = useRouter()


  const handleSignOut = ()=> {
    signOut()
    router.push('/')
  }

  return (
    <> 

      <Button onClick={handleSignOut} className="bg-stone-500 hover:bg-stone-600 text-white">
      <LogOut />
      </Button>  
    </>
  )
}