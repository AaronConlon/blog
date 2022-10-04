import { request } from "@octokit/request";

export const github = request.defaults({
  headers: {
    authorization: `token ${process.env.TOKEN}`,
  },
});
