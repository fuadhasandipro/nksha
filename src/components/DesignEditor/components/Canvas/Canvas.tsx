import React, { useEffect } from 'react';
import { Canvas as LayerhubCanvas, useEditor } from '@layerhub-io/react';
import Playback from '../Playback';
import useDesignEditorContext from '../../hooks/useDesignEditorContext';
import ContextMenu from '../ContextMenu';

const Canvas = () => {
  const { displayPlayback } = useDesignEditorContext();

  return (
    <div style={{ flex: 1, display: 'flex', position: 'relative', }}>
      {displayPlayback && <Playback />}
      <ContextMenu />
      <LayerhubCanvas
        config={{
          background: '#dfdfdf',
          frameMargin: 20,
          shadow: {
            blur: 5,
            color: '#e74c3c',
            offsetX: 0,
            offsetY: 0,
          },

        }}
      />
    </div>
  );
};

export default Canvas;
