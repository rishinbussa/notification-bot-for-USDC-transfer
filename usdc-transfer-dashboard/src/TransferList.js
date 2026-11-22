import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatAmount } from './formatAmount';
import { findNewTransfers, getLatestTimestamp } from './newTransfers';


const GET_TRANSFERS = gql`
  query GetTransfers {
    transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      from
      to
      value
      blockTimestamp
    }
  }
`;

const TransferList = () => {
  const { loading, error, data, refetch } = useQuery(GET_TRANSFERS);
  // Newest blockTimestamp seen so far; null until the first load sets it.
  const [latestTimestamp, setLatestTimestamp] = useState(null);

  useEffect(() => {
    if (data) {
      const newItems = findNewTransfers(data.transfers, latestTimestamp);

      newItems.forEach(transfer => {
        toast.info(`New transfer: ${formatAmount(transfer.value)} USDC from ${transfer.from}`);
      });

      setLatestTimestamp(getLatestTimestamp(data.transfers, latestTimestamp));
    }
  }, [data, latestTimestamp]);


  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval); 
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {}
      <ToastContainer 
        position="top-right"   
        autoClose={5000}        
        hideProgressBar={false} 
        newestOnTop={true}      
        closeOnClick={true}     
        rtl={false}             
      />
      
      <h2>Latest 10 USDC Transfers</h2>
      <ul>
        {data.transfers.map((transfer, index) => (
          <li key={index}>
            <strong>From:</strong> {transfer.from} <br />
            <strong>To:</strong> {transfer.to} <br />
            <strong>Amount:</strong> {formatAmount(transfer.value)} USDC <br />
            <strong>Timestamp:</strong> {new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferList;