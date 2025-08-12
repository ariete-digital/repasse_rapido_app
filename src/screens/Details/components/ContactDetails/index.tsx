import Text from '@components/Text';
import { getVechicleOwnerDetails } from '@services/vehicle';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator } from 'react-native';

import * as C from './styles';
import { formatarTelefone } from '@utils/index';

const ContactDetails = ({ id }: { id: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['owner'],
    queryFn: () => getVechicleOwnerDetails(id),
  });

  if (isLoading || !data) {
    return <ActivityIndicator />;
  }

  return (
    <C.SellerContainer>
      <C.HeaderContainer>
        <Text color="white" fontStyle="p-16-bold">
          Anunciante
        </Text>
      </C.HeaderContainer>
      <C.ContactRow style={{ flexDirection: 'row' }}>
        <Text color="black" fontStyle="p-16-bold">
          {data.anunciante.nome}
        </Text>
      </C.ContactRow>

      <C.ContactRow style={{ flexDirection: 'row' }}>
        <Text color="black" fontStyle="p-14-bold">
          Localização:{' '}
        </Text>
        <Text color="black">{data.anunciante.cidade.nome}</Text>
      </C.ContactRow>

      <C.ContactRow style={{ flexDirection: 'row' }}>
        <Text color="black" fontStyle="p-14-bold">
          Contato:{' '}
        </Text>
        <Text color="black">
          {data.anunciante.celular
            ? formatarTelefone(data.anunciante.celular)
            : ''}
          {data.anunciante.telefone && data.anunciante.celular ? ' | ' : ''}
          {data.anunciante.telefone
            ? formatarTelefone(data.anunciante.telefone)
            : ''}
        </Text>
      </C.ContactRow>
    </C.SellerContainer>
  );
};

export default ContactDetails;
