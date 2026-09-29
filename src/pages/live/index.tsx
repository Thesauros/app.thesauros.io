import Head from 'next/head';
import { LiveScreen } from '@/screens/live-screen';

export default function LivePage() {
  return (
    <>
      <Head>
        <title>Thesauros — cross-chain vault, live</title>
        <meta
          name="description"
          content="Where every USDC in the Thesauros cross-chain vault is right now: cash, lending positions and transfers between Base and Arbitrum, read from the blockchain."
        />
        <meta name="robots" content="index,follow" />
      </Head>
      <LiveScreen />
    </>
  );
}
