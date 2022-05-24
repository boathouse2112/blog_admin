import { css, Global } from '@emotion/react';
import normalize from 'normalize.css';
import React from 'react';

const BaseStyle = (props: React.PropsWithChildren<{}>) => {
  return (
    <>
      <Global
        styles={css`
          ${normalize}
        `}
      />
      {props.children}
    </>
  );
};

export default BaseStyle;
