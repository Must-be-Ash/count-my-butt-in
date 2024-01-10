import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const classes = (...classNames: Array<string | null | undefined>) =>
  classNames.filter(Boolean).join(" ");

export function capitalizeFirstLetter(word: string): string {
  if (!word || typeof word !== "string") {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
export const shortenAddress = (address: string): string => {
  return `${address.substring(0, 5)}...${address.substring(39, 42)}`;
};

const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

export function encode(str: string) {
  let result = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = charset.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid character: ${char}`);
    }

    result = result * 36 + index;

    // Check if result exceeds JavaScript's max safe integer
    if (result > Number.MAX_SAFE_INTEGER) {
      throw new Error("Encoded value exceeds JavaScript's max safe integer.");
    }
  }

  return result;
}

export function getOpenseaLink(
  networkId: number,
  contractAddress: string,
  tokenId: string
) {
  console.log("networkId", networkId);
  console.log("contractAddress", contractAddress);
  console.log("tokenId", tokenId);
  if (networkId === 1) {
    return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
  }
  if (networkId === 137) {
    return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`;
  }
  if (networkId === 8453) {
    return `https://opensea.io/assets/base/${contractAddress}/${tokenId}`;
  }
  if (networkId === 5) {
    return `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`;
  }
  return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
}

export function getContractEtherscanLink(
  networkId: number,
  contractAddress: string
) {
  if (networkId === 1) {
    return `https://etherscan.io/address/${contractAddress}`;
  }
  if (networkId === 137) {
    return `https://polygonscan.com/address/${contractAddress}`;
  }
  if (networkId === 8453) {
    return `https://basescan.org/address/${contractAddress}`;
  }
  if (networkId === 5) {
    return `https://goerli.etherscan.io/address/${contractAddress}`;
  }
  return `https://etherscan.io/address/${contractAddress}`;
}

export function getTokenBoundLink(
  networkId: number,
  contractAddress: string,
  tokenId: string
) {
  if (networkId === 1) {
    return `https://tokenbound.org/assets/ethereum/${contractAddress}/${tokenId}`;
  }
  if (networkId === 137) {
    return `https://tokenbound.org/assets/matic/${contractAddress}/${tokenId}`;
  }
  if (networkId === 8453) {
    return `https://tokenbound.org/assets/base/${contractAddress}/${tokenId}`;
  }
  if (networkId === 5) {
    return `https://tokenbound.org/assets/goerli/${contractAddress}/${tokenId}`;
  }
  return `https://tokenbound.org/assets/ethereum/${contractAddress}/${tokenId}`;
}

export function decode(num: number) {
  let str = "";

  while (num > 0) {
    const remainder = num % 36;
    str = charset[remainder] + str;
    num = Math.floor(num / 36);
  }

  return str || charset[0];
}

export function networkToName(networkId: number) {
  if (networkId === 1) {
    return "Ethereum";
  }
  if (networkId === 137) {
    return "Polygon";
  }
  if (networkId === 8453) {
    return "Base";
  }
  if (networkId === 5) {
    return "Goerli";
  }
  return "Ethereum";
}

export function nameToNetwork(name: string): number {
  name = name.toLowerCase();
  if (name === "ethereum") {
    return 1;
  }
  if (name === "polygon") {
    return 137;
  }
  if (name === "base") {
    return 8453;
  }
  if (name === "goerli") {
    return 5;
  }
  return 1;
}

export function networkToCurrency(networkId: number) {
  if (networkId === 1) {
    return "ETH";
  }
  if (networkId === 137) {
    return "MATIC";
  }
  if (networkId === 8453) {
    return "BETH";
  }
  if (networkId === 5) {
    return "GETH";
  }
  return "ETH";
}

export const poll = (pollConfig: any): any => {
  console.log("Start poll...");
  let attempts = 0;

  const executePoll = async (resolve: any, reject: any) => {
    console.log(`${attempts} - poll`);
    let result;
    try {
      result = await pollConfig.fetchApi();
    } catch (e) {
      console.log("the errro", e);
      return reject(new Error(pollConfig.errorMessage));
    }
    attempts++;
    if (pollConfig.validate(result)) {
      return resolve(result);
    } else if (pollConfig.maxAttempts && attempts === pollConfig.maxAttempts) {
      return reject(new Error(pollConfig.errorMessage));
    } else {
      setTimeout(executePoll, pollConfig.interval, resolve, reject);
    }
  };
  return new Promise(executePoll);
};
