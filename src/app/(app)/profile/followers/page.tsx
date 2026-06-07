import { FollowList } from "@/features/profile/components/follow-list";
import { FOLLOWERS } from "@/features/profile/types";

export default function PengikutPage() {
  return <FollowList title="Pengikut" users={FOLLOWERS} />;
}
