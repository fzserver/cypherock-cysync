import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../utils';
import { theme } from '../../themes/theme.styled';

interface AsideContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg';
}

const AsideContainerStyle = styled.div<AsideContainerProps>`
  min-width: 280px;
  width: 27%;
  min-height: 100vh;
  padding: 32px;
  display: flex;
  overflow-y: hidden;
  overflow-x: hidden;
  @media (${theme.screens.lg}) {
    min-width: 500px;
    padding: 40px 32px;
  }

  ${utils}
`;

export const AsideContainer: FC<AsideContainerProps> = ({
  children,
  ...props
}) => <AsideContainerStyle {...props}>{children}</AsideContainerStyle>;

AsideContainer.defaultProps = {
  children: null,
  size: 'lg',
};
