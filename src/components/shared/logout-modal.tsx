'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { TranslatedText } from '@/components/shared/translated-text'

export function LogoutModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            <TranslatedText text="Log out" cacheKey="logout-modal:trigger" />
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <TranslatedText text="Confirm Logout" cacheKey="logout-modal:title" />
          </DialogTitle>
          <DialogDescription>
            <TranslatedText
              text="Are you sure you want to log out? You will need to sign in again to access your account."
              cacheKey="logout-modal:desc"
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline">
                <TranslatedText text="Cancel" cacheKey="logout-modal:cancel" />
              </Button>
            }
          />
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <TranslatedText text="Log out" cacheKey="logout-modal:submit" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
