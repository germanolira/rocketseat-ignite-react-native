import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'

import { HistoryCard } from '../../components/HistoryCard/index';

import {
  Container,
  Header,
  Title,
  Content,
} from './styles';
import { categories } from '../../utils/categories';

interface TransactionData {
  type: 'positive' | 'negative'
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
}

export function Resume() { // O nome dessa [] é Vetor
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  async function loadData() { // Função para carregar os dados do AsyncStorage
    const dataKey = '@gofinances:transactions'; // Chave AsyncStorage
    const response = await AsyncStorage.getItem(dataKey); // Carrega os dados do AsyncStorage
    const responseFormatted = response ? JSON.parse(response) : []; // Formata os dados do AsyncStorage

    const expensives = responseFormatted // Separa os dados por tipo de transação
    .filter((expensive : TransactionData) => expensive.type === 'negative'); // Filtra os dados do AsyncStorage

    const totalByCategory: CategoryData[] = []; // Array que armazena os dados de cada categoria

    // Se tem 10 categorias, esse laço vai dar 10 voltas
    categories.forEach(category => { // Percorrer cada categoria
      let categorySum = 0;

      // Vai percorrer todos os gastos verificando se a categoria do gasto é a mesma da chave que tá percorrendo
      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount); // Se for a mesma categoria, adiciona o valor do gasto na categoria
        }
      }); // Agora o valor precisa ser armazenado, porque se não no forEach, vai contar como zero

      if(categorySum > 0) { // Se a categoria tiver um valor maior que zero, adiciona a categoria e o valor na lista}
        const totalFormatted = categorySum
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }); // Converte o valor para o padrão brasileiro

        totalByCategory.push({ // Adiciona o valor da categoria no array | em totalByCategory[]
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
        });
      }
    });
    setTotalByCategories(totalByCategory); // Atualiza o estado com os dados
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Container>
        <Header>
          <Title>Resumo por categoria</Title>
        </Header>

        <Content>

          <VictoryPie
            data={totalByCategories}
            x="name"
            y="total"
          />

        {
          totalByCategories.map(item => ( // Percorre o array de categorias
            <HistoryCard // HistoryCard é um componente que recebe os dados da categoria
              key={item.key}
              title={item.name} // Nome da categoria
              amount={item.totalFormatted} // Valor da categoria
              color={item.color} // Cor da categoria
            />
          ))
        }
        </Content>

      </Container>
    </>
  )
}