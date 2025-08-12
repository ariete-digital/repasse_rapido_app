import bgImg from '@images/red_american_header_home.png';
import { View } from 'react-native';
import * as H from './styles';
import SearchableSelect from '@components/SearchableSelect';
import Filters from '../Filters';

function HeaderHome() {
  return (
    <H.Container>
      <Filters />
    </H.Container>
  );
}

export default HeaderHome;
