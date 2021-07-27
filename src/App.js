import { useStoreApi } from "./storeApi";
import Web3 from "./useWeb3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, TextField } from "@material-ui/core";
import "./App.css";
import { useState } from "react";

const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
});

function App() {
  const [active, setActive] = useState(false);
  const [accountss, setAccountss] = useState();
  const { balance, address, message, setAddress, setBalance } = useStoreApi();
  const web3 = Web3();

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then((accounts) => {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  // connection refused in wallet

  const getWalletAccount = async () => {
    await provider.enable().catch();
    setAccountss(provider.wc.accounts[0]);
    console.log(provider.wc.accounts[0]);
  };

  const logoutAccount = async () => {
    window.location.reload(false);
    await provider.close();
  };

  const updateBalance = async (fromAddress) => {
    await web3.eth.getBalance(fromAddress).then((value) => {
      setBalance(web3.utils.fromWei(value, "ether"));
    });
  };

  const sendTransaction = async (e) => {
    e.preventDefault();
    const amount = e.target[0].value;
    const recipient = e.target[1].value;
    await web3.eth.sendTransaction({
      from: address,
      to: recipient,
      value: web3.utils.toWei(amount, "ether"),
    });
    updateBalance(address);
  };

  return (
    <div className="App">
      <div className="app__body">
        <Button
          onClick={(e) => setActive(true)}
          variant="outlined"
          color="primary"
          className="connect__button"
        >
          Connect
        </Button>
        <br />
        <br />

        <Button
          onClick={() => logoutAccount()}
          variant="outlined"
          color="primary"
          className="connect__button"
        >
          Logout
        </Button>
        <br />
        <br />
        <br />

        {active && (
          <>
            <Button
              onClick={() => getUserAccount()}
              variant="outlined"
              color="primary"
              className="connect__button"
            >
              Connect With MetaMask
            </Button>
            <br />
            <br />
            <Button
              onClick={() => getWalletAccount()}
              variant="outlined"
              color="primary"
              className="connect__button"
            >
              Connect With wallet connect
            </Button>
            <br />
            <br />
            {address ? (
              <>
                <p>Your account : {address}</p>
                <p> Balance: {balance} </p>
              </>
            ) : null}
            {accountss ? (
              <>
                <p>Your account : {accountss} </p>
              </>
            ) : null}
            <br />
            <br />
            <form
              onSubmit={(e) => sendTransaction(e)}
              className="connect__form"
            >
              <TextField
                required
                label="Amount"
                inputProps={{ step: "any" }}
                type="number"
                variant="filled"
              />
              <TextField required label="Recipient Address" variant="filled" />
              <Button
                style={{ margin: "10px" }}
                type="submit"
                variant="outlined"
                color="default"
              >
                Send Crypto
              </Button>
            </form>{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
