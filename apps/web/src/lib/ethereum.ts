export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function hasEthereumProvider(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

export function getMetaMaskDeepLink(): string {
  const host = typeof window !== "undefined" ? window.location.host : "";
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  return `https://metamask.app.link/dapp/${host}${path}`;
}

export async function connectMetaMask(): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts[0]) {
    throw new Error("No account found");
  }

  return accounts[0];
}

export async function signMessage(
  address: string,
  message: string
): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const signature = (await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  })) as string;

  return signature;
}

export function createSiweMessage(
  address: string,
  nonce: string,
  chainId: number = 1
): string {
  const domain = window.location.host;
  const origin = window.location.origin;
  const issuedAt = new Date().toISOString();

  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    "",
    "Sign in to Trading Cup",
    "",
    `URI: ${origin}`,
    `Version: 1`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}
