import React, { useCallback, useEffect, useState } from 'react';
import { styled, ThemeProvider, DarkTheme } from 'baseui';
import { Theme } from 'baseui/theme';
import { Button, KIND } from 'baseui/button';
import SaveButton from '@/components/ui/button';
import Logo from '@/components/DesignEditor/components/Icons/Logo';
import useDesignEditorContext from '@/components/DesignEditor/hooks/useDesignEditorContext';
import Play from '@/components/DesignEditor/components/Icons/Play';
import { Block } from 'baseui/block';
import { useEditor } from '@layerhub-io/react';
import useEditorType from '@/components/DesignEditor/hooks/useEditorType';
import { IScene } from '@layerhub-io/types';
import DesignTitle from './DesignTitle';
import { IDesign } from '@/components/DesignEditor/interfaces/DesignEditor';
import Github from '@/components/DesignEditor/components/Icons/Github';
import { loadTemplateFonts } from '../../utils/fonts';
import { loadVideoEditorAssets } from '../../utils/video';

import { useRouter } from 'next/router';
import supabases, { createClerkSupabaseClient } from '@/services/server';
import { useAuth, useUser } from '@clerk/nextjs';
import MobileDesignTitle from './MobileDesignTitle';
import subscriptionTimeLeft from '@/lib/getSubscriptionDuration';
import axios from 'axios';
import Image from 'next/image';
import { siteSettings } from '@/data/static/site-settings';
import Link from 'next/link';

const Container = styled<'div', {}, Theme>('div', ({ $theme }) => ({
  height: '64px',
  background: $theme.colors.black,
  display: 'grid',
  padding: '0 1.25rem',
  gridTemplateColumns: '380px 1fr 380px',
  alignItems: 'center',
  overflowX: 'hidden',
}));

const Navbar = ({ isLargeScreen }) => {
  const {
    setDisplayPreview,
    setScenes,
    setCurrentDesign,
    currentDesign,
    scenes,
  } = useDesignEditorContext();
  const editorType = useEditorType();
  const editor = useEditor();
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const [loadingDownload, setLoadingDownload] = useState(false);


  // const { userId } = useAuth();
  const [previewImage, setPreviewImage] = useState("");

  const parseGraphicJSON = () => {
    const currentScene = editor.scene.exportToJSON();

    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      };
    });

    if (currentDesign) {
      const graphicTemplate: IDesign = {
        id: currentDesign.id,
        type: 'GRAPHIC',
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: "",
      };

      makeDownload(graphicTemplate);
    } else {
      console.log('NO CURRENT DESIGN');
    }
  };

  const parsePresentationJSON = () => {
    const currentScene = editor.scene.exportToJSON();

    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          duration: 5000,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return {
        id: scn.id,
        duration: 5000,
        layers: scn.layers,
        name: scn.name,
      };
    });

    if (currentDesign) {
      const presentationTemplate: IDesign = {
        id: currentDesign.id,
        type: 'PRESENTATION',
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: '',
      };
      makeDownload(presentationTemplate);
    } else {
      console.log('NO CURRENT DESIGN');
    }
  };

  const parseVideoJSON = () => {
    const currentScene = editor.scene.exportToJSON();
    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: scn.id,
          duration: scn.duration,
          layers: currentScene.layers,
          name: currentScene.name ? currentScene.name : '',
        };
      }
      return {
        id: scn.id,
        duration: scn.duration,
        layers: scn.layers,
        name: scn.name ? scn.name : '',
      };
    });
    if (currentDesign) {
      const videoTemplate: IDesign = {
        id: currentDesign.id,
        type: 'VIDEO',
        name: currentDesign.name,
        frame: currentDesign.frame,
        scenes: updatedScenes,
        metadata: {},
        preview: '',
      };
      makeDownload(videoTemplate);
    } else {
      console.log('NO CURRENT DESIGN');
    }
  };

  const makeDownload = (data: Object) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'template.json';
    a.click();
  };

  const makeDownloadTemplate = async () => {
    if (editor) {
      if (editorType === 'GRAPHIC') {
        return parseGraphicJSON();
      } else if (editorType === 'PRESENTATION') {
        return parsePresentationJSON();
      } else {
        return parseVideoJSON();
      }
    }
  };

  const loadGraphicTemplate = async (payload: IDesign) => {
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

  const loadPresentationTemplate = async (payload: IDesign) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;

    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn,
        layers: scn.layers,
        metadata: {},
      };
      const loadedScene = await loadVideoEditorAssets(scene);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      await loadTemplateFonts(loadedScene);
      scenes.push({ ...loadedScene, preview });
    }
    return { scenes, design };
  };

  const loadVideoTemplate = async (payload: IDesign) => {
    const scenes = [];
    const { scenes: scns, ...design } = payload;

    for (const scn of scns) {
      const design: IScene = {
        name: 'Awesome template',
        frame: payload.frame,
        id: scn.id,
        layers: scn.layers,
        metadata: {},
        duration: scn.duration,
      };
      const loadedScene = await loadVideoEditorAssets(design);

      const preview = (await editor.renderer.render(loadedScene)) as string;
      await loadTemplateFonts(loadedScene);
      scenes.push({ ...loadedScene, preview });
    }
    return { scenes, design };
  };

  const handleImportTemplate = React.useCallback(
    async (data: any) => {
      let template;
      if (data.type === 'GRAPHIC') {
        template = await loadGraphicTemplate(data, editor);
      } else if (data.type === 'PRESENTATION') {
        template = await loadPresentationTemplate(data);
      } else if (data.type === 'VIDEO') {
        template = await loadVideoTemplate(data);
      }
      //   @ts-ignore
      setScenes(template.scenes);
      //   @ts-ignore
      setCurrentDesign(template.design);
    },
    [editor]
  );
  const router = useRouter();

  const { session, id } = router.query

  const { userId } = useAuth()

  const { user } = useUser()


  useEffect(() => {
    const fetchData = async () => {

      const supabase = createClerkSupabaseClient()

      if (user?.unsafeMetadata.isSubscribed == false) {
        router.push("/subscription")
        return
      }

      const subscriptionDateStr = user?.unsafeMetadata.subscriptionDate;

      if (subscriptionDateStr) {
        const differenceInDays = subscriptionTimeLeft(subscriptionDateStr)

        if (differenceInDays > 30) {
          router.push("/subscription");
          return;
        }
      }

      // Fetch existing session
      const { data: existingSession, error: sessionError } = await supabase
        .from('user_designs')
        .select('user_id, json')
        .eq('session', session)
        .single();

      if (sessionError) {
        console.log(sessionError);
      }

      if (existingSession) {
        if (existingSession.user_id == userId) {
          const jsonDesign = JSON.parse(existingSession.json);

          let template = await loadGraphicTemplate(jsonDesign);
          setScenes(template.scenes);
          setCurrentDesign(template.design);
        } else {
          router.push("/")
        }
      } else {
        const { data: designData, error: designError } = await supabase
          .from('designs')
          .select('json, cover')
          .eq('id', id)
          .single();

        if (designError || !designData) {
          router.push("/")
        }

        const jsonDesign = JSON.parse(designData?.json);

        let template = await loadGraphicTemplate(jsonDesign);
        setScenes(template.scenes);
        setCurrentDesign(template.design);

      }
    };

    fetchData();

  }, [session, id, userId]);

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (res) => {
        const result = res.target!.result as string;
        const design = JSON.parse(result);
        handleImportTemplate(design);
      };
      reader.onerror = (err) => {
        console.log(err);
      };

      reader.readAsText(file);
    }
  };

  const handleSaveDownload = async () => {
    const supabase = createClerkSupabaseClient();
    const currentScene = editor.scene.exportToJSON();

    const image = (await editor.renderer.render(currentScene)) as string
    const baseImage = image.split(',')[1];

    const apiKey = '007aff46bb49446f04020287cfbcb445';
    const apiUrl = 'https://api.imgbb.com/1/upload';
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', baseImage);

    const updatedScenes = scenes.map((scn) => {
      if (scn.id === currentScene.id) {
        return {
          id: currentScene.id,
          layers: currentScene.layers,
          name: currentScene.name,
        };
      }
      return {
        id: scn.id,
        layers: scn.layers,
        name: scn.name,
      };
    });

    if (currentDesign) {

      const { data: existingThumbnail } = await supabase
        .from('user_designs')
        .select('thumbnail')
        .eq('session', router.query.session)
        .single();

      if (existingThumbnail) {
        setLoadingDownload(true);

        const graphicTemplate: IDesign = {
          id: currentDesign.id,
          type: 'GRAPHIC',
          name: currentDesign.name,
          frame: currentDesign.frame,
          scenes: updatedScenes,
          metadata: {},
          preview: existingThumbnail,
        };

        const { error: updateError } = await supabase
          .from('user_designs')
          .update({
            title: currentDesign.name,
            json: JSON.stringify(graphicTemplate),
            user_id: userId,
            updated_at: new Date().toISOString(),
          })
          .eq('session', router.query.session);

        if (updateError) {
          alert(updateError.message)
        }

        const link = document.createElement('a');
        link.download = currentDesign.name;

        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoadingDownload(false);
      } else {

        setLoadingDownload(true);

        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(async (res) => {
          const graphicTemplate: IDesign = {
            id: currentDesign.id,
            type: 'GRAPHIC',
            name: currentDesign.name,
            frame: currentDesign.frame,
            scenes: updatedScenes,
            metadata: {},
            preview: res.data.data.display_url,
          };

          const { error: insertError } = await supabase
            .from('user_designs')
            .insert({
              title: currentDesign.name,
              json: JSON.stringify(graphicTemplate),
              user_id: userId,
              session: router.query.session,
              thumbnail: res.data.data.display_url,
              updated_at: new Date().toISOString(),
              template_id: router.query.id,
            });

          if (insertError) {
            alert(insertError.message)
          }

          const link = document.createElement('a');
          link.download = currentDesign.name;

          link.href = image;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setLoadingDownload(false);
        }).catch(e => {
          setLoadingDownload(false);
          alert("Error, Please try again later")
        });
      }
    }
  }

  const { editorLogo, darkLogo } = siteSettings;


  return (
    // @ts-ignore
    <ThemeProvider theme={DarkTheme}>

      {isLargeScreen ? <Container>
        <div style={{ color: '#ffffff' }}>

          <Link href="/" target='_blank'>
            <Image alt='Logo' src={darkLogo} width={120} height={36} />
          </Link>
        </div>
        <DesignTitle />
        <Block
          $style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <input
            multiple={false}
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: 'none' }}
          />
          <Button
            size="compact"
            onClick={handleInputFileRefClick}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: '4px',
                },
              },
            }}
          >
            Import
          </Button>

          <Button
            size="compact"
            onClick={makeDownloadTemplate}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: '4px',
                },
              },
            }}
          >
            Export
          </Button>
          {/* 
          <Button
            size="compact"
            onClick={() => {
              handleSaveDownload()
            }}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: '4px',
                },
              },
            }}
          >
            Save & Download
          </Button> */}

          <SaveButton
            onClick={handleSaveDownload}
            className='font-body'
            // disabled={isLoadingMore}
            isLoading={loadingDownload}

          >
            Save Image
          </SaveButton>


        </Block>
      </Container> :

        <div className='bg-black flex items-center justify-between h-14 px-3 flex-none'>
          <div className='flex-1'>
            <Link href="/" target='_blank'>
              <Image alt='Logo' src={editorLogo} width={30} height={30} />
            </Link>

          </div>
          <MobileDesignTitle />

          <SaveButton
            onClick={handleSaveDownload}
            className='min-h-[15px] py-2.5 px-5 font-body'
            // disabled={isLoadingMore}
            isLoading={loadingDownload}

          >
            Save
          </SaveButton>
        </div>}

    </ThemeProvider>
  );
};

export default Navbar;
