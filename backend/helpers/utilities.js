import fs from 'fs/promises';
 
const TOKEN_PATH = './private/tokens.json';
export const saveTokens = async (tokens) => {
  if (!tokens) {
    throw new Error("Cannot save undefined tokens");
  }
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
};

export const loadTokens = async () => {
  const data = await fs.readFile(TOKEN_PATH, 'utf-8');
  //console.log(data);
  return JSON.parse(data);
};
