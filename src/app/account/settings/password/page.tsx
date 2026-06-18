import { ProfileCard } from '@/components/account/profile-card'
import { PasswordForm } from '@/components/account/password-form'

export default function AccountSettingsPasswordPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <ProfileCard />
      </div>
      <PasswordForm />
    </div>
  )
}
