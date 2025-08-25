import React from 'react';
import { EffectComposer, Pixelation } from '@react-three/postprocessing';

const PixelationEffect = ({ granularity = 15 }) => {
  return (
    <EffectComposer>
      <Pixelation granularity={granularity} />
    </EffectComposer>
  );
};

export default PixelationEffect;