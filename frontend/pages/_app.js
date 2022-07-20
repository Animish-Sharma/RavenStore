import '../styles/globals.css'
import { Provider } from "react-redux"
import { wrapper,store } from '../redux/store'
import Layout from '../hocs/Layout'
import { useEffect, useState } from 'react';
function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

export default wrapper.withRedux(MyApp)
