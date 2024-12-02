import {
    BlockfrostProvider,
    MeshTxBuilder,
    MeshWallet,
    deserializeAddress,
} from "@meshsdk/core";
import { UTxO } from "@meshsdk/common";
import dotenv from "dotenv";
dotenv.config();
import blueprint from "../onchain/plutus.json" with { type: "json" };

// Setup blockhain provider as Maestro
// const maestroKey = process.env.MAESTRO_KEY;
// if (!maestroKey) {
//     throw new Error("MAESTRO_KEY does not exist");
// }
// const blockchainProvider = new MaestroProvider({
//     network: 'Preprod',
//     apiKey: maestroKey,
// });

// Setup blockhain provider as Blockfrost
const blockfrostId = process.env.BLOCKFROST_ID;
if (!blockfrostId) {
    throw new Error("BLOCKFROST_ID does not exist");
}
const blockchainProvider = new BlockfrostProvider(blockfrostId);

// import admin's wallet passphrase and initialize the wallet
const wallet1Passphrase = process.env.WALLET_PASSPHRASE_ONE;
if (!wallet1Passphrase) {
    throw new Error("WALLET_PASSPHRASE_ONE does not exist");
}
const wallet1 = new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
        type: "mnemonic",
        words: wallet1Passphrase.split(' ')
    },
});

const wallet1Address = await wallet1.getChangeAddress();

const wallet1Utxos = await wallet1.getUtxos();
const wallet1Collateral: UTxO = (await wallet1.getCollateral())[0]
if (!wallet1Collateral) {
    throw new Error('No collateral utxo found');
}

const { pubKeyHash: wallet1VK } = deserializeAddress(wallet1Address);

// Create transaction builder
const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    verbose: false,
});
txBuilder.setNetwork('preprod');

export {
    blueprint,
    blockchainProvider,
    txBuilder,
    wallet1,
    wallet1Address,
    wallet1VK,
    wallet1Utxos,
    wallet1Collateral,
}
