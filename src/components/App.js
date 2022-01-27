import React from 'react'
import { useMoralis } from "react-moralis"
import { Button } from '@chakra-ui/react'

const App = ({ props }) => {
  const { authenticate, isAuthenticated, user } = useMoralis();

  if (!isAuthenticated) {
    return (
      <div>
        <Button onClick={() => authenticate()}>Authenticate</Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {user.get("username")}</h1>
    </div>
  );

}

export default App