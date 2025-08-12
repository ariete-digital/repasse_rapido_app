import { useState } from 'react';
import {
  SecurityModal,
  TermsModal,
  Text,
} from '@components/index';
import { Content } from '@screens/Details/types';
import * as A from './styles';


const About = ({ anuncio, aceitouTermos }: Content) => {
  return (
    <A.Container>
      <A.Content>
        <Text color="black-700" fontStyle="t-24">
          Sobre o veículo
        </Text>
        <Text color="black-700">{anuncio.descricao}</Text>
      </A.Content>
    </A.Container>
  );
};

export default About;
