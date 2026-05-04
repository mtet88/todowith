import { IdeaDetailClient } from "./IdeaDetailClient";

export default async function IdeaDetailPage({ params }: PageProps<"/ideas/[id]">) {
  const { id } = await params;

  return <IdeaDetailClient id={id} />;
}
