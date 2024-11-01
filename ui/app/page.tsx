'use client';
import { Field } from 'o1js';
import { useEffect, useState } from 'react';
import GradientBG from '../components/GradientBG';
import styles from '../styles/Home.module.css';

import Header from '../components/Header';
import Link from 'next/link';
import ZkappWorkerClient from './zkappWorkerClient';

let transactionFee = 0.1;
const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP';



export default function Home() {
    
    return (
        <div className={styles.container}>
          <Header />
    
          <main className={styles.main}>
            <section className={styles.hero}>
              <h2>Welcome to AuctionHub</h2>
              <p>Discover unique items and place your bids in our exciting online auctions!</p>
            </section>
    
            <div className={styles.grid}>
              <Link href="/auctions" className={styles.card}>
                <h3>View Auctions &rarr;</h3>
                <p>Browse our current auctions and place your bids.</p>
              </Link>
              <Link href="/create" className={styles.card}>
                <h3>Create Auction &rarr;</h3>
                <p>List your item for auction and start receiving bids.</p>
              </Link>
            </div>
          </main>
    
          <footer className={styles.footer}>
            <p>&copy; 2024 Silent Auction. All rights reserved.</p>
          </footer>
        </div>
      );
}