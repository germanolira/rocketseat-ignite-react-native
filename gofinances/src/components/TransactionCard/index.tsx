import React from 'react';

import { Container } from './styles';

export function TransactionCard() {
  return (
    <Container>
      <Title>Desenvolvimento de app</Title>

      <Amount>R$ 12.000,00</Amount>

      <Footer>
        <Category>
          <Icon name="dollar-sign" />
          <CategoryName>Vendas</CategoryName>
        </Category>
      </Footer>
    </Container>
  )
}