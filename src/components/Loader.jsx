import React from 'react';
import { HashLoader } from 'react-spinners'

function Loader() {
  return (
    <div style={styles.container}>
      <HashLoader color="#33FF57" />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
  },
};

export default Loader;

