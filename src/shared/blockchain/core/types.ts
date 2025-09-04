export type TAddress = `0x${string}`;

export type TArg = bigint | boolean | number | string | TAddress | undefined;

export type TChainID = 1 | 10 | 137 | 42161 | 8453;

export type TContractWriteProps = {
  address: TAddress;
  functionName: string;
  args: TArg[];
  chainID?: TChainID;
};

export type TVault = {
  chainID: TChainID;
  chainName: string;
  vaultAddress: TAddress;
  decimals: number;
  coinName: string;
  coinAddress: TAddress;
};
