import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import styles from './privacy.module.scss';

export default function PrivacyPage() {
  return (
    <FlexBlock direction="column" className={styles.container}>
      <div className={styles.content}>
        <Heading level={1} weight="semibold" className={styles.title}>
          Privacy Policy
        </Heading>
        <Body level={2} weight="medium" className={styles.subtitle}>
          Thesauros Protocol
        </Body>
        <Body level={2} weight="regular" className={styles.date}>
          Last Updated: August 26, 2025
        </Body>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            1. INTRODUCTION
          </Heading>
          <Body level={2} weight="regular" className={styles.paragraph}>
            This Privacy Policy (&ldquo;Policy&rdquo;) explains how Thesauros Protocol
            (&ldquo;Protocol,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            collects, uses, processes, and protects information when you use our decentralized yield
            optimization platform available at https://thesauros.io and related services.
          </Body>
          <Body level={2} weight="regular" className={styles.paragraph}>
            Thesauros Protocol is committed to protecting your privacy while providing automated
            yield farming services across multiple DeFi protocols. This Policy describes our data
            practices in compliance with applicable privacy laws and regulations.
          </Body>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Web3 Privacy Principles:</strong> We believe in the fundamental right to privacy
            and data sovereignty. Our approach aligns with Web3 principles of user control,
            transparency, and minimal data collection while maintaining protocol security and
            functionality.
          </Body>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            2. INFORMATION WE COLLECT
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            2.1 Blockchain and Wallet Information
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Wallet Addresses:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Public wallet addresses when you connect to the Protocol</li>
            <li>Transaction hashes and blockchain interaction data</li>
            <li>Smart contract interaction records</li>
            <li>Token balances and transfer history</li>
          </ul>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Transaction Data:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Deposit and withdrawal amounts and timestamps</li>
            <li>Vault positions and share token holdings</li>
            <li>Rebalancing transaction records</li>
            <li>Gas fees and transaction costs</li>
            <li>Yield earnings and performance data</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            2.2 Technical Information
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Website Usage Data:</strong>
          </Body>
          <ul className={styles.list}>
            <li>IP addresses and geolocation data</li>
            <li>Browser type, version, and settings</li>
            <li>Device information and screen resolution</li>
            <li>Operating system and platform details</li>
            <li>Website navigation patterns and session data</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            3. HOW WE USE YOUR INFORMATION
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            3.1 Core Protocol Operations
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Yield Optimization:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Calculating optimal fund allocation across DeFi protocols</li>
            <li>Executing automated rebalancing transactions</li>
            <li>Monitoring and improving algorithm performance</li>
            <li>Providing real-time APY and performance data</li>
          </ul>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>User Account Management:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Tracking vault positions and share ownership</li>
            <li>Calculating and distributing earned yields</li>
            <li>Managing withdrawal requests and fee calculations</li>
            <li>Maintaining transaction history and records</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            4. INFORMATION SHARING AND DISCLOSURE
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            4.1 Public Blockchain Data
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Inherently Public Information:</strong>
          </Body>
          <ul className={styles.list}>
            <li>All blockchain transactions are publicly visible</li>
            <li>Wallet addresses and transaction amounts are publicly accessible</li>
            <li>Smart contract interactions are recorded on public blockchains</li>
            <li>Users acknowledge that blockchain data cannot be made private</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            4.2 Service Providers and Partners
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Technical Partners:</strong>
          </Body>
          <ul className={styles.list}>
            <li>RPC providers for blockchain connectivity</li>
            <li>Analytics services for performance monitoring</li>
            <li>Cloud infrastructure providers for hosting</li>
            <li>Security services for protocol monitoring</li>
            <li>Oracle providers for price feeds and data</li>
            <li>Cross-chain bridge providers for asset transfers</li>
          </ul>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Data Processing Agreements:</strong>
          </Body>
          <ul className={styles.list}>
            <li>All service providers are bound by appropriate data protection agreements</li>
            <li>Access is limited to information necessary for service provision</li>
            <li>Third parties cannot use data for independent purposes</li>
            <li>Regular audits ensure compliance with privacy requirements</li>
            <li>Zero-knowledge proofs used where possible to minimize data sharing</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            5. DATA SECURITY
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            5.1 Security Measures
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Technical Safeguards:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Encryption of data in transit and at rest</li>
            <li>Multi-factor authentication for administrative access</li>
            <li>Regular security audits and penetration testing</li>
            <li>Secure coding practices and vulnerability management</li>
            <li>Zero-knowledge proof implementations for privacy</li>
            <li>Decentralized identity solutions where applicable</li>
            <li>On-chain verification of data integrity</li>
            <li>Regular smart contract security assessments</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            5.2 User Security Responsibilities
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Wallet Security:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Users responsible for private key and seed phrase security</li>
            <li>Protocol cannot recover lost or compromised wallets</li>
            <li>Users should use hardware wallets for large amounts</li>
            <li>Regular security practices recommended for all users</li>
            <li>Users should verify all transaction details before signing</li>
            <li>Users should enable multi-factor authentication where available</li>
            <li>Users should regularly review connected applications and permissions</li>
            <li>Users should use secure networks and avoid public Wi-Fi for transactions</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            6. YOUR PRIVACY RIGHTS
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            6.1 Access and Portability
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Data Access:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Request copies of your transaction and points data</li>
            <li>Access to account settings and preferences</li>
            <li>Information about data processing activities</li>
            <li>Details about third-party sharing practices</li>
            <li>Export data in machine-readable formats (JSON, CSV)</li>
            <li>Request deletion of non-blockchain data</li>
            <li>Opt out of non-essential data processing</li>
            <li>Access to audit logs of data access</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            7. CONTACT INFORMATION
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            7.1 Privacy Inquiries
          </Heading>

          <Body level={2} weight="regular" className={styles.paragraph}>
            For privacy-related questions, requests, or concerns:
          </Body>

          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>General Privacy Questions:</strong>
          </Body>
          <ul className={styles.list}>
            <li>Website: https://thesauros.io/privacy</li>
            <li>Documentation: Available in help center</li>
            <li>Community: Discord and social channels</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            8. WEB3 PRIVACY CONSIDERATIONS
          </Heading>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            8.1 Blockchain Transparency
          </Heading>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Public Ledger Nature:</strong>
          </Body>
          <ul className={styles.list}>
            <li>All blockchain transactions are permanently recorded and publicly accessible</li>
            <li>Wallet addresses and transaction amounts are visible to anyone</li>
            <li>Smart contract interactions are transparent and verifiable</li>
            <li>Users should assume all on-chain activity is public</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            8.2 Privacy Enhancement Technologies
          </Heading>
          <ul className={styles.list}>
            <li>Zero-knowledge proofs for transaction privacy</li>
            <li>Decentralized identity solutions</li>
            <li>Privacy-preserving analytics</li>
            <li>Minimal data collection principles</li>
          </ul>

          <Heading level={3} weight="semibold" className={styles.subsectionTitle}>
            8.3 User Control and Sovereignty
          </Heading>
          <ul className={styles.list}>
            <li>Users maintain full control over their private keys</li>
            <li>No centralized authority can freeze or seize funds</li>
            <li>Users can disconnect from the protocol at any time</li>
            <li>Data portability and export capabilities</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Heading level={2} weight="semibold" className={styles.sectionTitle}>
            9. ACKNOWLEDGMENT AND CONSENT
          </Heading>
          <Body level={2} weight="regular" className={styles.paragraph}>
            By connecting your wallet and using the Thesauros Protocol, you acknowledge that:
          </Body>
          <ul className={styles.list}>
            <li>You have read and understood this Privacy Policy</li>
            <li>You consent to the collection and processing of information as described</li>
            <li>You understand the public nature of blockchain transactions</li>
            <li>You agree to the terms regarding international data transfers</li>
            <li>You acknowledge your rights and responsibilities regarding data protection</li>
            <li>You understand that blockchain data is immutable and publicly accessible</li>
            <li>You consent to the use of zero-knowledge proofs for privacy enhancement</li>
            <li>You acknowledge the importance of wallet security and private key management</li>
            <li>You understand that DeFi protocols carry unique privacy considerations</li>
          </ul>
        </div>

        <div className={styles.section}>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>
              This Privacy Policy is effective as of the date listed above and applies to all users
              of the Thesauros Protocol.
            </strong>
          </Body>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <em>
              For the most current version of this Privacy Policy, please visit
              https://thesauros.io/privacy
            </em>
          </Body>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Last Updated: August 26, 2025</strong>
          </Body>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Version: 1.0</strong>
          </Body>
          <Body level={2} weight="regular" className={styles.paragraph}>
            <strong>Next Review Date: November 26, 2025</strong>
          </Body>
        </div>
      </div>
    </FlexBlock>
  );
}
