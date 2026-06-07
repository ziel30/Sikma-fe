import { FollowList } from "@/features/profile/components/follow-list";
import { FOLLOWING } from "@/features/profile/types";

export default function MengikutiPage() {
  return <FollowList title="Mengikuti" users={FOLLOWING} />;
}
