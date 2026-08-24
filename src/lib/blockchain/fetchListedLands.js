import { ethers } from "ethers";

import marketplaceABI from "./abi/TerrynMarketplace.json";
import nftABI from "./abi/TerrynNFT.json";

import {
  TERRYN_NFT_ADDRESS,
  TERRYN_MARKETPLACE_ADDRESS,
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


// RPC providers often limit eth_getLogs.
// Query in chunks.
async function queryEventsInChunks(
  contract,
  filter,
  fromBlock,
  toBlock,
  chunkSize = 9000
) {
  const events = [];

  for (
    let start = fromBlock;
    start <= toBlock;
    start += chunkSize
  ) {
    const end = Math.min(
      start + chunkSize - 1,
      toBlock
    );

    const result =
      await contract.queryFilter(
        filter,
        start,
        end
      );

    events.push(...result);
  }

  return events;
}


export async function fetchListedLands() {
  if (
    typeof window === "undefined" ||
    !window.ethereum
  ) {
    throw new Error(
      "MetaMask is required."
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


  const marketplace =
    new ethers.Contract(
      TERRYN_MARKETPLACE_ADDRESS,
      marketplaceABI,
      provider
    );


  // We use the NFT deployment block because
  // Marketplace was deployed around the same time.
  const deployBlock =
    Number(
      process.env
        .NEXT_PUBLIC_TERRYN_NFT_DEPLOY_BLOCK
    );


  if (
    !Number.isInteger(deployBlock) ||
    deployBlock <= 0
  ) {
    throw new Error(
      "Deployment block is missing."
    );
  }


  const latestBlock =
    await provider.getBlockNumber();


  // ==========================================================
  // FIND ALL NFTListed EVENTS
  // ==========================================================

  const listedFilter =
    marketplace.filters.NFTListed();


  const listedEvents =
    await queryEventsInChunks(
      marketplace,
      listedFilter,
      deployBlock,
      latestBlock
    );


  // Same NFT may have been listed multiple times.
  const uniqueTokens =
    new Map();


  for (const event of listedEvents) {
    const nftAddress =
      event.args.nft;

    const tokenId =
      event.args.tokenId;

    const key =
      `${nftAddress.toLowerCase()}-${tokenId.toString()}`;

    uniqueTokens.set(
      key,
      {
        nftAddress,
        tokenId:
          tokenId.toString(),
      }
    );
  }


  const properties = [];


  // ==========================================================
  // CHECK CURRENT LISTING STATE
  // ==========================================================

  for (
    const item of
    uniqueTokens.values()
  ) {
    try {
      const listing =
        await marketplace.listings(
          item.nftAddress,
          item.tokenId
        );


      // Ignore sold / cancelled NFTs.
      if (!listing.active) {
        continue;
      }


      const nft =
        new ethers.Contract(
          item.nftAddress,
          nftABI,
          provider
        );


      const tokenURI =
        await nft.tokenURI(
          item.tokenId
        );


      let metadata = {};

      try {
        const response =
          await fetch(
            ipfsToHttp(
              tokenURI
            )
          );

        if (response.ok) {
          metadata =
            await response.json();
        }
      } catch (error) {
        console.error(
          `Metadata error for Token ${item.tokenId}:`,
          error
        );
      }


      const attributes =
        metadata.attributes || [];


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
            .map((value) =>
              Number.parseFloat(
                value.trim()
              )
            );

        if (
          Number.isFinite(parts[0]) &&
          Number.isFinite(parts[1])
        ) {
          latitude = parts[0];
          longitude = parts[1];
        }
      }


      properties.push({
        tokenId:
          item.tokenId,

        nftAddress:
          item.nftAddress,

        seller:
          listing.seller,

        priceInINR:
          listing.priceInINR.toString(),

        active:
          listing.active,

        tokenURI,

        name:
          metadata.name ||
          `Terryn Land #${item.tokenId}`,

        description:
          metadata.description || "",

        land_photo:
          ipfsToHttp(
            metadata.image
          ),

        ror_document:
          ipfsToHttp(
            metadata.document
          ),

        land_id:
          getAttribute(
            attributes,
            "Land ID"
          ) ||
          item.tokenId,

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
          ),

        coordinates,

        geo_lat:
          latitude,

        geo_lng:
          longitude,
      });

    } catch (error) {
      console.error(
        `Listing error for token ${item.tokenId}:`,
        error
      );
    }
  }


  properties.sort(
    (a, b) =>
      Number(b.tokenId) -
      Number(a.tokenId)
  );


  return properties;
}