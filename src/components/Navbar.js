import React, { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Nft Minting Page",
      infuraId: { 3: "https://goerli.infura.io/v3/fefnefnesfe" },
    },
  },
};

const Navbar = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  async function connectWallet() {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });
      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(
        web3ModalInstance
      );
      console.log(web3ModalProvider);
      if (web3ModalProvider) {
        setWeb3Provider(web3ModalProvider);
      }
      const provider = new ethers.providers.Web3Provider(web3ModalProvider);
      const signer = await provider.getSigner();
      console.log(signer);
      console.log(web3ModalProvider);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container flex items-center px-40 py-8">
      {web3Provider == null ? (
        //run if null,
        <button
          className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          {/* <p>{ethers.utils.formatEther(web3Provider.provider.getBalance(web3Provider.provider.selectedAddress))} ETH</p> */}
          <p>
            {web3Provider.provider.selectedAddress.slice(0, 6)}...
            {web3Provider.provider.selectedAddress.slice(
              web3Provider.provider.selectedAddress.length - 4,
              web3Provider.provider.selectedAddress.length
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
