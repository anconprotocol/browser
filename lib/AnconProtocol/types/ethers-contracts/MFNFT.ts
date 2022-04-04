/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface MFNFTInterface extends utils.Interface {
  functions: {
    "_id()": FunctionFragment;
    "onERC721Received(address,address,uint256,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "setParentNFT(address,uint256,uint256)": FunctionFragment;
    "getTokenId(address,uint256)": FunctionFragment;
    "isRegistered(address,uint256)": FunctionFragment;
    "parentToken(uint256)": FunctionFragment;
    "parentTokenId(uint256)": FunctionFragment;
    "totalSupply(uint256)": FunctionFragment;
    "balanceOf(address,uint256)": FunctionFragment;
    "allowance(address,address,uint256)": FunctionFragment;
    "transfer(address,uint256,uint256)": FunctionFragment;
    "approve(address,uint256,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256,uint256)": FunctionFragment;
    "increaseAllowance(address,uint256,uint256)": FunctionFragment;
    "decreaseAllowance(address,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "_id", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setParentNFT",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegistered",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "parentToken",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "parentTokenId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [string, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "_id", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setParentNFT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTokenId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isRegistered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "parentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "parentTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256,uint256)": EventFragment;
    "TokenAddition(address,uint256,uint256,uint256)": EventFragment;
    "Transfer(address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenAddition"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  { owner: string; spender: string; tokenId: BigNumber; value: BigNumber }
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type TokenAdditionEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  { token: string; tokenId: BigNumber; _id: BigNumber; totalSupply: BigNumber }
>;

export type TokenAdditionEventFilter = TypedEventFilter<TokenAdditionEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  { from: string; to: string; tokenId: BigNumber; value: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface MFNFT extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MFNFTInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    _id(overrides?: CallOverrides): Promise<[BigNumber]>;

    /**
     * Mandatory function to receive NFT as a contract(CA)
     */
    onERC721Received(
      _operator: string,
      _from: string,
      _tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    /**
     * (ERC165) Determines if this contract supports Re-FT(ERC1633).
     * @param interfaceID The bytes4 to query if it matches with the contract interface id.
     */
    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    /**
     * Sets the Address of NFT Contract Address & NFT Token ID
     * @param parentNFTContractAddress The address NFT Contract address.
     * @param parentNFTTokenId The token id of NFT.
     */
    setParentNFT(
      parentNFTContractAddress: string,
      parentNFTTokenId: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    /**
     * Returns the tokenId of with the given NFT information
     */
    getTokenId(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    /**
     * Returns if the NFT is owned(fractionalized) by this contract.
     */
    isRegistered(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    /**
     * Returns the Address of Parent Token Address
     */
    parentToken(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    /**
     * Returns the Token ID of NFT
     */
    parentTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    /**
     * Total number of tokens in existence
     */
    totalSupply(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    /**
     * Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     */
    balanceOf(
      owner: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    /**
     * Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     */
    allowance(
      owner: string,
      spender: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    /**
     * Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    transfer(
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    /**
     * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    approve(
      spender: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    /**
     * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    /**
     * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param addedValue The amount of tokens to increase the allowance by.
     * @param spender The address which will spend the funds.
     */
    increaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    /**
     * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    decreaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  _id(overrides?: CallOverrides): Promise<BigNumber>;

  /**
   * Mandatory function to receive NFT as a contract(CA)
   */
  onERC721Received(
    _operator: string,
    _from: string,
    _tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  /**
   * (ERC165) Determines if this contract supports Re-FT(ERC1633).
   * @param interfaceID The bytes4 to query if it matches with the contract interface id.
   */
  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  /**
   * Sets the Address of NFT Contract Address & NFT Token ID
   * @param parentNFTContractAddress The address NFT Contract address.
   * @param parentNFTTokenId The token id of NFT.
   */
  setParentNFT(
    parentNFTContractAddress: string,
    parentNFTTokenId: BigNumberish,
    totalSupply: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  /**
   * Returns the tokenId of with the given NFT information
   */
  getTokenId(
    token: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * Returns if the NFT is owned(fractionalized) by this contract.
   */
  isRegistered(
    token: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  /**
   * Returns the Address of Parent Token Address
   */
  parentToken(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  /**
   * Returns the Token ID of NFT
   */
  parentTokenId(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * Total number of tokens in existence
   */
  totalSupply(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * Gets the balance of the specified address.
   * @param owner The address to query the balance of.
   */
  balanceOf(
    owner: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   */
  allowance(
    owner: string,
    spender: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * Transfer token for a specified address
   * @param to The address to transfer to.
   * @param value The amount to be transferred.
   */
  transfer(
    to: string,
    tokenId: BigNumberish,
    value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  /**
   * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  approve(
    spender: string,
    tokenId: BigNumberish,
    value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  /**
   * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param value uint256 the amount of tokens to be transferred
   */
  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  /**
   * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
   * @param addedValue The amount of tokens to increase the allowance by.
   * @param spender The address which will spend the funds.
   */
  increaseAllowance(
    spender: string,
    tokenId: BigNumberish,
    addedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  /**
   * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
   * @param spender The address which will spend the funds.
   * @param subtractedValue The amount of tokens to decrease the allowance by.
   */
  decreaseAllowance(
    spender: string,
    tokenId: BigNumberish,
    subtractedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    _id(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Mandatory function to receive NFT as a contract(CA)
     */
    onERC721Received(
      _operator: string,
      _from: string,
      _tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    /**
     * (ERC165) Determines if this contract supports Re-FT(ERC1633).
     * @param interfaceID The bytes4 to query if it matches with the contract interface id.
     */
    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Sets the Address of NFT Contract Address & NFT Token ID
     * @param parentNFTContractAddress The address NFT Contract address.
     * @param parentNFTTokenId The token id of NFT.
     */
    setParentNFT(
      parentNFTContractAddress: string,
      parentNFTTokenId: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    /**
     * Returns the tokenId of with the given NFT information
     */
    getTokenId(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Returns if the NFT is owned(fractionalized) by this contract.
     */
    isRegistered(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Returns the Address of Parent Token Address
     */
    parentToken(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    /**
     * Returns the Token ID of NFT
     */
    parentTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Total number of tokens in existence
     */
    totalSupply(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     */
    balanceOf(
      owner: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     */
    allowance(
      owner: string,
      spender: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    transfer(
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    approve(
      spender: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param addedValue The amount of tokens to increase the allowance by.
     * @param spender The address which will spend the funds.
     */
    increaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      addedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    decreaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      subtractedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "Approval(address,address,uint256,uint256)"(
      owner?: string | null,
      spender?: string | null,
      tokenId?: null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      spender?: string | null,
      tokenId?: null,
      value?: null
    ): ApprovalEventFilter;

    "TokenAddition(address,uint256,uint256,uint256)"(
      token?: string | null,
      tokenId?: null,
      _id?: null,
      totalSupply?: null
    ): TokenAdditionEventFilter;
    TokenAddition(
      token?: string | null,
      tokenId?: null,
      _id?: null,
      totalSupply?: null
    ): TokenAdditionEventFilter;

    "Transfer(address,address,uint256,uint256)"(
      from?: string | null,
      to?: string | null,
      tokenId?: null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: null,
      value?: null
    ): TransferEventFilter;
  };

  estimateGas: {
    _id(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * Mandatory function to receive NFT as a contract(CA)
     */
    onERC721Received(
      _operator: string,
      _from: string,
      _tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * (ERC165) Determines if this contract supports Re-FT(ERC1633).
     * @param interfaceID The bytes4 to query if it matches with the contract interface id.
     */
    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Sets the Address of NFT Contract Address & NFT Token ID
     * @param parentNFTContractAddress The address NFT Contract address.
     * @param parentNFTTokenId The token id of NFT.
     */
    setParentNFT(
      parentNFTContractAddress: string,
      parentNFTTokenId: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    /**
     * Returns the tokenId of with the given NFT information
     */
    getTokenId(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Returns if the NFT is owned(fractionalized) by this contract.
     */
    isRegistered(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the Address of Parent Token Address
     */
    parentToken(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the Token ID of NFT
     */
    parentTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Total number of tokens in existence
     */
    totalSupply(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     */
    balanceOf(
      owner: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     */
    allowance(
      owner: string,
      spender: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    transfer(
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    /**
     * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    approve(
      spender: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    /**
     * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    /**
     * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param addedValue The amount of tokens to increase the allowance by.
     * @param spender The address which will spend the funds.
     */
    increaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    /**
     * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    decreaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _id(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    /**
     * Mandatory function to receive NFT as a contract(CA)
     */
    onERC721Received(
      _operator: string,
      _from: string,
      _tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * (ERC165) Determines if this contract supports Re-FT(ERC1633).
     * @param interfaceID The bytes4 to query if it matches with the contract interface id.
     */
    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Sets the Address of NFT Contract Address & NFT Token ID
     * @param parentNFTContractAddress The address NFT Contract address.
     * @param parentNFTTokenId The token id of NFT.
     */
    setParentNFT(
      parentNFTContractAddress: string,
      parentNFTTokenId: BigNumberish,
      totalSupply: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    /**
     * Returns the tokenId of with the given NFT information
     */
    getTokenId(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Returns if the NFT is owned(fractionalized) by this contract.
     */
    isRegistered(
      token: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Returns the Address of Parent Token Address
     */
    parentToken(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Returns the Token ID of NFT
     */
    parentTokenId(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Total number of tokens in existence
     */
    totalSupply(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Gets the balance of the specified address.
     * @param owner The address to query the balance of.
     */
    balanceOf(
      owner: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     */
    allowance(
      owner: string,
      spender: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * Transfer token for a specified address
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    transfer(
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    /**
     * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender. Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    approve(
      spender: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    /**
     * Transfer tokens from one address to another. Note that while this function emits an Approval event, this is not required as per the specification, and other compliant implementations may not emit the event.
     * @param from address The address which you want to send tokens from
     * @param to address The address which you want to transfer to
     * @param value uint256 the amount of tokens to be transferred
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    /**
     * Increase the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To increment allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param addedValue The amount of tokens to increase the allowance by.
     * @param spender The address which will spend the funds.
     */
    increaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    /**
     * Decrease the amount of tokens that an owner allowed to a spender. approve should be called when allowed_[_spender] == 0. To decrement allowed value is better to use this function to avoid 2 calls (and wait until the first transaction is mined) From MonolithDAO Token.sol Emits an Approval event.
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    decreaseAllowance(
      spender: string,
      tokenId: BigNumberish,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
