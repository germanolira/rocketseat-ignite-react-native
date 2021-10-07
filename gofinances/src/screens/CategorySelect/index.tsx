import React from 'react';
import { FlatList } from 'react-native';

import { Button } from '../../components/Form/Button'
import { categories } from '../../utils/categories';

import { 
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({ // Essa função é um componente que recebe os dados da categoria ->
  category, // selecionada e a função de fechar a tela de seleção de categoria
  setCategory,
  closeSelectCategory,
} : Props) {
  function handleCategorySelect(category: Category) {
    setCategory(category); // Essa função é chamada quando o usuário seleciona uma categoria
  }

  return (

    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
    
        <FlatList
          data={categories}
          style={{flex: 1, width: '100%'}}
          keyExtractor={(item) => item.key}
          renderItem={({item}) => (
            <Category
              onPress={() => handleCategorySelect(item)}
              isActive={category.key === item.key}
            >
              <Icon name={item.icon} />
              <Name>{item.name}</Name>
            </Category>
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
        <Footer>
            <Button
            title="Selecionar"
            onPress={closeSelectCategory}
            />
      </Footer>
    </Container>
  );
}