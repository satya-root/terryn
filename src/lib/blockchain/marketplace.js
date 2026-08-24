import { ethers } from "ethers";

import marketplaceABI from "./abi/TerrynMarketplace.json";
import nftABI from "./abi/TerrynNFT.json";

import {
  TERRYN_NFT_ADDRESS,
  TERRYN_MARKETPLACE_ADDRESS,
} from "./contracts";


async function getSigner() {
  if (
    typeof window === "undefined" ||
    !window.ethereum
  ) {
    throw new Error(
      "MetaMask is not available."
    );
  }

  const provider =
    new ethers.BrowserProvider(
      window.ethereum
    );

  const network =
    await provider.getNetwork();

  if (
    network.chainId !==
    11155111n
  ) {
    throw new Error(
      "Please switch MetaMask to Sepolia."
    );
  }

  return await provider.getSigner();
}


// ============================================================
// APPROVE MARKETPLACE
// ============================================================

export async function approveMarketplace(
  tokenId
) {
  const signer =
    await getSigner();

  const nft =
    new ethers.Contract(
      TERRYN_NFT_ADDRESS,
      nftABI,
      signer
    );

  const tx =
    await nft.approve(
      TERRYN_MARKETPLACE_ADDRESS,
      tokenId
    );

  const receipt =
    await tx.wait();

  return {
    txHash:
      receipt.hash,

    blockNumber:
      receipt.blockNumber,
  };
}


// ============================================================
// LIST NFT
// ============================================================

export async function listLand(
  tokenId,
  priceInINR
) {
  const signer =
    await getSigner();

  const marketplace =
    new ethers.Contract(
      TERRYN_MARKETPLACE_ADDRESS,
      marketplaceABI,
      signer
    );

  const tx =
    await marketplace.listNFT(
      TERRYN_NFT_ADDRESS,
      tokenId,
      priceInINR
    );

  const receipt =
    await tx.wait();

  return {
    txHash:
      receipt.hash,

    blockNumber:
      receipt.blockNumber,
  };
}


// ============================================================
// GET LISTING
// ============================================================

export async function getListing(
  tokenId
) {
  const signer =
    await getSigner();

  const marketplace =
    new ethers.Contract(
      TERRYN_MARKETPLACE_ADDRESS,
      marketplaceABI,
      signer
    );

  const listing =
    await marketplace.listings(
      TERRYN_NFT_ADDRESS,
      tokenId
    );

  return {
    nft:
      listing.nft,

    tokenId:
      listing.tokenId.toString(),

    seller:
      listing.seller,

    priceInINR:
      listing.priceInINR.toString(),

    active:
      listing.active,
  };
}


// ============================================================
// UNLIST / CANCEL LISTING
// ============================================================

export async function cancelLandListing(
  tokenId
) {
  const signer =
    await getSigner();

  const marketplace =
    new ethers.Contract(
      TERRYN_MARKETPLACE_ADDRESS,
      marketplaceABI,
      signer
    );

  const tx =
    await marketplace.cancelListing(
      TERRYN_NFT_ADDRESS,
      tokenId
    );

  console.log(
    "Cancel transaction:",
    tx.hash
  );

  const receipt =
    await tx.wait();

  return {
    txHash:
      receipt.hash,

    blockNumber:
      receipt.blockNumber,
  };
}