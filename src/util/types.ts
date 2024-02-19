export interface Author {
  avatarUrl: string;
  eventsUrl: string;
  followersUrl: string;
  followingUrl: string;
  gistsUrl: string;
  gravatarId: string;
  htmlUrl: string;
  id: number;
  login: string;
  nodeId: string;
  organizationsUrl: string;
  receivedEventsUrl: string;
  reposUrl: string;
  siteAdmin: boolean;
  starredUrl: string;
  subscriptionsUrl: string;
  type: string;
  url: string;
}

export interface Asset {
  browserDownloadUrl: string;
  contentType: string;
  createdAt: string;
  downloadCount: number;
  id: number;
  label: string;
  name: string;
  nodeId: string;
  size: number;
  state: string;
  updatedAt: string;
  uploader: Author;
  url: string;
}

export interface Release {
  assets: Asset[];
  assetsUrl: string;
  author: Author;
  body: string;
  createdAt: string;
  draft: boolean;
  htmlUrl: string;
  id: number;
  name: string;
  nodeId: string;
  prerelease: boolean;
  publishedAt: string;
  tagName: string;
  tarballUrl: string;
  targetCommitish: string;
  uploadUrl: string;
  url: string;
  zipballUrl: string;
}
