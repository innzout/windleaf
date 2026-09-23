import type { Capability } from '@/content/site'

const styles: Record<Capability['status'], string> = {
  'Current capability': 'bg-green/12 text-forest border-green/30',
  'Current & developing': 'bg-sky/12 text-[#2c6474] border-sky/30',
  'In development': 'bg-leaf/25 text-[#5a6b2a] border-leaf/50',
}

export function StatusTag({ status }: { status: Capability['status'] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
