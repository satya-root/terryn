import { ethers } from "ethers";

import nftABI from "./abi/TerrynNFT.json";

import {
  TERRYN_NFT_ADDRESS,
  SEPOLIA_CHAIN_ID,
} from "./contracts";


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


function getAttribute(attributes, traitName) {
  if (!Array.isArray(attributes)) {
    return "";
  }

  return (
    attributes.find(
      (item) =>
        item.trait_type === traitName
    )?.value || ""
  );
}


export async function fetchLandByTokenId(tokenId) {
  if (
    typeof window === "undefined" ||
    !window.ethereum
  ) {
    throw new Error(
      "MetaMask is not available."
    );
  }


  if (
    tokenId === undefined ||
    tokenId === null ||
    tokenId === ""
  ) {
    throw new Error(
      "Token ID is required."
    );
  }


  if (!TERRYN_NFT_ADDRESS) {
    throw new Error(
      "Terryn NFT address is missing."
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
    BigInt(SEPOLIA_CHAIN_ID)
  ) {
    throw new Error(
      "Please switch MetaMask to Sepolia."
    );
  }


  const nft =
    new ethers.Contract(
      TERRYN_NFT_ADDRESS,
      nftABI,
      provider
    );


  // ==========================================================
  // OWNER
  // ==========================================================

  const owner =
    await nft.ownerOf(tokenId);


  // ==========================================================
  // TOKEN URI
  // ==========================================================

  const tokenURI =
    await nft.tokenURI(tokenId);


  const metadataURL =
    ipfsToHttp(tokenURI);


  // ==========================================================
  // METADATA
  // ==========================================================

  const response =
    await fetch(metadataURL);


  if (!response.ok) {
    throw new Error(
      "Unable to load NFT metadata."
    );
  }


  const metadata =
    await response.json();


  const attributes =
    metadata.attributes || [];


  // ==========================================================
  // COORDINATES
  // ==========================================================

  const coordinates =
    getAttribute(
      attributes,
      "Coordinates"
    );


  let latitude = null;
  let longitude = null;


  if (coordinates) {
    const parts =
      String(coordinates)
        .split(",")
        .map((item) =>
          Number.parseFloat(
            item.trim()
          )
        );


    if (
      parts.length >= 2 &&
      Number.isFinite(parts[0]) &&
      Number.isFinite(parts[1])
    ) {
      latitude = parts[0];
      longitude = parts[1];
    }
  }


  // ==========================================================
  // DIMENSIONS
  // ==========================================================

  const dimensions =
    getAttribute(
      attributes,
      "Dimensions"
    );


  let length = "";
  let width = "";


  if (dimensions) {

    // Handles:
    // 60 x 40
    // 60x40
    // 60ft x 40ft

    const matches =
      String(dimensions).match(
        /([\d.]+)\s*(?:ft)?\s*[xX×]\s*([\d.]+)/
      );


    if (matches) {
      length = matches[1];
      width = matches[2];
    }
  }


  return {
    // Blockchain

    tokenId:
      tokenId.toString(),

    nftAddress:
      TERRYN_NFT_ADDRESS,

    owner,

    tokenURI,


    // Metadata

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

    ror_document:
      ipfsToHttp(
        metadata.document
      ),


    // Terryn attributes

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

    area:
      getAttribute(
        attributes,
        "Area"
      ) ||
      "0",

    dimensions,

    length,

    width,

    coordinates,

    geo_lat:
      latitude,

    geo_lng:
      longitude,

    state:
      getAttribute(
        attributes,
        "State"
      ),

    district:
      getAttribute(
        attributes,
        "District"
      ),

    landmark:
      getAttribute(
        attributes,
        "Landmark"
      ),
  };
}