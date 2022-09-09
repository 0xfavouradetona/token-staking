import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import {
  abi,
  STAKING_CONTRACT_ADDRESS,
  TOKEN_ADDRESS,
  ERC20_ABI,
} from "../constants";
import getContract from "../utils/getContract";

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
  const [amount, setAmount] = useState(0);
  const [stakeTnx, approveTnx] = useState(null);

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    connectWallet();
  }, 1000)

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
      let ERC = " ERC";
      const stakedBalance = await stakingContract.s_totalSupply();
      const convertedBalance = ethers.utils.formatEther(stakedBalance);
      document.getElementById("balance").innerHTML = convertedBalance + ERC;
      console.log(convertedBalance);

      const stakedBalances = await stakingContract.s_balances();
      const convertedBalances = ethers.utils.formatEther(stakedBalances);
      document.getElementById("balance").innerHTML = convertedBalances + ERC;
      console.log(convertedBalance);

      // const tx = await stakingContract.deposit({
      //   to: stakingContract,
      //   value: ethers.utils.formatEther("0.25"),
      // });
      // console.log(tx);
    } catch (error) {
      console.error(error);
    }
  }
  let status = "Success. Transaction Hash: ";
  async function approve(stake) {
    if (amount < 0) return;

    //  approve staking contract
    const Erc20contract = getContract(true, TOKEN_ADDRESS, ERC20_ABI);

    const contract = getContract(true);
    const approveValue = document.getElementById('number').value;
    const convertedApprove = approveValue * 10 ** 18;
    const convertApprove = convertedApprove.toString();
    const ApproveTxn = await Erc20contract.approve(
      STAKING_CONTRACT_ADDRESS,
      convertApprove
    );
   const tnxHash = await ApproveTxn.hash;
   approveTnx(tnxHash);
   stake()

   async function stake(){
    if(amount < 0) return;

    //stake value from staking contract
    const stakingContract = getContract(true, STAKING_CONTRACT_ADDRESS, abi);
    const contract = getContract(true);
    console.log(stakingContract)
    const stakeValue = document.getElementById('number').value;
    const convertedStake = stakeValue * 10 ** 18;
    const convertedValue = convertedStake.toString();
    const StakingTnx = await stakingContract.stake(convertedValue)
    const getStakingHash = await StakingTnx.hash;
    document.getElementById('status').innerHTML = status + getStakingHash;
  }

  }

  async function withdraw(){
    if(amount < 0) return;

    //withdraw value from staking contract
    const stakingContract = getContract(true, STAKING_CONTRACT_ADDRESS, abi);
    const contract = getContract(true);

    const stakeValue = document.getElementById('numberWithdraw').value;
    const convertedStake = stakeValue * 10 ** 18;
    const convertedValue = convertedStake.toString();
    const StakingTnx = await stakingContract.withdraw(convertedValue)
    const getStakingHash = await StakingTnx.hash;
    document.getElementById('withdrawStatus').innerHTML = status + getStakingHash;
  }


 


  return (
    <div className="max-w-lg p-8 mx-auto my-10 bg-white shadow rounded-xl shadow-slate-300">
      <h1 className="text-4xl font-medium">RBTR Staking Dapp</h1>

      <div className="my-5">
        <div className="flex items-center justify-center w-full py-3 my-3 space-x-2 text-center transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow">
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
            <p className="pb-2 font-medium text-slate-700">
              Total Arbritage Token Staked <span id="balance"></span>
            </p>
            <p className="pb-2 font-medium text-slate-700">
              Available Arbritage Token To Stake
            </p>
            <input
              id="number"
              name="number"
              type="number"
              value={amount}
              onChange={handleAmount}
              className="w-full px-3 py-3 border rounded-lg border-slate-200 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Enter amount to stake"
            />
            <button
              onClick={approve}
              className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300"
            >
              {stakeTnx ? "stake": "approve"}
            </button>
          </label>
          <p className="pb-2 font-medium text-slate-700" id="status" style={{color: "green"}}></p>
          <label htmlFor="number">
            <p className="pb-2 font-medium text-slate-700">
              Withdraw Token
            </p>
            <input
              id="numberWithdraw"
              name="number"
              type="number"
              className="w-full px-3 py-3 border rounded-lg border-slate-200 focus:outline-none focus:border-slate-500 hover:shadow"
              placeholder="Amount"
            />
            <button className="py-2 px-2 font-medium text-white bg-[#7245FA] rounded transition duration-300" onClick={withdraw}>
              Withdraw
            </button>
          </label>
          <p id="withdrawStatus" style={{color: "green"}}></p>
          <button className="inline-flex items-center justify-center w-full py-3 space-x-2 font-medium text-white bg-indigo-600 border-indigo-500 rounded-lg hover:bg-indigo-500 hover:shadow">
            <span>Claim All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stake;
