import Personalize from "@/components/user/personalize";
import { fetcher } from "@/lib/utils/fetcher/server/fetcher";
import { LearningField } from "@/types/user/category";
import { cookies } from "next/headers";

const PersonalizePage = async () => {
  const stores = await cookies();
  const response = await fetcher("/learning_fields", stores);
  const result: LearningField[] = await response.json();

  return <Personalize learningFields={result} />;
};

export default PersonalizePage;
