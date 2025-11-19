import { useEffect } from 'react';
import { useBlockNumber, useReadContract as useReadContractWagmi } from 'wagmi';
import { ReadContractReturnType } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { simulateContract, readContract } from '@wagmi/core';
import { abi } from '../abi';
import { wagmiConfig } from '../config';
import { TAddress, TArg, TChainID } from './types';

type TContractReadProps = {
  address: TAddress;
  functionName: string;
  args?: TArg[];
  chainID: TChainID;
  watch?: boolean;
  staleTime?: number;
  selectData?: ((data: ReadContractReturnType) => unknown) | undefined;
  isEnabled?: boolean;
};

export const useContractRead = ({
  address,
  functionName,
  args,
  chainID,
  watch,
  staleTime,
  selectData,
  isEnabled,
}: TContractReadProps) => {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: watch,
  });

  const staleTimeResult = watch ? Infinity : (staleTime ?? 0);

  const result = useReadContractWagmi({
    address: address,
    abi: abi,
    chainId: chainID,
    functionName: functionName,
    args: args ?? [],
    query: {
      enabled: isEnabled,
      select: selectData,
      staleTime: staleTimeResult,
    },
  });

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: result.queryKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, watch, queryClient]);

  return result;
};

export const contractRead = async <T>(props: TContractReadProps): Promise<T> => {
  const { request } = await simulateContract(wagmiConfig, {
    abi: abi,
    address: props.address,
    chainId: props.chainID,
    functionName: props.functionName,
    args: props.args,
  });

  const { account: _account, ...readRequest } = request;
  return readContract(wagmiConfig, readRequest);
};
