import { useSimulateContract, useWriteContract } from 'wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { abi } from '../abi';
import { TContractWriteProps } from './types';
import { wagmiConfig } from '../config';
import { useEffect, useRef } from 'react';

export const useContractWrite = (props: TContractWriteProps) => {
  const { data: simulateData } = useSimulateContract({
    address: props.address,
    abi: abi,
    chainId: props.chainID,
    functionName: props.functionName,
    args: props.args,
    query: {
      enabled: props.enabled !== false,
    },
  });

  const { writeContract, isSuccess, data, isPending, isError, error } = useWriteContract();

  const onSuccessRef = useRef(props.onSuccess);
  const onErrorRef = useRef(props.onError);

  useEffect(() => {
    onSuccessRef.current = props.onSuccess;
    onErrorRef.current = props.onError;
  }, [props.onSuccess, props.onError]);

  useEffect(() => {
    if (isSuccess && data && onSuccessRef.current) {
      onSuccessRef.current(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && error && onErrorRef.current) {
      onErrorRef.current(error);
    }
  }, [isError, error]);

  const write = () => {
    if (simulateData?.request) {
      writeContract(simulateData.request);
    }
  };

  const writeWithoutSimulation = () => {
    writeContract({
      address: props.address,
      abi: abi,
      chainId: props.chainID,
      functionName: props.functionName,
      args: props.args,
    });
  };

  return {
    write,
    writeWithoutSimulation,
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
    chainId: props.chainID as 1 | 42161 | 8453 | undefined,
    functionName: props.functionName,
    args: props.args,
  });

  return writeContract(wagmiConfig, request);
};
