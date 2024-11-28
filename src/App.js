import './App.css';
import React, {useState, useEffect} from 'react';
import HorizontalFlow from './pages/horizontal-flow';
import ElkjsTree from './pages/Elkjs-tree';
import StyleNodeFlow from './pages/custom-nodes';
import AddNodeOnEdgeDrop from './pages/add-node-on-edge-drop';
import FMEA from './pages/fmea';
import CustomNodeFlow from './pages/connection-limit';


function renderPage(page) {
  if(page === 1) return <HorizontalFlow />
  // else if(page === 2) return <DragAndDrops />
  else if(page === 3) return <ElkjsTree />
  else if(page === 4) return <StyleNodeFlow />
  else if(page === 5) return <AddNodeOnEdgeDrop />
  else if(page === 6) return <FMEA />
  else if(page === 7) return <CustomNodeFlow />
}

function App() {
  const [page, setPage] = useState(0);

  return (
    <div className="App">
      <div>
        <button onClick={() => setPage(1)}>Horizontal Flow</button>
        {/* <button onClick={() => setPage(2)}>Drag And Drops</button> */}
        <button onClick={() => setPage(3)}>Elkjs Tree</button>
        <button onClick={() => setPage(4)}>Custom Nodes</button>
        <button onClick={() => setPage(5)}>Add Node On Edge Drops</button>
        <button onClick={() => setPage(6)}>FMEA</button>
        <button onClick={() => setPage(7)}>Custom Node Flow</button>
      </div>
      <div>
        {renderPage(page)}
      </div>
    </div>
  );
}

export default App;
