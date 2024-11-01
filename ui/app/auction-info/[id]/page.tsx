import AuctionClient from './Client';
import { headers } from 'next/headers';

interface PageProps {
  params: {
    id: string;
  };
}

async function getAuctionData(id: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const response = await fetch(`${backendUrl}/items/${id}`, {
      cache: 'no-store' // or 'force-cache' if you want to cache
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch auction details');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching auction details:', error);
    throw error;
  }
}

export default async function AuctionPage({ params }: PageProps) {
  const initialData = await getAuctionData(params.id);
  
  return <AuctionClient initialData={initialData} id={params.id} />;
}

export async function generateStaticParams() {
  const auctions = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];

  return auctions.map((auction) => ({
    id: auction.id,
  }));
}