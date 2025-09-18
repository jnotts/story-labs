import { Suspense } from "react";
import { StoryEditor } from "@/components/story-editor";

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoryEditor />
    </Suspense>
  );
}
