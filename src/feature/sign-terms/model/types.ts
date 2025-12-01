export interface SignatureData {
  address: string;
  message: string;
  signature: string;
  timestamp: number;
}

export interface SignContextValue {
  isSigned: boolean;
  isLoading: boolean;
  signatureData: SignatureData | null;
  signTerms: (message?: string) => Promise<void>;
  verifySignature: (data: SignatureData) => Promise<boolean>;
}

export const TERMS_MESSAGE =
  'By this message, I agree to and sign these terms and conditions: https://thesauros.io/terms\n\nThis signature is not a transaction or an authorization for Thesauros to conduct transactions on your behalf.';
