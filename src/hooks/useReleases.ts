import { useQuery } from "@tanstack/react-query"

import { Release, VERSIONS_API } from "../util"

export default function useReleases() {
  return useQuery<Release[]>({
    queryKey: ["versions"],
    queryFn: () => fetch(VERSIONS_API).then(response => response.json()),
  })
}
