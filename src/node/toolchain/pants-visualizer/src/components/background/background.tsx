/*
Copyright 2022 Toolchain Labs, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (see LICENSE).
*/

import { styled } from '@mui/material/styles';

type BackgroundProps = { children: React.ReactNode };

const BackgroundContainer = styled('div')(() => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: '#EDF5FF',
}));

const Background = ({ children }: BackgroundProps) => {
  return <BackgroundContainer>{children}</BackgroundContainer>;
};

export default Background;
