'use client'

import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  desc?: string
  isPending?: boolean
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are You Sure?',
  desc = 'Are you sure you want to delete this Inquirie?',
  isPending = false,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <AlertTriangle className="h-7 w-7 text-amber-500" />
          </div>
          <div className="text-center">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-500">
              {desc}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-center gap-4 sm:justify-center">
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-[100px] bg-[#2563EB] hover:bg-[#1d4ed8]"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
