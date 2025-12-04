import { RouterProvider } from 'react-router';
import { router } from './services/router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
