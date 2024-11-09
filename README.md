Steps for Task 2:
1.	Open Remix-Ethereum IDE
   
	   •	Under the File Explorer, add the folder which is uploaded in the smartcontract folder of this repository                 (folder name: @openzeppelin).
    
     
2.	Create a New Contract
   
	   •	Create a new contract named MockUSDC under the contracts folder of the Remix file explorer
  	           (MockUSD contract code is provided in the smartcontract folder of this repo).
  	
5.	Compile and Deploy the Contract in Remix
	   •	Note: Choose the environment as Injected Provider-MetaMask & provide the initial supply while deploying for                  the first time.
	   •	Make sure that you are on the Sepolia test network before confirming the transaction on MetaMask.

  	
6.	Note the Contract Address
	   •	Once the contract is deployed, note the contract address.


Next Step: Create and Deploy the Subgraph

5.	Open The Graph Studio
	•	Go to The Graph Studio and create a new subgraph.


6.	Deploy the Subgraph Locally through the Terminal
	•	Follow the documentation provided in the subgraph dashboard.

 Commands to Run on the Terminal:

i) Install Graph CLI using NPM
npm install -g @graphprotocol/graph-cli

ii) Initialize Subgraph
graph init --subgraph name--
  •	After running the above command, we are required to choose the network and other options to set up the graph.
  •	We are also required to provide the contract address obtained from the contract deployment in step 4.

iii) Authenticate in CLI
graph auth --deployment key--

iv) Enter Subgraph Directory
cd --subgraph name--

v) Deploy Subgraph
graph deploy --subgraph name--


7.	After Successful Deployment of the Subgraph
	•	Open the subgraph on The Graph Studio.
	•	Under My Dashboard, create a new query as per the requirement:
            query MyQuery {
              transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
                from
                to
                value
                blockTimestamp
              }
            }
  	•	Note: The above query is used in my task completion.


8.	Run and Check the Query
	•	Check if the query fetches and displays the transaction details like from, to, etc.


Frontend Integration

9.	Integrate with Frontend Project
	•	Since this is a React project, make sure to have the node modules in the project directory downloaded from this             repository:
    npm install @apollo/client graphql
    npm install react-toastify
	•	Apollo is used to fetch the data from subgraph to our frontend page, and Toastify is used for the notifications.


10.	Display Latest Transactions on the Frontend
	•	After these steps, we will be able to see the latest 10 transactions on our frontend page.
	•	All the new transactions executed on Remix are always fetched every 5 seconds and later displayed and notified on         the page.












**RESULTS:**

   ![image](https://github.com/user-attachments/assets/5e71c924-c1dd-44ed-8d15-ec50b6bddc66)




   ![image](https://github.com/user-attachments/assets/df486dac-2e4a-4639-8980-b1d8105ad34f)




![image](https://github.com/user-attachments/assets/e6bd679f-acbd-46ce-82ef-262cc1c2ffa6)

