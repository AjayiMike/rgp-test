import {useState, useEffect} from "react"
import './App.css';
import Header from "./components/Header"
import Profiles from "./views/Profiles"
import CreateProfile from "./views/CreateProfile"
import SideDrawer from "./components/SideDrawer"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import { ethers } from 'ethers'
import Abi from "./ABI/abi.json";


function App() {

  const contractAddress = "0x006F599c0920A5b369dE668E0810e53a9F8b216D";


    //  create profile form data state
  const [newProfileData, setNewProfileData] = useState({
    firstName: "",
    lastName: ""
  })

  //  currently conected user
  const [userAccount, setUserAccount] = useState({
    address: null,
    balance: null
  })

  const [wrongNetworkNotice, setWrongNetworkNotice] = useState(false);

  const [loaderState, setLoaderState] = useState(false)


  // all profiles
  const [profiles, setProfiles] = useState([])

  // controls whether or not the side drawer should be rendered depending on screen width
  const [windowWidth, setWindowWidth] = useState()

  // stores the state of the side drawer
  const [showSideDrawer, setShowSideDrawer] = useState(true)

  // handler to control the display of the side drawer
  const toggleNav = () => {
    if(showSideDrawer) {
      setShowSideDrawer(false)
    } else {
      setShowSideDrawer(true)
    }
  }

  // window resize handler to keep the app state in sync with the screen width (for contraoling the side drawer)
 const onScreenResizeHandler = () => {
  const width = window.innerWidth;
  setWindowWidth(width);
 }


 const connectWallet = async () => {

  if(!window.web3 || !window.ethereum) return;

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // the event handler resposible for accountChanged event will pick up from here
  } catch (err) {
    console.log(err)
  }
}

  // create profile onChange handler
  const onNamesChange = (e) => {
    const {name} = e.target

    switch(name) {
      case "firstName" :
        setNewProfileData({...newProfileData, firstName: e.target.value})
        break;

      case "lastName" :
        setNewProfileData({...newProfileData, lastName: e.target.value})
        break;

      default:
        break;
    }
  }

  const createProfile = async () => {

    if(!newProfileData.firstName || !newProfileData.lastName) return alert(" please fill out all fields appropriately")

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Abi, signer);

    try {
      const amountWEI = ethers.utils.parseUnits("0.01" , "ether" ).toString()
      const profileTX = await contract.createProfile(newProfileData.lastName, newProfileData.firstName, {value: amountWEI})
    
      const txHash = await provider.getTransaction(profileTX.hash);

      if(txHash) setLoaderState(true);

      await profileTX.wait()

      const txReceipt = await provider.getTransactionReceipt(profileTX.hash);

      setLoaderState(false);
      setNewProfileData({
        firstName: "",
        lastName: ""
      })

      if (txReceipt && txReceipt.blockNumber) {
        alert('profile created');
    } else {
        alert('Something went wrong')
    }
    } catch(err) {
        setLoaderState(false);
        alert('Something went wrong')
        setNewProfileData({
          firstName: "",
          lastName: ""
        })
    }
  }      





 const init = async () => {

  const profilesArray = [];

  if(window.web3 || window.ethereum) {

    const handleChainChanged = async (chainId) => {
      const accounts = await provider.listAccounts() 

      if(accounts.length) {

        if(Number(chainId) === 4) {
          const balance = await provider.getBalance(accounts[0]);
          setUserAccount({
            address: accounts[0],
            balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
          })
          setWrongNetworkNotice(false)
        } else {
          setUserAccount({
            address: null,
            balance: null
          })
          setWrongNetworkNotice(true)
        }
      }
    }

    const handleAccountsChanged = async (accounts) => {

      if(accounts.length && chainId === 4) {
        
        const balance = await provider.getBalance(accounts[0]);
        setUserAccount({
          address: accounts[0],
          balance: parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
        })
        setWrongNetworkNotice(false)
      } else {
        setUserAccount({
          address: null,
          balance: null
        })
        setWrongNetworkNotice(true)
      }
    }

    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('accountsChanged', handleAccountsChanged)

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    });
    const {chainId} = await provider.getNetwork()
    if(chainId === 4) { //on Rinkeby, the provider can be used

      const contract = new ethers.Contract(contractAddress, Abi, provider);
      const allProfiles = await contract.queryFilter("NewProfile", 9048407); // since i know the block the of contract creation, which is "9048407", there is no need starting from block, 0

      allProfiles.forEach(profile => {
        const profileObj = {
          profileAddress: profile.args.from,
          firstName: profile.args.firstname,
          lastName: profile.args.lastname,
          profileId: Number(profile.args.userId)
        }
        profilesArray.unshift(profileObj)
      })

      contract.on('NewProfile', (lastName, firstName, from, userId, event) => {
        event.removeListener(); // for some reasons, this event is getting fired twice at every point a profile is created. removeListener prevents that
        const newProfile = {
          profileAddress: from,
          firstName,
          lastName,
          profileId: Number(userId)
        }

        setProfiles([newProfile, ...profiles])
      })

    } else { //ethereum enabled browser but user is on a different network
      const infuraUrl = "https://rinkeby.infura.io/v3/ef33864b41c2483ea92e0f32275a6ab3";
      const customHttpProvider = new ethers.providers.JsonRpcProvider(infuraUrl);
      const contract = new ethers.Contract(contractAddress, Abi, customHttpProvider);
      
      const allProfiles = await contract.queryFilter("NewProfile", 9048407);

      allProfiles.forEach(profile => {
        const profileObj = {
          profileAddress: profile.args.from,
          firstName: profile.args.firstname,
          lastName: profile.args.lastname,
          profileId: Number(profile.args.userId)
        }
        profilesArray.unshift(profileObj)
      })

      contract.on('NewProfile', (lastName, firstName, from, userId, event) => {
        event.removeListener();
        const newProfile = {
          profileAddress: from,
          firstName,
          lastName,
          profileId: Number(userId)
        }

        setProfiles([newProfile, ...profiles])
      })
    }
    

  } else {
    // for non ethereum enabled browser
    const infuraUrl = "https://rinkeby.infura.io/v3/ef33864b41c2483ea92e0f32275a6ab3";
    const customHttpProvider = new ethers.providers.JsonRpcProvider(infuraUrl);
    const contract = new ethers.Contract(contractAddress, Abi, customHttpProvider);


    const allProfiles = await contract.queryFilter("NewProfile", 9048407);

    allProfiles.forEach(profile => {
      const profileObj = {
        profileAddress: profile.args.from,
        firstName: profile.args.firstname,
        lastName: profile.args.lastname,
        profileId: Number(profile.args.userId)
      }
      profilesArray.unshift(profileObj)
    })

    contract.on('NewProfile', (lastName, firstName, from, userId, event) => {
      event.removeListener();
      const newProfile = {
        profileAddress: from,
        firstName,
        lastName,
        profileId: Number(userId)
      }

      setProfiles([newProfile, ...profiles])
    })
  }

  setProfiles(profilesArray);
 }

  useEffect(() => {

    const width = window.innerWidth;
    setWindowWidth(width);

    window.addEventListener("resize", onScreenResizeHandler)

    init();

    return () => {
      window.removeEventListener("resize", onScreenResizeHandler)
    }
    // eslint-disable-next-line
  }, [])



  


  return (
    <div className="App">
      <Router>
        <Header userAccount = {userAccount} displaySideDrawer = {toggleNav} connectWallet = {connectWallet}/>
        {wrongNetworkNotice && <span className = "wrong-network-notice">You are connected to the wrong network, please switch to Rinkeby Network</span>}
        {windowWidth <= 768 && <SideDrawer hideSideDrawer = {toggleNav} showSideDrawerState = {showSideDrawer}/>}
        <Switch>
          <Route exact path="/">
            <Profiles profiles = {profiles}/>
          </Route>
          <Route exact path="/profiles">
            <Profiles profiles = {profiles}/>
          </Route>
          <Route exact path="/create-profile">
            <CreateProfile newProfileData = {newProfileData} createProfile = {createProfile} onNamesChange = {onNamesChange} connected = {!!userAccount.address} loaderState = {loaderState} connectWallet = {connectWallet}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
