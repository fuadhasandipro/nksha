import React from 'react';
import { useActiveObject, useEditor } from '@layerhub-io/react';

import { styled } from 'baseui';
import Items from './Items';
import useAppContext from '@/components/DesignEditor/hooks/useAppContext';
import { ILayer } from '@layerhub-io/types';
import getSelectionType from '@/components/DesignEditor/utils/get-selection-type';

const DEFAULT_TOOLBOX = 'Canvas';

interface ToolboxState {
  toolbox: string;
}

const Container = styled('div', (props) => ({
  boxShadow: 'rgb(0 0 0 / 15%) 0px 1px 1px',
  height: '50px',
  display: 'flex',
  overflow: 'scroll',
  background: "#fff"
}));

const Toolbox = () => {
  console.log(useAppContext());
  const [state, setState] = React.useState<ToolboxState>({ toolbox: 'Text' });
  const activeObject = useActiveObject() as ILayer;
  const editor = useEditor();

  React.useEffect(() => {
    const selectionType = getSelectionType(activeObject);
    if (selectionType) {
      if (selectionType.length > 1) {
        setState({ toolbox: 'Multiple' });
      } else {
        setState({ toolbox: selectionType[0] });
      }
    } else {
      setState({ toolbox: DEFAULT_TOOLBOX });
    }
  }, [activeObject]);

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject) {
        // @ts-ignore
        const selectionType = getSelectionType(activeObject) as any;

        if (selectionType.length > 1) {
          setState({ toolbox: 'Multiple' });
        } else {
          setState({ toolbox: selectionType[0] });
        }
      }
    };
    if (editor) {
      editor.on('history:changed', watcher);
    }
    return () => {
      if (editor) {
        editor.off('history:changed', watcher);
      }
    };
  }, [editor, activeObject]);

  // @ts-ignore
  const Component = Items[state.toolbox];

  return <Container>{Component ? <Component /> : state.toolbox}</Container>;
};

export default Toolbox;
