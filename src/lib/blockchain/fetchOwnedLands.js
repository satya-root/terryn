import { ethers } from "ethers";

import nftABI from "./abi/TerrynNFT.json";

import {
  TERRYN_NFT_ADDRESS,
  TERRYN_NFT_DEPLOY_BLOCK,
  SEPOLIA_CHAIN_ID,
} from "./contracts";


// ============================================================
// IPFS -> HTTP
// ============================================================

function ipfsToHttp(uri) {
  if (!uri) return "";

  if (uri.startsWith("ipfs://")) {
    return uri.replace(
      "ipfs://",
      "https://gateway.pinata.cloud/ipfs/"
    );
  }

  return uri;
}


// ============================================================
// GET ATTRIBUTE
// ============================================================

function getAttribute(attributes, traitName) {
  if (!Array.isArray(attributes)) {
    return "";
  }

  const attribute = attributes.find(
    (item) =>
      item.trait_type === traitName
  );

  return attribute?.value || "";
}


// ============================================================
// QUERY EVENTS IN SMALL BLOCK CHUNKS
// ============================================================

async function queryEventsInChunks(
  contract,
  filter,
  fromBlock,
  toBlock,
  chunkSize = 9000
) {
  const allEvents = [];

  for (
    let startBlock = fromBlock;
    startBlock <= toBlock;
    startBlock += chunkSize
  ) {
    const endBlock = Math.min(
      startBlock + chunkSize - 1,
      toBlock
    );

    console.log(
      `Fetching Transfer events: ${startBlock} -> ${endBlock}`
    );

    const events = await contract.queryFilter(
      filter,
      startBlock,
      endBlock
    );

    allEvents.push(...events);
  }

  return allEvents;
}


// ============================================================
// FETCH OWNED LANDS
// ============================================================

export async function fetchOwnedLands(walletAddress) {
  if (!walletAddress) {
    return [];
  }

  if (!ethers.isAddress(walletAddress)) {
    throw new Error(
      "Invalid connected wallet address."
    );
  }

  if (
    typeof window === "undefined" ||
    !window.ethereum
  ) {
    throw new Error(
      "MetaMask is not available."
    );
  }

  if (!TERRYN_NFT_ADDRESS) {
    throw new Error(
      "NEXT_PUBLIC_TERRYN_NFT_ADDRESS is missing."
    );
  }

  if (!ethers.isAddress(TERRYN_NFT_ADDRESS)) {
    throw new Error(
      `Invalid Terryn NFT address: ${TERRYN_NFT_ADDRESS}`
    );
  }

  if (
    !Number.isInteger(TERRYN_NFT_DEPLOY_BLOCK) ||
    TERRYN_NFT_DEPLOY_BLOCK <= 0
  ) {
    throw new Error(
      "NEXT_PUBLIC_TERRYN_NFT_DEPLOY_BLOCK is missing or invalid."
    );
  }

  // ==========================================================
  // PROVIDER
  // ==========================================================

  const provider =
    new ethers.BrowserProvider(
      window.ethereum
    );

  const network =
    await provider.getNetwork();

  if (
    network.chainId !==
    BigInt(SEPOLIA_CHAIN_ID)
  ) {
    throw new Error(
      "Please switch MetaMask to Sepolia."
    );
  }

  console.log(
    "Connected wallet:",
    walletAddress
  );

  console.log(
    "Terryn NFT:",
    TERRYN_NFT_ADDRESS
  );

  // ==========================================================
  // NFT CONTRACT
  // ==========================================================

  const nft =
    new ethers.Contract(
      TERRYN_NFT_ADDRESS,
      nftABI,
      provider
    );

  const latestBlock =
    await provider.getBlockNumber();

  console.log(
    "Deploy block:",
    TERRYN_NFT_DEPLOY_BLOCK
  );

  console.log(
    "Latest block:",
    latestBlock
  );

  // ==========================================================
  // FIND EVERY NFT THAT HAS EVER ENTERED THIS WALLET
  // ==========================================================
  //
  // Transfer(from, to, tokenId)
  //
  // We want:
  // to == connected wallet
  //
  // This catches:
  //
  // Relayer -> Owner
  // Escrow -> Buyer
  // Owner A -> Owner B
  //
  // ==========================================================

  const transferToWalletFilter =
    nft.filters.Transfer(
      null,
      walletAddress,
      null
    );

  const transferEvents =
    await queryEventsInChunks(
      nft,
      transferToWalletFilter,
      TERRYN_NFT_DEPLOY_BLOCK,
      latestBlock
    );

  console.log(
    "Transfer events received by wallet:",
    transferEvents.length
  );

  // ==========================================================
  // UNIQUE TOKEN IDS
  // ==========================================================

  const tokenIds = new Set();

  for (const event of transferEvents) {
    const tokenId =
      event.args?.tokenId;

    if (tokenId !== undefined) {
      tokenIds.add(
        tokenId.toString()
      );
    }
  }

  console.log(
    "Tokens ever received:",
    [...tokenIds]
  );

  const ownedProperties = [];

  // ==========================================================
  // VERIFY CURRENT OWNER
  // ==========================================================

  for (const tokenId of tokenIds) {
    try {
      const currentOwner =
        await nft.ownerOf(
          tokenId
        );

      console.log(
        `Token ${tokenId} current owner:`,
        currentOwner
      );

      console.log(
        `Token ${tokenId} belongs to connected wallet:`,
        currentOwner.toLowerCase() ===
          walletAddress.toLowerCase()
      );

      // If NFT was sold/transferred/listed,
      // the wallet may no longer own it.
      if (
        currentOwner.toLowerCase() !==
        walletAddress.toLowerCase()
      ) {
        continue;
      }

      // ======================================================
      // TOKEN URI
      // ======================================================

      const tokenURI =
        await nft.tokenURI(
          tokenId
        );

      const metadataURL =
        ipfsToHttp(
          tokenURI
        );

      console.log(
        `Token ${tokenId} URI:`,
        tokenURI
      );

      // ======================================================
      // FETCH IPFS METADATA
      // ======================================================

      let metadata = {};

      try {
        const response =
          await fetch(
            metadataURL
          );

        if (!response.ok) {
          throw new Error(
            `Metadata fetch returned HTTP ${response.status}`
          );
        }

        metadata =
          await response.json();

      } catch (metadataError) {
        console.error(
          `Unable to fetch metadata for token ${tokenId}:`,
          metadataError
        );

        metadata = {};
      }

      const attributes =
        Array.isArray(
          metadata.attributes
        )
          ? metadata.attributes
          : [];

      // ======================================================
      // CARD PROPERTY OBJECT
      // ======================================================

      ownedProperties.push({
        tokenId:
          tokenId.toString(),

        nftAddress:
          TERRYN_NFT_ADDRESS,

        owner:
          currentOwner,

        tokenURI,

        name:
          metadata.name ||
          `Terryn Land #${tokenId}`,

        description:
          metadata.description ||
          "",

        land_photo:
          ipfsToHttp(
            metadata.image
          ),

        land_id:
          getAttribute(
            attributes,
            "Land ID"
          ) ||
          tokenId.toString(),

        land_type:
          getAttribute(
            attributes,
            "Classification"
          ) ||
          "Land",

        state:
          getAttribute(
            attributes,
            "State"
          ) ||
          "",

        district:
          getAttribute(
            attributes,
            "District"
          ) ||
          "",

        landmark:
          getAttribute(
            attributes,
            "Landmark"
          ) ||
          "",

        area:
          getAttribute(
            attributes,
            "Area"
          ) ||
          "0",

        dimensions:
          getAttribute(
            attributes,
            "Dimensions"
          ) ||
          "",

        coordinates:
          getAttribute(
            attributes,
            "Coordinates"
          ) ||
          "",
      });

    } catch (error) {
      console.error(
        `Error processing Token ${tokenId}:`,
        error
      );
    }
  }

  // Newest token first

  ownedProperties.sort(
    (a, b) =>
      Number(b.tokenId) -
      Number(a.tokenId)
  );

  console.log(
    "Currently owned Terryn properties:",
    ownedProperties
  );

  return ownedProperties;
}