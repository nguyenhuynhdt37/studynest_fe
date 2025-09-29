import api from "@/lib/utils/ fetcher/client/axios";

export const swrFetcher = (url: string) => api.get(url);
