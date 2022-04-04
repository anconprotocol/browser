/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
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

export interface FaucetInterface extends utils.Interface {
  functions: {
    "token1()": FunctionFragment;
    "token2()": FunctionFragment;
    "getTokenFromFaucet(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "token1", values?: undefined): string;
  encodeFunctionData(functionFragment: "token2", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getTokenFromFaucet",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "token1", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token2", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTokenFromFaucet",
    data: BytesLike
  ): Result;

  events: {
    "Withdrawn(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export type WithdrawnEvent = TypedEvent<
  [string, BigNumber],
  { paymentAddress: string; amount: BigNumber }
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface Faucet extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FaucetInterface;

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
    token1(overrides?: CallOverrides): Promise<[string]>;

    token2(overrides?: CallOverrides): Promise<[string]>;

    getTokenFromFaucet(
      payee: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  token1(overrides?: CallOverrides): Promise<string>;

  token2(overrides?: CallOverrides): Promise<string>;

  getTokenFromFaucet(
    payee: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    token1(overrides?: CallOverrides): Promise<string>;

    token2(overrides?: CallOverrides): Promise<string>;

    getTokenFromFaucet(payee: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "Withdrawn(address,uint256)"(
      paymentAddress?: string | null,
      amount?: null
    ): WithdrawnEventFilter;
    Withdrawn(
      paymentAddress?: string | null,
      amount?: null
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    token1(overrides?: CallOverrides): Promise<BigNumber>;

    token2(overrides?: CallOverrides): Promise<BigNumber>;

    getTokenFromFaucet(
      payee: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    token1(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token2(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenFromFaucet(
      payee: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
