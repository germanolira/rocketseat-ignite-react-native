import React from 'react';

import { 
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
} from './styles'

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://www.infomoney.com.br/wp-content/uploads/2019/07/elon-musk.png?fit=900%2C644&quality=50&strip=all' }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Elon Musk</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>

      </Header>
    </Container>
  )
}