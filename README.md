# USDC Transfer Dashboard

A React dashboard that lists the 10 most recent transfers of a mock USDC token on the Ethereum Sepolia testnet and shows an in-page notification when a new transfer appears. The token is a minimal ERC-20 contract built on OpenZeppelin and deployed from Remix with MetaMask. A subgraph on The Graph indexes the token's `Transfer` events, and the dashboard polls the subgraph's GraphQL endpoint every 5 seconds through Apollo Client. The dashboard never talks to the chain or a wallet directly; it only reads from the subgraph.

## How it works

```
MockUSDC (Sepolia) -> subgraph (Subgraph Studio) -> React dashboard -> toast notification
emits Transfer        stores Transfer entities      polls every 5 s     one per new transfer
```

1. **Contract.** `smartcontact/MockUSDC.sol` extends OpenZeppelin's `ERC20` with the name "Mock USD Coin" and symbol `USDC`. The constructor mints `initialSupply * 10**18` base units to the deployer, because the token keeps OpenZeppelin's default of 18 decimals. Every transfer, including the initial mint, emits the standard `Transfer(from, to, value)` event.
2. **Subgraph.** The subgraph was generated with `graph init` from the deployed contract's address and ABI. The generated code stores each `Transfer` event as a `Transfer` entity with `from`, `to`, `value`, `blockNumber`, `blockTimestamp` and `transactionHash`. It is deployed to Subgraph Studio. The subgraph project is not in this repository; the dashboard only references its query URL.
3. **Dashboard.** `src/ApolloClient.js` creates an Apollo Client for the Studio query URL. `src/TransferList.js` runs the query below and calls `refetch()` every 5 seconds.

   ```graphql
   query GetTransfers {
     transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
       from
       to
       value
       blockTimestamp
     }
   }
   ```

   The subgraph returns each `value` as a string of base units. `src/formatAmount.js` turns it into a token amount with BigInt and the token's 18 decimals, so no digits are lost to rounding: `1234500000000000000000` is shown as `1,234.5`.

4. **Notification.** The component remembers the newest `blockTimestamp` it has seen. The first successful load only sets this baseline, so the transfers that were already there do not trigger toasts. When a later refetch returns transfers newer than the baseline, it shows one react-toastify toast per new transfer and moves the baseline forward. The comparison is done by two pure functions in `src/newTransfers.js`. The list always shows the latest query result with sender, recipient, amount and local time.

Results from a test run, recorded before amounts were shown with the token's 18 decimals:

![Test run screenshot 1](https://github.com/user-attachments/assets/5e71c924-c1dd-44ed-8d15-ec50b6bddc66)

![Test run screenshot 2](https://github.com/user-attachments/assets/df486dac-2e4a-4639-8980-b1d8105ad34f)

![Test run screenshot 3](https://github.com/user-attachments/assets/e6bd679f-acbd-46ce-82ef-262cc1c2ffa6)

The deployed subgraph in Subgraph Studio:

<img width="1438" alt="Subgraph in Subgraph Studio" src="https://github.com/user-attachments/assets/0f87654a-6e2d-48fc-beee-2fcacde891ab">

## Tech stack

Solidity 0.8 with OpenZeppelin Contracts 5, Remix and MetaMask on Sepolia, The Graph (Graph CLI, Subgraph Studio), React 18 (Create React App), Apollo Client 3 and GraphQL, react-toastify.

## Run it locally

You need Node.js and npm, MetaMask with some Sepolia ETH, and a Subgraph Studio account.

### 1. Deploy the token

1. Open [Remix](https://remix.ethereum.org) and create `MockUSDC.sol` with the contents of `smartcontact/MockUSDC.sol`. Remix downloads `@openzeppelin/contracts` from npm to resolve the import.
2. Compile with Solidity 0.8.20 or newer, which OpenZeppelin 5 requires (the original build used 0.8.26).
3. In Deploy & Run, choose **Injected Provider - MetaMask**, switch MetaMask to Sepolia, enter `initialSupply` in whole tokens and deploy.
4. Note the contract address and the block it was deployed in.

### 2. Create and deploy the subgraph

Create a subgraph in [Subgraph Studio](https://thegraph.com/studio/), then run:

```bash
npm install -g @graphprotocol/graph-cli
graph init <subgraph-slug>    # pick Ethereum Sepolia, then enter the contract address and start block
graph auth <deploy-key>       # deploy key from the subgraph's Studio page
cd <subgraph-slug>
graph codegen && graph build
graph deploy <subgraph-slug>
```

If the contract is not verified on Etherscan, `graph init` asks for an ABI file; save the ABI from Remix's Solidity Compiler tab as a JSON file and give its path. Keep the option to index contract events as entities, because the dashboard queries the generated `Transfer` entity. You can test the query above in the Studio playground once the subgraph has synced.

### 3. Run the dashboard

Set `uri` in `usdc-transfer-dashboard/src/ApolloClient.js` to your subgraph's query URL from Studio (it has the form `https://api.studio.thegraph.com/query/<id>/<subgraph-slug>/<version>`), then:

```bash
cd usdc-transfer-dashboard
npm install
npm start
```

The app opens at http://localhost:3000. Call `transfer` on the token from Remix and a toast appears on the next poll after the subgraph indexes that block. `npm run build` writes a production build to `build/`.

## Project structure

```
smartcontact/
  MockUSDC.sol                  ERC-20 token contract
usdc-transfer-dashboard/        Create React App project
  src/ApolloClient.js           Apollo Client pointed at the subgraph query URL
  src/TransferList.js           GraphQL query, 5-second polling, toasts, transfer list
  src/formatAmount.js           base units to token amount (18 decimals, BigInt)
  src/newTransfers.js           finds the transfers that arrived since the last poll
  src/App.js                    page layout and ApolloProvider
  OneSignalSDK-v16-ServiceWorker/
    OneSignalSDKWorker.js       OneSignal web push service worker (not wired up)
  public/                       static files served by Create React App
```

## Limitations and next steps

- Notifications are in-page toasts, so they only appear while the dashboard is open. The OneSignal service worker file is included, but the OneSignal SDK is never initialized and the worker sits outside `public/`, so browser push notifications are not active. The `firebase` dependency is installed but not used.
- The token's 18 decimals are a constant, `TOKEN_DECIMALS` in `src/formatAmount.js`, not read from the contract. If the contract overrides `decimals()`, that constant has to change with it.
- The query fetches only the 10 newest transfers, so if more than 10 arrive between two polls, the older ones get no toast.
- The subgraph query URL is hard-coded in `src/ApolloClient.js`, and the subgraph's schema, manifest and mappings are not in the repository.
- There are no real tests; `src/App.test.js` is the Create React App placeholder test and fails against this UI.
