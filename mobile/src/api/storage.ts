import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'bf_access_token_v1';
const REFRESH_KEY = 'bf_refresh_token_v1';

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function getTokens(): Promise<StoredTokens | null> {
  const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
  const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function setTokens(tokens: StoredTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
