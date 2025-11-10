import { useSimulateContract, useWriteContract } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { abi } from '../abi';
import { TContractWriteProps } from './types';
import { wagmiConfig } from '../config';

export const useContractWrite = (props: TContractWriteProps) => {
  const { data: simulateData } = useSimulateContract({
    address: props.address,
    abi: abi,
    chainId: props.chainID,
    functionName: props.functionName,
    args: props.args,
  });

  const { writeContract, isSuccess, data, isPending, isError, error } = useWriteContract();

  return {
    write: () =>
      simulateData && simulateData?.request ? writeContract(simulateData.request) : null,
    data,
    isSuccess,
    isLoading: isPending,
    isError,
    error,
  };
};

export const contractWrite = async (props: TContractWriteProps) => {
  const { request } = await simulateContract(wagmiConfig, {
    abi: abi,
    address: props.address,
    chainId: props.chainID,
    functionName: props.functionName,
    args: props.args,
  });

  return writeContract(wagmiConfig, request);
};
