import React from 'react';

import {
  Container,
  Title,
  Amount,
} from './styles';

interface Props { 
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({
  title,
  amount,
  color,
} : Props) { // Tipando a função
  return (
    <>
      <Container color={color}>
        <Title>{ title }</Title>
        <Amount>{ amount }</Amount>
      </Container>
    </>
  )
}