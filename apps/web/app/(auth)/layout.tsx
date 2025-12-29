"use client";

import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { ReactNode } from 'react';

const AuthLayout = ({ children } :{ children: ReactNode }) => {
  return (
    <div>
        <UnifiedWalletProvider
        wallets={[]}
        config={{
        autoConnect: false,
        env: process.env.MODE === 'mainnet' ? 'mainnet-beta' : 'devnet',
        metadata: {
          name: 'UnifiedWallet',
          description: 'UnifiedWallet',
          url: 'https://jup.ag',
          iconUrls: ['https://jup.ag/favicon.ico'],
        },
        walletlistExplanation: {
          href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
        },
      }}
        >
             { children }
        </UnifiedWalletProvider>
    </div>
  )
}

export default AuthLayout;