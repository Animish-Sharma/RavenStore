import React from 'react';
import OrderService from "../services/orderService";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import styles from "../styles/pages/Payment.module.scss"
import { parseCookies } from '../lib/parseCookies'
import CheckoutForm from '../components/Payment/CheckoutForm';
import Head from 'next/head';
import { SidebarContext } from '../hocs/Layout';
const stripePromise = loadStripe('pk_test_51J7Ga9SBQGLnBcpaNPpkV9dIKdUhNd6NBwJtUCDrKjfSO3ehzCOmL0rsebvYMpGSuSSZft4EDyEnADFwWYht6BXF00ADmZZh1h');

function Payment({ clientSecret }) {
    const isSide = React.useContext(SidebarContext)
  const options = {
    // passing the client secret obtained in step 2
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {
        theme:"flat",
        labels: 'floating',
        variables: {
            colorPrimary: '#0570de',
            colorBackground: '#f0f0f0',
            colorText: '#30313d',
            spacingGridRow: "20px",
            spacingGridColumn: "40px",
            colorDanger: '#df1b41',
            fontFamily: "Rubik,sans-serif",
            spacingUnit: '4px',
            borderRadius: '4px',
          },
    },
  };

  return (
      <div className={`${styles.payment} ${!isSide && styles.side}`}>
          <Head>
              <title>Raven | Payment</title>
          </Head>
          <h1>Payment</h1>
          <div>
              <span>
                <img src="/images/payment.svg"/>
              </span>
              <span>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
              </span>
          </div>
      </div>
  );
};

export async function getServerSideProps({ req }) {
    const token = parseCookies(req).token
    const secret = await OrderService.createIntent(token);
    return {
        props:{
            clientSecret: secret.intentclientSecret || "",
        }
    }
}

export default Payment