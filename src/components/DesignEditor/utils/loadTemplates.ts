import { IScene } from '@layerhub-io/types';
import { IDesign } from '../interfaces/DesignEditor';
import { loadVideoEditorAssets } from './video';
import { loadTemplateFonts } from './fonts';

export const loadGraphicTemplate = async (payload: IDesign, editor) => {
  const scenes = [];
  const { scenes: scns, ...design } = payload;

  for (const scn of scns) {
    const scene: IScene = {
      name: scn.name,
      frame: payload.frame,
      id: scn.id,
      layers: scn.layers,
      metadata: {},
    };
    const loadedScene = await loadVideoEditorAssets(scene);
    await loadTemplateFonts(loadedScene);

    const preview = (await editor?.renderer.render(loadedScene)) as string;
    scenes.push({ ...loadedScene, preview });
  }

  return { scenes, design };
};
