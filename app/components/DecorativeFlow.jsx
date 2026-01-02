'use client';
 
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
 
// Hide all controls for decorative-only use
const CustomControls = () => null;
const CustomMiniMap = () => null;
 
// Simple decorative edge
const DecorativeEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEndId, style }) => {
  return (
    <path
      d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
       markerEnd={markerEndId ? `url(#${markerEndId})` : undefined}
      style={{
        stroke: 'rgba(255, 255, 255, 0.3)',
        strokeWidth: 2,
        fill: 'none',
        strokeLinecap: 'round',
      }}
    />
  );
};
 
const edgeTypes = {
  decorative: DecorativeEdge,
};
 
// Main component
function DecorativeFlowContent() {
  console.log('DecorativeFlow component mounted!');
  
  // Simple nodes - nav and about
  const initialNodes = [
    {
      id: 'about',
      type: 'default',
      position: { x:400, y: 100 },
      data: { label: '' },
      style: { opacity: 0.5, width: 20, height: 20, backgroundColor: 'red' }
    },
    {
      id: 'overview',
      type: 'default',
      position: { x: 500, y: 700 },
      data: { label: '' },
      style: { opacity: 0.5, width: 20, height: 20, backgroundColor: 'red' }
    },
  ];
 
  // Single edge from nav to about
  const initialEdges = [
    {
      id: 'e-nav-about',
      source: 'about',
      target: 'overview',
      animated: true,
      style: { strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(255, 255, 255, 1)',
        width: 120,
        height: 100,
      },
    },
  ];
 
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  // Simple position update - just connect visible elements
  const updateNodePositions = useCallback(() => {
    // Find nav and about sections
    const navEl = document.querySelector('#about');
    const aboutEl = document.querySelector('#overview');
    
    if (navEl && aboutEl) {
      const newNodes = nodes.map(node => {
        if (node.id === 'about') {
          const rect = navEl.getBoundingClientRect();
          return {
            ...node,
            position: { x: rect.left + rect.width / 2, y: rect.bottom },
          };
        }
        if (node.id === 'overview') {
          const rect = aboutEl.getBoundingClientRect();
          return {
            ...node,
            position: { x: rect.left + rect.width / 2, y: rect.top },
          };
        }
        return node;
      });
      setNodes(newNodes);
    }
  }, [nodes, setNodes]);
 
  // Update positions on mount and resize
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateNodePositions, 100); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    // Initial update after DOM is ready
    setTimeout(updateNodePositions, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []); // Remove updateNodePositions dependency
 
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      edgeTypes={edgeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      panOnDrag={false}
      fitView={false}
      minZoom={1}
      maxZoom={1}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 14000,
        backgroundColor: 'transparent', // Bright red to see if it renders
      }}
    >
      <Background color="transparent" />
      <CustomControls />
      <CustomMiniMap />
    </ReactFlow>
  );
}
 
// Wrapper with provider
export default function DecorativeFlow() {
  return (
    <ReactFlowProvider>
      <DecorativeFlowContent />
    </ReactFlowProvider>
  );
}