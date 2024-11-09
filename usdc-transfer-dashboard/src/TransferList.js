import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [transfers, setTransfers] = useState([]);
  const [latestTimestamp, setLatestTimestamp] = useState(0);

  useEffect(() => {
    if (data) {
      const newTransfers = data.transfers;

      
      const newItems = newTransfers.filter(
        transfer => parseInt(transfer.blockTimestamp) > latestTimestamp
      );

      
      if (newItems.length > 0) {
        newItems.forEach(transfer => {
          toast.info(`New transfer: ${parseInt(transfer.value) / 10**6} USDC from ${transfer.from}`);
        });

        
        setLatestTimestamp(Math.max(...newItems.map(item => parseInt(item.blockTimestamp))));
        setTransfers(newTransfers);
      }
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
        {transfers.map((transfer, index) => (
          <li key={index}>
            <strong>From:</strong> {transfer.from} <br />
            <strong>To:</strong> {transfer.to} <br />
            <strong>Amount:</strong> {parseInt(transfer.value) / 10**6} USDC <br />
            <strong>Timestamp:</strong> {new Date(parseInt(transfer.blockTimestamp) * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferList;