import { ethers } from "ethers";

import nftAbi from "./abi/TerrynNFT.json";

import {
  TERRYN_NFT_ADDRESS,
  TERRYN_MARKETPLACE_ADDRESS,
} from "./contracts";

import { connectWallet } from "./wallet";

export async function getNFTContract() {
  const { signer } = await connectWallet();

  return new ethers.Contract(
    TERRYN_NFT_ADDRESS,
    nftAbi,
    signer
  );
}

export async function mintLandNFT(tokenURI) {
  const nft = await getNFTContract();

  const tx = await nft.mint(tokenURI);

  const receipt = await tx.wait();

  return receipt;
}

export async function approveMarketplace(tokenId) {
  const nft = await getNFTContract();

  const tx = await nft.approve(
    TERRYN_MARKETPLACE_ADDRESS,
    tokenId
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function getNFTOwner(tokenId) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(
    window.ethereum
  );

  const nft = new ethers.Contract(
    TERRYN_NFT_ADDRESS,
    nftAbi,
    provider
  );

  return await nft.ownerOf(tokenId);
}

export async function getNFTTokenURI(tokenId) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(
    window.ethereum
  );

  const nft = new ethers.Contract(
    TERRYN_NFT_ADDRESS,
    nftAbi,
    provider
  );

  return await nft.tokenURI(tokenId);
}