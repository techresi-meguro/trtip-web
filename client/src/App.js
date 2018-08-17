import React, { Component } from 'react';
import { Container, Header, Icon, Divider, List, Dimmer, Loader } from 'semantic-ui-react';

const SLACK_AUTH_TOKEN = '<SLACK_AUTH_TOKEN>'

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
    Promise.all(accounts.map(async (account) => {
      const user = await this.fetch(
        `https://slack.com/api/users.profile.get?token=${SLACK_AUTH_TOKEN}&user=${account.slack_user_id_string}`,
        {
          method: 'GET',
        }
      )
      return user.profile
    }))
    .then((users) => {
      this.setState({ users: users });
    });
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
                return <List.Item>{users[key].real_name}</List.Item>
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
