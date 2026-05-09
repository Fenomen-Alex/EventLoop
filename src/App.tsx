/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hub from './screens/Hub';
import Browser from './screens/Browser';
import NodeEnv from './screens/NodeEnv';
import Playground from './screens/Playground';
import Memory from './screens/Memory';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/browser" element={<Browser />} />
          <Route path="/node" element={<NodeEnv />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/memory" element={<Memory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


