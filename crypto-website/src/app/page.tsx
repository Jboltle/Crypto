
"use client"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDemo
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function  Home ()  {
  const [change, setChange] = useState('')





//I hate typescript
  const onchange = (event: React.ChangeEvent<HTMLInputElement>  ) => { 
    setChange(event.target.value)
    
  }




  return (
    <main>

      <div id="dialogue-popup">

        <DialogDemo>

        </DialogDemo>
      </div>

    
    </main>
  );
}
