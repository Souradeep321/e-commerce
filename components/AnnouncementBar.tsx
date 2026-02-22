'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(true)

  if (!visible) return null

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="flex items-center justify-center px-10 py-2">
        <p className="text-xs font-medium tracking-wide sm:text-sm">
          {'Free Shipping on orders above '}
          <span className="font-bold">{'₹999'}</span>
          {/* {' | Use code '}
          <span className="font-bold underline underline-offset-2">
            AURVA20
          </span> */}
          {/* {' for 20% off'} */}
        </p>
      </div>
      <button
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-primary-foreground/10"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default AnnouncementBar
