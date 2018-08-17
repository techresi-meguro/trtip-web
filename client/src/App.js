import React, { Component } from 'react';
import { Container, Header, Icon, Divider, List, Dimmer, Loader } from 'semantic-ui-react';

const TRTIP_CONTRACT_ADDRESS = '0x8C78e1124cF417C549655F80EF987492ee4fD826';
const TRTIP_CONTRACT_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  }
];

class App extends Component {
  constructor () {
    super()
    this.state = {}
    this.getUsers = this.getUsers.bind(this)

    const Web3 = require('web3');
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));
  }

  componentDidMount () {
    this.getUsers();
    this.getAllEvents();
  }

  async fetch (endpoint, params) {
    try {
      const response = await window.fetch(endpoint, params);
      const json = response.json();
      return json;
    } catch (error) {
      console.log(error)
    }
  }

  async getUsers () {
    const accounts = await this.fetch('/api/accounts')
    console.log(accounts);
    this.setState({ users: accounts });
  }

  async getAllEvents () {
    this.trtipContract = new this.web3.eth.Contract(TRTIP_CONTRACT_ABI, TRTIP_CONTRACT_ADDRESS);
    const events = await this.trtipContract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
    }, (error, events) => {
      console.log(error);
      console.log(events);
    });
    console.log(events);
  }

  render() {
    let {users} = this.state;

    return users
       ?  <Container text>
            <Header as='h2' icon textAlign='center' color='teal'>
              <Icon name='unordered list' circular />
              <Header.Content>
                List of Users
              </Header.Content>
            </Header>
            <Divider hidden section />
            {users && users.length
              ? <List>
                {Object.keys(users).map((key) => {
                return <List.Item key={key}>{users[key].real_name}</List.Item>
                })}
                </List>
              : <Container textAlign='center'>No users found.</Container>
            }

          </Container>
        : <Container text>
            <Dimmer active inverted>
              <Loader content='Loading' />
            </Dimmer>
          </Container>
  }
}

export default App;
