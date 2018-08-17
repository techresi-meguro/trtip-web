import React, { Component } from 'react';
import { Container, Header, Icon, Divider, List, Dimmer, Loader } from 'semantic-ui-react';

class App extends Component {
  constructor () {
    super()
    this.state = {}
    this.getUsers = this.getUsers.bind(this)
  }

  componentDidMount () {
    this.getUsers()
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
