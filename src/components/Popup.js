import React from 'react'
import ReactDOM from 'react-dom'
import { Container, Button } from '@chakra-ui/react'

class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    }
  }

  componentDidMount() {
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    return (
    <Container p={4}>
      {this.state.user
        ? <h1>{this.state.user.ethAddress}</h1>
        : <h1>No user at this time</h1>
      }
      <Button id="popup-authentication-info-button">
        Get user info
      </Button><br/>
      <Button id="popup-authenticate-button">
        Authenticate
      </Button>
    </Container>
    )
  }
}

export default Popup