import { DepositModal } from '@/features/deposit/ui/DepositModal';
import { TAddress } from '@/shared/blockchain';
import { useModal } from '@/shared/ui/modal';
import { LiFiWidget, useWidgetEvents, WidgetConfig, WidgetEvent } from '@lifi/widget';
import { useEffect, useMemo } from 'react';

export const SwapWidget = ({
  coinAddress,
  chainID,
}: {
  coinAddress: TAddress;
  chainID: number;
}) => {
  const widgetEvents = useWidgetEvents();
  const { open } = useModal();

  useEffect(() => {
    const onRouteExecutionCompleted = () => {
      open(<DepositModal />);
    };

    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onRouteExecutionCompleted);

    return () => widgetEvents.all.clear();
  }, [widgetEvents, open]);

  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      appearance: 'light',
      toChain: chainID,
      toToken: coinAddress,
      disabledUI: ['toAddress', 'toToken'],
      theme: {
        container: {
          borderRadius: '16px',
        },
      },
      integrator: 'Thesauros',
    }),
    [coinAddress, chainID]
  );

  return <LiFiWidget integrator="Thesauros" config={widgetConfig} />;
};
