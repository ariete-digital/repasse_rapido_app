import styled from 'styled-components/native';

export const SellerContainer = styled.View`
  gap: 24px;
`;

export const HeaderContainer = styled.View`
  width: 30%;
  background-color: ${(props) => props.theme.colors['brand-red']};
  padding: 8px 4px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  align-items: center;
`;

export const ContactRow = styled.View`
  flex-direction: row;
`;
