import React, { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { abi, STAKING_CONTRACT_ADDRESS } from "../constants";

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Nft Minting Page",
      infuraId: { 56: "https://bsc-dataseed1.binance.org/" },
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
      if (web3ModalProvider) {
        setWeb3Provider(web3ModalProvider);
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer);
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        abi,
        signer
      );
      console.log(stakingContract);
      const stakedBalance = await stakingContract.totalStaked();
      const convertedBalance = ethers.utils.formatEther(stakedBalance);
      document.getElementById('balance').innerHTML = convertedBalance;
      console.log(convertedBalance);

      const tx = await stakingContract.deposit({
        to: stakingContract,
        value: ethers.utils.formatEther("0.25"),
      })
      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
      <h1 className="text-4xl font-medium">RBTR Staking Dapp</h1>

      <div className="my-5">
        <div className="w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
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
      </div>
      <div action="" className="my-10">
        <div className="flex flex-col space-y-5">
          <label htmlFor="number">
            <p className="font-medium text-slate-700 pb-2">
              Total Arbritage Token Staked <span id="balance"></span>
            </p>
            <p className="font-medium text-slate-700 pb-2">
              Available Arbritage Token To Stake
            </p>
            <input
              id="number"
              name="number"
              type="number"
              className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Enter amount to stake"
            />
            <button className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300">
              Stake
            </button>
          </label>
          <label htmlFor="number">
            <p className="font-medium text-slate-700 pb-2">
              Available Arbritage Token To Claim
            </p>
            <input
              id="number"
              name="number"
              type="number"
              className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Amount"
            />
            <button className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300">
              Claim
            </button>
          </label>
          <button className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
            <span>Claim All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stake;
