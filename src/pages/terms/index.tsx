import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/typography/heading';
import { Texting } from '@/shared/ui/typography/texting';
import styles from './terms.module.scss';

export default function TermsPage() {
  return (
    <FlexBlock direction="column" className={styles.container}>
      <div className={styles.content}>
        <Heading level={1} weight="semibold" className={styles.title}>
          Terms of Use
        </Heading>
        <Texting level={2} weight="medium" className={styles.subtitle}>
          Thesauros Protocol
        </Texting>
        <Texting level={3} weight="regular" className={styles.date}>
          Last Updated: August 26, 2025
        </Texting>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            1. ACCEPTANCE OF TERMS
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            By accessing, connecting your wallet to, or using the Thesauros Protocol interface (the
            &ldquo;Protocol&rdquo;), you (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or
            &ldquo;your&rdquo;) agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If
            you do not agree to these Terms, do not use the Protocol.
          </Texting>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            The Thesauros Protocol is an automated yield optimization platform that redistributes
            user funds across various decentralized finance (DeFi) protocols to maximize returns
            while minimizing risks.
          </Texting>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            <strong>Important:</strong> These Terms constitute a legally binding agreement between
            you and the Protocol. By using our services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms, including all disclaimers and risk
            disclosures.
          </Texting>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            2. DESCRIPTION OF SERVICE
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            2.1 Protocol Overview
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            Thesauros Protocol provides:
          </Texting>
          <ul className={styles.list}>
            <li>Automated yield farming optimization across multiple DeFi protocols</li>
            <li>Smart contract-based vault system for stablecoin deposits (USDC, USDT, DAI)</li>
            <li>Automated rebalancing every 4 hours based on optimal APY rates</li>
            <li>Points system rewarding early users before token launch</li>
            <li>Cross-protocol liquidity management and optimization</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            2.2 Supported Assets and Networks
          </Heading>
          <ul className={styles.list}>
            <li>
              <strong>Supported Assets:</strong> USDC, USDT, DAI
            </li>
            <li>
              <strong>Supported Networks:</strong> Ethereum Mainnet, Arbitrum, BSC, Base
            </li>
            <li>
              <strong>Integrated Protocols:</strong> AAVE V3, Compound V3, Morpho, Curve, SparkLend,
              Venus, Fraxlend, and others
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            3. USER RESPONSIBILITIES
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            3.1 Wallet Connection and Security
          </Heading>
          <ul className={styles.list}>
            <li>You are solely responsible for the security of your private keys and wallet</li>
            <li>You must use a compatible Web3 wallet (MetaMask, WalletConnect, etc.)</li>
            <li>You acknowledge that transactions on blockchain are irreversible</li>
            <li>You are responsible for paying all network transaction fees (gas costs)</li>
            <li>You must verify all transaction details before confirming</li>
            <li>You should use hardware wallets for significant amounts</li>
            <li>You must never share your private keys or seed phrases</li>
            <li>You should enable multi-factor authentication where available</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            3.2 Risk Acknowledgment
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            You understand and accept the following risks:
          </Texting>
          <ul className={styles.list}>
            <li>
              <strong>Smart Contract Risk:</strong> Potential bugs or vulnerabilities in smart
              contracts, including zero-day exploits and complex attack vectors
            </li>
            <li>
              <strong>Protocol Risk:</strong> Risk of loss due to underlying DeFi protocol failures,
              governance attacks, or economic exploits
            </li>
            <li>
              <strong>Liquidity Risk:</strong> Potential temporary inability to withdraw funds due
              to market conditions or protocol constraints
            </li>
            <li>
              <strong>Market Risk:</strong> Fluctuations in yield rates and asset values, including
              impermanent loss in automated market makers
            </li>
            <li>
              <strong>Regulatory Risk:</strong> Potential regulatory changes affecting DeFi
              protocols, including classification as securities or commodities
            </li>
            <li>
              <strong>MEV Risk:</strong> Risk of front-running, sandwich attacks, and other maximal
              extractable value strategies
            </li>
            <li>
              <strong>Oracle Risk:</strong> Potential failures in price feeds and external data
              sources
            </li>
            <li>
              <strong>Cross-Chain Risk:</strong> Risks associated with bridging assets between
              different blockchain networks
            </li>
            <li>
              <strong>Gas Price Volatility:</strong> Sudden increases in network fees that may make
              transactions uneconomical
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            4. FEES AND REVENUE MODEL
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            4.1 Protocol Fees
          </Heading>
          <ul className={styles.list}>
            <li>
              <strong>Performance Fee:</strong> 25% of earned yield collected upon withdrawal
            </li>
            <li>
              <strong>No Management Fees:</strong> No ongoing fees for holding positions
            </li>
            <li>
              <strong>Gas Fees:</strong> Users pay network transaction fees for deposits and
              withdrawals
            </li>
            <li>
              <strong>Rebalancing Costs:</strong> Automatic rebalancing gas costs are socialized
              across users
            </li>
            <li>
              <strong>Flash Loan Fees:</strong> Fees associated with flash loan arbitrage
              opportunities
            </li>
            <li>
              <strong>Cross-Chain Bridge Fees:</strong> Fees for bridging assets between supported
              networks
            </li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            4.2 Fee Transparency
          </Heading>
          <ul className={styles.list}>
            <li>All fees are clearly displayed before transaction execution</li>
            <li>Fee calculations are verifiable on-chain</li>
            <li>Users receive detailed breakdowns of all charges</li>
            <li>Fee structures may be updated with 30-day notice</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            5. POINTS SYSTEM
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            5.1 Points Program Overview
          </Heading>
          <ul className={styles.list}>
            <li>Early user reward system before token launch</li>
            <li>
              <strong>Total Pool:</strong> 100 million points over 12 months
            </li>
            <li>
              <strong>Base Rate:</strong> 1 point per $1 TVL per day
            </li>
            <li>
              <strong>Network:</strong> Points tracking exclusively on Ethereum mainnet
            </li>
            <li>
              <strong>Anti-Sybil Measures:</strong> Advanced detection systems to prevent gaming
            </li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            5.2 Points Calculation
          </Heading>
          <ul className={styles.list}>
            <li>
              <strong>Weighted Average:</strong> 60-day rolling weighted average balance
            </li>
            <li>
              <strong>Loyalty Multipliers:</strong>
            </li>
            <ul className={styles.nestedList}>
              <li>30 days: 1.1x (10% bonus)</li>
              <li>90 days: 1.2x (20% bonus)</li>
              <li>180 days: 1.3x (30% bonus)</li>
            </ul>
            <li>
              <strong>Referral System:</strong> 5% of daily points from referred users
            </li>
            <li>
              <strong>Activity Bonuses:</strong> Additional points for regular interactions
            </li>
            <li>
              <strong>Governance Participation:</strong> Points for voting on protocol proposals
            </li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            5.3 Points Terms and Conditions
          </Heading>
          <ul className={styles.list}>
            <li>Points have no monetary value and are not transferable</li>
            <li>Points may be converted to tokens at protocol discretion</li>
            <li>Anti-fraud measures: minimum transaction intervals, validation requirements</li>
            <li>Points may be forfeited for violations of these Terms</li>
            <li>Protocol reserves the right to modify points system with notice</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            6. DISCLAIMERS AND WARRANTIES
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            6.1 &ldquo;AS IS&rdquo; Service
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            THE PROTOCOL IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
            WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
          </Texting>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            6.2 No Financial Advice
          </Heading>
          <ul className={styles.list}>
            <li>The Protocol does not provide investment, financial, or legal advice</li>
            <li>All investment decisions are made solely by users at their own risk</li>
            <li>Past performance does not guarantee future results</li>
            <li>Users should consult qualified professionals before making investment decisions</li>
            <li>Yield rates are variable and subject to market conditions</li>
            <li>DeFi protocols carry inherent risks not present in traditional finance</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            6.3 Regulatory Compliance
          </Heading>
          <ul className={styles.list}>
            <li>Users are responsible for compliance with local laws and regulations</li>
            <li>The Protocol may restrict access from certain jurisdictions</li>
            <li>Tax implications vary by jurisdiction and user circumstances</li>
            <li>Users should consult tax professionals regarding their obligations</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            7. LIMITATION OF LIABILITY
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            7.1 Liability Cap
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF THE PROTOCOL SHALL NOT
            EXCEED THE AMOUNT OF FEES PAID BY USER IN THE 12 MONTHS PRECEDING THE CLAIM.
          </Texting>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            7.2 Excluded Damages
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            THE PROTOCOL SHALL NOT BE LIABLE FOR:
          </Texting>
          <ul className={styles.list}>
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Smart contract failures or blockchain network issues</li>
            <li>Third-party protocol failures or exploits</li>
            <li>Market volatility or regulatory changes</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            8. CONTACT INFORMATION
          </Heading>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            For questions about these Terms or the Protocol:
          </Texting>
          <ul className={styles.list}>
            <li>Website: https://thesauros.io</li>
            <li>Documentation: Available on the website</li>
            <li>Community: Discord and other social channels</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            <strong>
              By connecting your wallet and using the Thesauros Protocol, you acknowledge that you
              have read, understood, and agree to be bound by these Terms of Use.
            </strong>
          </Texting>
          <Texting level={3} weight="regular" className={styles.paragraph}>
            <em>
              For the most current version of these Terms, please visit https://thesauros.io/terms
            </em>
          </Texting>
        </div>
      </div>
    </FlexBlock>
  );
}
