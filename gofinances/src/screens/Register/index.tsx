import React, { useState } from 'react';

import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Form/Button';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate:(screen:string) => void; // Tipagem do tipo de propriedade que o navigate vai receber
}

const schema = Yup.object().shape({ // Adiciona as validações ao formulário
  name: Yup.string().required('Nome é obrigatório'), // Validação do campo nome
  amount: Yup
  .number()
  .typeError('Informe um valor número')
  .positive('Informe um valor positivo')
  .required('Informe um valor'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState(''); // Tipo de transação
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  // Seta se o modal de categorias está aberto, começando como 'fechado'
  
  const [category, setCategory] = useState({ // Seta a categoria selecionada
    key: 'category',
    name: 'Categoria'
  });

  const navigation = useNavigation<NavigationProps>() // Seta a navegação

  const { // O useForm é um hook que permite o uso do formulário no react native
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema) // Validação do formulário
  })
  
  // Função que seta o tipo de transação selecionada
  function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  };

  // Função que abre o modal de categorias selecionadas e seta a categoria pra true
  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  };

  // Função que fecha o modal de categorias selecionadas e seta a categoria pra false
  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  };

  // Async function que o usuário deve selecionar uma categoria
  async function handleRegister(form: FormData) { // Tipando o formulário
    if(!transactionType) 
      return Alert.alert('Selecione o tipo da transação'); // Se não tiver tipo de transação selecionada, retorna um alerta

    if(category.key == 'category')
      return Alert.alert('Selecione a categoria'); // Se não tiver categoria selecionada, retorna um alerta

    const newTransaction = { // Cria uma nova transação
      id: String(uuid.v4()), // Seta o id da transação com uma string aleatória
      name: form.name, // Seta o nome da transação
      amount: form.amount, // Seta o valor da transação 
      type: transactionType, // Seta o tipo da transação
      category: category.key, // Seta a categoria da transação
      date: new Date(), // Seta a data da transação com a data atual do sistema 
    }

    try { // Tenta salvar a transação no AsyncStorage
      const dataKey = '@gofinances:transactions'; // Seta a chave do localStorage
      const data = await AsyncStorage.getItem(dataKey); // Pega os dados do localStorage 
      const currentData = data ? JSON.parse(data) : []; // Converte os dados do localStorage para um array

      const dataFormated = [ // Formata os dados para salvar no localStorage
        ...currentData, // Adiciona os dados do localStorage no array, puxando os dados antigos
        newTransaction, // Adiciona a nova transação no array
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated)); // Salva os dados no localStorage

      reset(); // Reseta o formulário
      setTransactionType(''); // Reseta o tipo de transação
      setCategory({ // Adiciona a categoria padrão
        key: 'category',
        name: 'Categoria'
      });
      
      navigation.navigate('Listagem'); // Navega para a listagem

    } catch(error) { // Se der algum erro, retorna um alerta
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>

          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="words"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionsTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionsTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}