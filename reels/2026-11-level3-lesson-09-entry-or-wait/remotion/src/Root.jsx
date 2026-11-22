import React from 'react';
import { Composition } from 'remotion';
import { Lesson } from './Lesson.jsx';
import data from './shots.json';

export const RemotionRoot = () => <>
  <Composition id="L3Lesson9" component={Lesson} durationInFrames={Math.round(data.duration * data.fps)} fps={data.fps} width={1920} height={1080} defaultProps={{ audio: true }} />
</>;
