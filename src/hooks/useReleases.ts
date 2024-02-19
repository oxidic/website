import { useQuery } from "@tanstack/react-query";

import { Release, RELEASES_API } from "../util";

export default function useReleases() {
  return useQuery<Release[]>({
    queryKey: ["releases"],
    queryFn: () => fetch(RELEASES_API).then(response => response.json()),
  });
}
