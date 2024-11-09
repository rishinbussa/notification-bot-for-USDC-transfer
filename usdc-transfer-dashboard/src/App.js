import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import TransferList from './TransferList';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>USDC Transfer Dashboard</h1>
        </header>
        <main className="App-content">
          <TransferList />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;