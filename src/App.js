import { useStoreApi } from "./storeApi";
import Web3 from "./useWeb3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, TextField } from "@material-ui/core";
import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [active, setActive] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [accountss, setAccountss] = useState();
  const { balance, address, message, setAddress, setBalance } = useStoreApi();
  const [metamask, setMetamask] = useState(false);
  const [walletConnect, setWalletConnect] = useState(false);
  const web3 = Web3();
  const [transaction, setTransaction] = useState([]);
  const api__key = "XFNUDYK6ZE39ANZ6B4CTJ6SUGTDD42A1V6";
  const test__address = "0x5411c6309AF85919E4816913476a58e90421AECD";

  const provider = new WalletConnectProvider({
    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
  });

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then((accounts) => {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
          setMetamask(!walletConnect);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  const getTransaction = async () => {
    try {
      const result = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${api__key}`
      );
      setTransaction(result.data.result);
      console.log("metamask", result);
      setShowTransaction(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getTransactionWallet = async () => {
    try {
      const result = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${accountss}&startblock=0&endblock=99999999&sort=asc&apikey=${api__key}`
      );
      setTransaction(result.data.result);
      console.log("wallet is", result);
      setShowTransaction(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  // connection refused in wallet

  const getWalletAccount = async () => {
    try {
      const provider = new WalletConnectProvider({
        infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
      });

      await provider.enable().catch();
      setAccountss(provider.wc.accounts[0]);
      setWalletConnect(!metamask);
    } catch (error) {
      console.error(error);
      window.location.reload(false);
    }
  };

  const logoutAccount = async () => {
    window.location.reload(false);
    await provider.close();
    await window.ethereum.close();
  };

  const logoutAccountWallet = async () => {
    await provider.close();
    window.location.reload(false);
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
    <div>
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
          {metamask && (
            <>
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
            </>
          )}
          {walletConnect && (
            <>
              <Button
                onClick={() => logoutAccountWallet()}
                variant="outlined"
                color="primary"
                className="connect__button"
              >
                Logout
              </Button>
              <br />
              <br />
              <br />
            </>
          )}

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
              {metamask && address ? (
                <>
                  <Button
                    onClick={() => getTransaction()}
                    variant="outlined"
                    color="primary"
                    className="connect__button"
                  >
                    Get transaction Metamask
                  </Button>
                  <br />
                  <br />
                  <p>
                    Your account : <span className="meta__data">{address}</span>
                  </p>
                  <p>
                    Balance :
                    <span className="meta__data">
                      &nbsp;&nbsp;{balance}&nbsp;&nbsp;
                    </span>
                  </p>
                </>
              ) : null}
              {walletConnect && accountss ? (
                <>
                  <Button
                    onClick={() => logoutAccountWallet()}
                    variant="outlined"
                    color="primary"
                    className="connect__button"
                  >
                    Logout
                  </Button>
                  <br />
                  <br />
                  <br />
                  <Button
                    onClick={() => getTransactionWallet()}
                    variant="outlined"
                    color="primary"
                    className="connect__button"
                  >
                    Get transaction WalletConnect
                  </Button>
                  <br />
                  <br />
                  <p>
                    Your account :
                    <span className="meta__data">{accountss}</span>
                  </p>
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
                <TextField
                  required
                  label="Recipient Address"
                  variant="filled"
                />
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
      {showTransaction &&
        (transaction.length === 0 ? (
          <div className="app__tableNoData">
            <h1>Transaction Details</h1>
            <p>There is no transaction record</p>
          </div>
        ) : (
          <div className="tableConatainer">
            <div className="app__tableData">
              <h1>Transaction Details</h1>
              <div className="app__mainTable">
                <table>
                  <tr className="table__headingContainer">
                    <th className="table__heading">Index</th>
                    <th className="table__heading">Block</th>
                    <th className="table__heading">From</th>
                    <th className="table__heading">To</th>
                    <th className="table__heading">Value</th>
                  </tr>
                  {transaction.map((value, index) => {
                    return (
                      <>
                        <tr className="table__dataContainer" key={index}>
                          <td className="table__Heading">{index + 1}</td>
                          <td className="table__Heading">
                            {value.blockNumber}
                          </td>
                          <td className="table__Heading">{value.from}</td>
                          <td className="table__Heading">{value.to}</td>
                          <td className="table__Heading">
                            <span className="table__values">
                              {value.value / 1000000000000000000}
                            </span>
                            <span className="table__value">Ether</span>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default App;
