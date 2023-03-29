// script to fetch files from private github repo; uses github app authentication
// set env variables: GITHUB_APP_PEM_PATH, GITHUB_USER, GITHUB_APP_ID, GITHUB_INSTALLATION_ID

import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import axios from "axios";
import "dotenv/config";
import { reactifyStyles } from "./utils.js";

const { GITHUB_APP_PEM_PATH, GITHUB_USER, GITHUB_APP_ID, GITHUB_INSTALLATION_ID } = process.env;

// refactor these two functions to be less duplicative

export async function fetchGithubFile({ repo, directory='', filename, outDir }) {
  const installationAccessToken = await getInstallationAccessToken();
  const client = axios.create({
    baseURL: `https://api.github.com/repos/${GITHUB_USER}/${repo}/contents/${directory}`,
    headers: {
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${installationAccessToken}`,
    },
  });
  console.log(`\nRetrieving ${filename} from ${repo}/${directory} to ${outDir}...`);
  const response = await client.get(filename);
  fs.writeFileSync(path.join(outDir, filename), response.data);
}

export async function fetchGithubContent({ repo, directory='', documents, outDir='docs' }) {
  const installationAccessToken = await getInstallationAccessToken();
  const client = axios.create({
    baseURL: `https://api.github.com/repos/${GITHUB_USER}/${repo}/contents/${directory}`,
    headers: {
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${installationAccessToken}`,
    },
  });
  // console.log('client', client);
  console.log(`\nRetrieving ${documents.length} file(s) from ${repo}/${directory} to ${outDir}...`);
  for (const doc of documents) {
    const { filename, frontMatter } = doc;
    console.log('fetching', filename);
    const response = await client.get(filename);
    const reactifiedContent = reactifyStyles(response.data);
    const content = frontMatter + reactifiedContent;
    fs.writeFileSync(path.join(outDir, filename), content);
  }
}

async function getInstallationAccessToken() {
  const jwtToken = generateJWT();
  const response = await axios.post(
    `https://api.github.com/app/installations/${GITHUB_INSTALLATION_ID}/access_tokens`,
    {},
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${jwtToken}`
      },
    }
  );
  return response.data.token;
}

function generateJWT() {
  const privateKey = fs.readFileSync(GITHUB_APP_PEM_PATH, 'utf-8');
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60,
    iss: GITHUB_APP_ID,
  };
  const signOptions = {
    algorithm: 'RS256',
    header: {
      alg: 'RS256',
      typ: 'JWT',
    },
  };
  const token = jwt.sign(payload, privateKey, signOptions);
  return token;
}
