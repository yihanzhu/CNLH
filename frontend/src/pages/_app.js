// _app.js
import '@/styles/globals.css';
import { AssignmentsProvider } from '@/pages/context/assignmentsContext'; // Ensure the path is correct

function MyApp({ Component, pageProps }) {
  return (
    <AssignmentsProvider>
      <Component {...pageProps} />
    </AssignmentsProvider>
  );
}

export default MyApp;
