import { getAllIssue, getBlogRepoLabels, getMyRepos } from "./api";
import { TIssue, TLabel, TRepo } from "./types";

const cacheRecords = {
  issues: {
    data: [] as TIssue[],
    validateBefore: 0,
  },
  labels: {
    data: [] as TLabel[],
    validateBefore: 0,
  },
  repos: {
    data: [] as TRepo[],
    validateBefore: 0,
  },
};
let blogCount = 30;

export function getBlogCount() {
  return blogCount;
}
export function setBlogCount(count: number) {
  blogCount = count;
}

function checkCacheValid(key: keyof typeof cacheRecords) {
  // return cacheRecords[key].validateBefore > Date.now();
  return false;
}

export async function getCacheIssues() {
  // if (checkCacheValid("issues")) {
  //   return cacheRecords.issues.data;
  // }
  return getAllIssue();
}

export async function getCacheLabels() {
  if (checkCacheValid("labels")) {
    return cacheRecords.labels.data;
  }
  return getBlogRepoLabels();
}

export async function getCacheRepos() {
  if (checkCacheValid("repos")) {
    return cacheRecords.repos.data;
  }
  return getMyRepos();
}

export async function updateCacheIssues(data: TIssue[]) {
  cacheRecords.issues.data = data;
  cacheRecords.issues.validateBefore = Date.now() + 1000 * 1;
}

export async function updateCacheLabels(data: TLabel[]) {
  cacheRecords.labels.data = data;
  cacheRecords.labels.validateBefore = Date.now() + 1000 * 1;
}

export async function updateCacheRepos(data: TRepo[]) {
  cacheRecords.repos.data = data;
  cacheRecords.repos.validateBefore = Date.now() + 1000 * 1;
}
