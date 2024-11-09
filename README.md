steps for the task 2:

1. open Remix-ethereum IDE --> under the file explorer --> 
    add the folder which is uploaded in the smartcontact folder of this repository
                   (folder name: @openzeppelin)


2. create a new contract named MockUSDC under the contracts folder of remix file explorer
      (MockUSDC contract code provided in the smartcontact folder of this repo)


3. compile and deploy the contract in remix
   note: choose the environment as Injected Provider-MetaMask &  provide intial supply while depolying for the first time
   make sure that you are on the sepolia test network before confirming the transaction on metamask


4. once the contract is deployed, note the contract address


5. next step is to create and deploy the subgraph


6. open https://thegraph.com/studio/ and create a new subgraph


7. deploy the newly created subgraph locally through the terminal, by following the documentation provided in the subgraph dashboard


8. these are the commands to be runned on the terminal:


    i)**Install Graph CLI using NPM**

   npm install -g @graphprotocol/graph-cli

    ii)**Initialize Subgraph**

    graph init --subgraph name--

    after running the above command we are required to choose the network and other options to setup the graph
   here, we are also required to provide the contract address obtained from the contract deployement initially in step 4.

    iii)**Authenticate in CLI**

     graph auth --deployment key--

    iv)**Enter Subgraph**

    cd --subgraph name--

    v)Deploy Subgraph

    graph deploy --subgraph name--


9. after successful deployment of the subgraph, open subgraph on thegraph studio.


10. under mydashboard, create a new query as per the requirement 

 query MyQuery {
  transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    from
    to
    value
    blockTimestamp
  }
}

for example, the above query is used in my task completion 


11. run and check if the  query fetches and displays the transaction details like to,from etc..


12. once we're done with these steps we can integrate this with our frontend project.
    (all the frontend files are provided in the repository)


13. since this is a react project, make sure to have the node modules in the project directory downloaded from this repository


14. npm install @apollo/client graphql,
    npm install react-toastify
    these are the other commands to be runned in the project directory to get apollo and toastify to perform our task


15. apollo is used to fetch the data to our frontend page and toastify is used for the **notifications**.


16. after these steps we can see the latest 10 transactions on our frontend page, all the new transactions executed on remix are always
      fetched for every 5 seconds and later displayed and notified on our page.
















**RESULTS:**

   ![image](https://github.com/user-attachments/assets/5e71c924-c1dd-44ed-8d15-ec50b6bddc66)




   ![image](https://github.com/user-attachments/assets/df486dac-2e4a-4639-8980-b1d8105ad34f)




![image](https://github.com/user-attachments/assets/e6bd679f-acbd-46ce-82ef-262cc1c2ffa6)

