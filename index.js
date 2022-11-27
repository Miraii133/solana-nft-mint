import { Metaplex, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import fs from 'fs';
import fsPromises from 'fs/promises';
import { keypairIdentity } from "@metaplex-foundation/js";

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(fs.readFileSync('/home/address/solana_wallet/my-keypair.json').toString())
    )
  );

const metaplex = new Metaplex(connection)
.use(keypairIdentity(wallet))
.use(bundlrStorage({
  address: 'https://devnet.bundlr.network',
  providerUrl: 'https://api.devnet.solana.com',
  timeout: 60000,
}))


let jsonBuffer = await fsPromises.readFile('/home/address/Pictures/Minecraft/self1.png');
const image =  await toMetaplexFile(jsonBuffer, 'self1.png', {
    contentType: 'image/png',
    extension: 'png'
  })


const { uri } = await metaplex.nfts().uploadMetadata({
    name: "Miraii_NFT",
    description: "My description",
    image,
    attributes: [
      { trait_type: "Name:", value: "Hidden Glitch Pop" },
      { trait_type: "Made by:", value: "Miraii()" },
      { trait_type: "Made for:", value: "IT Week Minecraft Competition" },
      { trait_type: "Total Time Spent:", value: "2 weeks planning and building" },
    ]
    // email //favorite color
})

const { nft } = await metaplex.nfts().create({
    uri,
    name: "My NFT",
    sellerFeeBasisPoints: 500, // Represents 5.00%.
});

console.log(nft.mint.address.toBase58());
