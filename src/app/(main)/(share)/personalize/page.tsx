import Personalize from "@/components/user/personalize";
import { fetcher } from "@/lib/utils/fetcher/server/fetcher";
import { getServerCookie } from "@/lib/utils/fetcher/server/cookieStore";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  topics: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

const PersonalizePage = async () => {
  const stores = await cookies();
  const accessToken = getServerCookie(stores, "access_token");

  // Chưa đăng nhập → redirect login
  if (!accessToken) {
    redirect("/auth/login?redirect=/personalize");
  }

  // Check user đã có preferences chưa
  const meRes = await fetcher("/auth/me", stores);
  if (meRes.ok) {
    const me = await meRes.json();
    // Đã điền preferences rồi → redirect home
    if (me.preferences_str) {
      redirect("/");
    }
  }

  // Lấy categories + topics
  const response = await fetcher("/categories/subcategories", stores);
  const result: Subcategory[] = await response.json();

  // Chỉ lấy các category gốc (parent_id === null)
  const rootCategories = result.filter((item) => item.parent_id === null);

  return <Personalize learningFields={rootCategories} />;
};

export default PersonalizePage;
