import { useContext } from 'react';
import { DesignEditorContext } from '../contexts/DesignEditor';

const useDesignEditorContext = () => {
  const {
    editorType,
    setEditorType,
    displayPlayback,
    setDisplayPlayback,
    setDisplayPreview,
    displayPreview,
    currentScene,
    setCurrentScene,
    setScenes,
    scenes,
    maxTime,
    setMaxTime,
    contextMenuTimelineRequest,
    setContextMenuTimelineRequest,
    contextMenuSceneRequest,
    setContextMenuSceneRequest,
    currentDesign,
    setCurrentDesign,
    templateId,
    setTemplateId,
  } = useContext(DesignEditorContext);
  return {
    editorType,
    setEditorType,
    displayPlayback,
    setDisplayPlayback,
    setDisplayPreview,
    displayPreview,
    currentScene,
    setCurrentScene,
    setScenes,
    scenes,
    maxTime,
    setMaxTime,
    contextMenuTimelineRequest,
    setContextMenuTimelineRequest,
    contextMenuSceneRequest,
    setContextMenuSceneRequest,
    currentDesign,
    setCurrentDesign,
    templateId,
    setTemplateId,
  };
};

export default useDesignEditorContext;
