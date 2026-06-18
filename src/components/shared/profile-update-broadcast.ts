export const PROFILE_UPDATED_EVENT = 'profile-updated'

export function broadcastProfileUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT))
  }
}
