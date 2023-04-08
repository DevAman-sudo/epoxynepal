import Layout from "../components/Layout";
import "../styles/globals.css";


function MyApp({ Component, pageProps }) {

  // connectMongo()

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
