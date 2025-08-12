import styled from "styled-components/native";

export const Container = styled.View`
    align-items: center;
    justify-content: center;
    border-bottom-width: 1px;
    border-bottom-color:  ${props => props.theme.colors['gray-300']} ;
    padding: 30px;
    margin-bottom: 10px;
`