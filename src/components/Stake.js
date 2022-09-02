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

const Stake = () => {
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
      } catch (error) {
        console.error(error);
      }
    }
  return (
    <div class="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <h1 class="text-4xl font-medium">RBTR Staking Dapp</h1>

      <div class="my-5">
        <button class="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
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
        </button>
      </div>
      <form action="" class="my-10">
        <div class="flex flex-col space-y-5">
          <label for="number">
            <p class="font-medium text-slate-700 pb-2">Available Arbritage Token To Stake</p>
            <input
              id="number"
              name="number"
              type="number"
              class="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Enter amount to stake"
            />
            <button className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300">
                Stake
            </button>
          </label>
          <label for="number">
            <p class="font-medium text-slate-700 pb-2">Available Arbritage Token To Claim</p>
            <input
              id="number"
              name="number"
              type="number"
              class="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Amount"
            />
            <button className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300">
                Claim
            </button>
          </label>
          <button class="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
            <span>Claim All</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Stake;
