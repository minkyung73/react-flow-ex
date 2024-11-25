import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';


const initialNodes = [
  {
    id: '0',
    sourcePosition: 'right',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
    depth: 1,
  },
];

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0.5, 0];

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  // 이상하다.. nodes가 rootNode 밖에 안 들어있음
  // 근데 onCheckNodes 함수 실행하면 노드 개수만큼 잘 나옴
  const onConnect = useCallback(
    (params) => {
      console.log(params);

      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);

      console.log(sourceNode, targetNode);
  
      // 두 노드의 depth 차이가 1이 아닐 경우 연결을 하지 않음
      if (sourceNode && targetNode && Math.abs(sourceNode.depth - targetNode.depth) !== 1) {
        console.log('Connection not allowed: depth difference is not 1');
        return; // 연결을 하지 않음
      }

      // 엣지를 추가할 때 type을 'step'으로 설정
      setEdges((eds) => addEdge({ ...params, type: 'step' }, eds));
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        console.log(clientX, clientY);
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          sourcePosition: 'right',
          targetPosition: 'left',
          origin: [0.5, 0.0],
          depth: connectionState.fromNode.depth + 1,
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id, type: 'step' }),
        );
      }
    },
    [screenToFlowPosition],
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  const onCheckNodes = () => {
    console.log('nodes: ', nodes);
  }

  const onCheckEdges = () => {
    console.log('edges: ', edges);
  }

  return (
    <div className="wrapper" ref={reactFlowWrapper} style={{ width: "100vw", height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
      >
        <Panel position='topleft'>
          <div>
            <button onClick={onCheckNodes}>
              check the nodes
            </button>
            <button onClick={onCheckEdges}>
              check the edges
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  )
};
