import React, { useEffect, useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

export function Dashboard() { // Essa função é responsável por renderizar o Dashboard
  const [isLoading, setIsLoading] = useState(true); // Estado que controla a animação de carregamento
  const [transactions, setTransactions] = useState<DataListProps[]>([]); // Estado que armazena as transações
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData); // Estado que armazena os dados de destaque

  const theme = useTheme(); // Estado que armazena o tema atual

  function getLastTransactionDate( // Função que retorna a data da última transação
    collection: DataListProps[], // Coleção de transações
    type: 'positive' | 'negative' // Tipo de transação (positiva ou negativa)
    ){

    const lastTransaction = new Date( // Cria uma nova data com a última transação
    Math.max.apply(Math, collection // 
    .filter(transaction => transaction.type === type) // Filtra as transações pelo tipo de transação
    .map(transaction => new Date(transaction.date).getTime()))) // Retorna a data da última transação

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
    // Retorna a data da última transação formatada
  }

  async function loadTransactions() { // Função que carrega as transações
    const dataKey = '@gofinances:transactions'; // Chave de armazenamento das transações
    const response = await AsyncStorage.getItem(dataKey); // Armazena as transações
    const transactions = response ? JSON.parse(response) : []; // Armazena as transações em formato JSON

    let entriesTotal = 0; // Variável que armazena o total de entradas
    let expensiveTotal = 0; // Variável que armazena o total de despesas

    const transactionsFormatted: DataListProps[] = transactions. // Cria uma nova coleção de transações formatadas 
    map((item: DataListProps) => { // Faz um map para cada transação e retorna uma nova coleção

      if(item.type === 'positive') { // Se o tipo de transação for positiva
        entriesTotal += Number(item.amount); // Soma o valor da transação ao total de entradas
      } else { // Se o tipo de transação for negativa
        expensiveTotal += Number(item.amount); // Soma o valor da transação ao total de despesas
      }

      const amount = Number(item.amount) // Converte o valor da transação para número
      .toLocaleString('pt-BR', { // Formata o valor da transação
        style: 'currency', // Formata o valor da transação como moeda
        currency: 'BRL', // Formata o valor da transação como BRL
      });

      const date = Intl.DateTimeFormat('pt-BR', { // Formata a data da transação
        day: '2-digit', // Formata o dia da transação com 2 dígitos
        month: '2-digit', // Formata o mês da transação com 2 dígitos
        year: '2-digit' // Tipo de ano
      }).format(new Date(item.date)); // Retorna a data da transação formatada

      return { // Retorna uma nova transação formatada
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    });

    setTransactions(transactionsFormatted); // Seta as transações formatadas

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive'); // Armazena a última transação de entrada
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative'); // Armazena a última transação de despesa
    const totalInterval = `01 a ${lastTransactionExpensives};`
    // Calcula o intervalo total de transações do dia 01 até a última transação de despesa

    const total = entriesTotal - expensiveTotal; // Calcula o total de transações do dia 01 até a última transação de despesa
    
    setHighlightData({ // Seta os dados de destaque
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval
      }
    });
    setIsLoading(false); // Seta que a animação de carregamento está finalizada
  }

  useEffect(() => { // Função que carrega as transações
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => { // Função que carrega as transações ao entrar na tela
    loadTransactions();
  },[]));

  return (
    <Container>
      {
        isLoading ? <LoadContainer>
          <ActivityIndicator 
          color={theme.colors.primary}
          size="large" />
          </LoadContainer> :
        <>
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

            <LogoutButton onPress={() => {}}>
              <Icon name="power" />
            </LogoutButton>
          </UserWrapper>

        </Header>
        
        <HighlightCards>

          <HighlightCard
            type="up"
            title="Entradas"
            amount={highlightData?.entries?.amount}
            lastTransaction={highlightData.entries.lastTransaction}
          />

          <HighlightCard
            type="down"
            title="Saídas"
            amount={highlightData?.expensives?.amount}
            lastTransaction={highlightData.expensives.lastTransaction}
          />

          <HighlightCard
            type="total"
            title="Total"
            amount={highlightData?.total?.amount}
            lastTransaction={highlightData.total.lastTransaction}
          />

        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionList 
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        </Transactions>
        </>
      }
    </Container>
  )
}