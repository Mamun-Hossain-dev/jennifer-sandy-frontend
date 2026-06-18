import { ProfileCard } from '@/components/account/profile-card'
import { ProfileForm } from '@/components/account/profile-form'

export default function AccountSettingsProfilePage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <ProfileCard />
      </div>
      <ProfileForm />
    </div>
  )
}
