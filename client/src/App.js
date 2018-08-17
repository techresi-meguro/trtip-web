import React, { Component } from 'react';
import { Container, Header, Icon, Divider, List, Dimmer, Loader, Image, Label } from 'semantic-ui-react';

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

  async componentDidMount () {
    await this.getUsers();
    this.getTransactions();
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

    let addressToUser = {};
    accounts.forEach((account) => {
      const address = account['ethereum_address'];
      addressToUser[address.toLowerCase()] = account;
    });
    this.setState({ addressToUser: addressToUser });
  }

  getTransactions () {
    this.trtipContract = new this.web3.eth.Contract(TRTIP_CONTRACT_ABI, TRTIP_CONTRACT_ADDRESS);
    this.trtipContract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
    }, (error, events) => {
      console.log(error);
      console.log(events);

      Promise.all(events.map(async (event) => {
        console.log(event.blockNumber);
        const block = await this.web3.eth.getBlock(event.blockNumber);
        const timestamp = block.timestamp;
        const eventLog = this.web3.eth.abi.decodeLog([{
            type: 'address',
            name: 'from',
            indexed: true,
          }, {
            type: 'address',
            name: 'to',
            indexed: true,
          }, {
            type: 'uint256',
            name: 'value',
          }],
          event.raw.data,
          event.raw.topics.slice(1),
        );
        return Object.assign({ timestamp: timestamp }, eventLog);
      })).then ((eventLogs) => {
        console.log(eventLogs);
        this.setState({ eventLogs: eventLogs.reverse() });
      });
    });
  }

  render() {
    let { addressToUser, eventLogs} = this.state;

    return addressToUser && eventLogs
       ?  <Container text>
            <Header as='h2' icon textAlign='center' color='teal'>
              <Icon name='unordered list' circular />
              <Header.Content>
                Latest Transactions
              </Header.Content>
            </Header>
            <Divider hidden section />
            {eventLogs && eventLogs.length
              ? <List relaxed>
                {Object.keys(eventLogs).map((key) => {
                  const from = eventLogs[key]['from'].toLowerCase();
                  const to = eventLogs[key]['to'].toLowerCase();
                  const fromUserName = addressToUser[from] ? addressToUser[from].real_name : from;
                  const fromUserImage = addressToUser[from] ? addressToUser[from].image_48 : '';
                  const toUserImage = addressToUser[to] ? addressToUser[to].image_48 : '';
                  const date = new Date(eventLogs[key].timestamp * 1000);

                  return (
                    <List.Item key={key}>
                      <Image src={fromUserImage} circular />
                      <List.Content>
                        <List.Header>{fromUserName}  <Label>{date.toLocaleString()}</Label></List.Header>
                        <List.Description>
                          <a>Slackメッセージ</a>にリアクションしました。
                        </List.Description>
                      </List.Content>
                      <List.Content floated='right'>
                        <Image src={toUserImage} circular />
                        <Label circular color='orange' key='orange'>{eventLogs[key].value/1000000000000000000} TRTP</Label>
                      </List.Content>
                    </List.Item>
                  );
                })}
                </List>
              : <Container textAlign='center'>No Transactions found.</Container>
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
