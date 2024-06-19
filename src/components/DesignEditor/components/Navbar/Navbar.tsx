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
import toast from 'react-hot-toast';

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
  const [loadingSave, setLoadingSave] = useState(false);
  const [isEditing, setIsEditing] = useState(false)

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


  const handleImportTemplate = useCallback(

    async (data: any) => {
      if (editor) {
        if (data.type === "GRAPHIC") {
          const template = await loadGraphicTemplate(data);
          setScenes(template.scenes);
          //@ts-ignore
          setCurrentDesign(template.design);
        }
      } else {
        console.error("Editor is not initialized.");
      }
    },
    [editor]
  );



  const router = useRouter();
  const { session, id } = router.query
  const { userId } = useAuth()
  const { user } = useUser()

  const fetchData = async () => {
    const supabase = createClerkSupabaseClient();

    if (user?.unsafeMetadata.isSubscribed === false) {
      router.push("/subscription");
      return;
    }

    const subscriptionDateStr = user?.unsafeMetadata.subscriptionDate;

    if (subscriptionDateStr) {
      const differenceInDays = subscriptionTimeLeft(subscriptionDateStr);

      if (differenceInDays > 30) {
        router.push("/subscription");
        return;
      }
    }

    const { data: existingSession, error: sessionError } = await supabase
      .from('user_designs')
      .select('user_id, json')
      .eq('session', session)
      .single();

    if (existingSession) {
      if (existingSession.user_id == userId) {
        const jsonDesign = JSON.parse(existingSession.json);

        let template = await loadGraphicTemplate(jsonDesign);
        setScenes(template.scenes);
        setCurrentDesign(template.design);
      } else {
        router.push("/");
      }
    } else {
      const { data: designData, error: designError } = await supabase
        .from('designs')
        .select('json, cover')
        .eq('id', id)
        .single();

      if (designError || !designData) {
        router.push("/");
      }

      const jsonDesign = JSON.parse(designData?.json);

      let template = await loadGraphicTemplate(jsonDesign);
      setScenes(template.scenes);
      setCurrentDesign(template.design);
    }
  }


  const storageKey = `design_${session}_${id}`;
  const storedData = localStorage.getItem(storageKey);

  useEffect(() => {

    const fetchLS = async (storedData) => {
      try {
        const jsonDesign = JSON.parse(storedData);
        let template = await loadGraphicTemplate(jsonDesign);
        setScenes(template.scenes);
        setCurrentDesign(template.design);
      } catch (error) {
        console.error("Error fetching from localStorage:", error);
        router.push("/"); // Handle error by redirecting or other appropriate action
      }
    };

    if (storedData) {
      fetchLS(storedData);

    } else {
      fetchData();
    }

  }, [editor, session, userId]);



  const handleInputFileRefClick = () => {
    inputFileRef?.current?.click()
  }
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (res) => {
        const result = res.target!.result as string
        const design = JSON.parse(result)
        handleImportTemplate(design)
      }
      reader.onerror = (err) => {
        console.log(err)
      }

      reader.readAsText(file)
    }

  }
  const { editorLogo, darkLogo } = siteSettings;

  useEffect(() => {
    let watcher = () => {
      setIsEditing(true)
    };

    if (editor) {
      editor.on('history:changed', watcher);
    }

    return () => {
      if (editor) {
        editor.off('history:changed', watcher);
      }
    };

  }, [editor]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isEditing) {
        event.preventDefault()
      }
    };

    const handlePopState = (event) => {
      if (isEditing) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        if (!window.confirm(message)) {
          // If user cancels, push state back to avoid the back navigation
          window.history.pushState(null, null, window.location.href);
        } else {
          // Allow the back navigation
          window.history.back();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push a new state to ensure popstate is triggered when back is pressed
    window.history.pushState(null, null, window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isEditing]);

  const handleSave = async () => {
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
        setLoadingSave(true);

        const graphicTemplate: IDesign = {
          id: currentDesign.id,
          type: 'GRAPHIC',
          name: currentDesign.name,
          frame: currentDesign.frame,
          scenes: updatedScenes,
          metadata: {},
          preview: existingThumbnail,
        };

        localStorage.setItem(`design_${session}_${id}`, JSON.stringify(graphicTemplate));

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
          toast.error(updateError.message || "Error on Saving, please try again")
          setLoadingSave(false)
          return
        }
        toast.success('Saved Succesfully')
        setLoadingSave(false);
        setIsEditing(false)
      } else {

        setLoadingSave(true);

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

          localStorage.setItem(`design_${session}_${id}`, JSON.stringify(graphicTemplate));

          if (insertError) {
            setLoadingSave(false);
            toast.error(updateError.message || "Error on Saving, please try again")
            return
          }
          toast.success('Saved Succesfully')
          setLoadingSave(false);
          setIsEditing(false)
        }).catch(e => {
          setLoadingSave(false);
          toast.error("Error, Please try again later")
        });
      }
    }
  }

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
        setLoadingSave(true);
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

        localStorage.setItem(`design_${session}_${id}`, JSON.stringify(graphicTemplate));

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
          setLoadingSave(false);
          setLoadingDownload(false);
          toast.error(updateError.message || "Error on Saving, please try again")
          return
        }

        const currentScene = editor.scene.exportToJSON();

        try {
          const image = (await editor.renderer.render(currentScene)) as string;
          const link = document.createElement('a');
          link.download = currentDesign.name;
          link.href = image;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Downloaded Successfully');
          setLoadingSave(false);
          setIsEditing(false)
          setLoadingDownload(false);
        } catch (error) {
          toast.error('Failed to download. Make sure you"re not using in-app browsers eg:facebook or check your internet', { duration: 5000 });
          setLoadingSave(false);
          setLoadingDownload(false);
        }
      } else {

        setLoadingSave(true);
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

          localStorage.setItem(`design_${session}_${id}`, JSON.stringify(graphicTemplate));

          if (insertError) {
            setLoadingSave(false);
            setLoadingDownload(false);
            toast.error(insertError.message || "Error on Saving, please try again")
          }
          const currentScene = editor.scene.exportToJSON();

          try {
            const image = (await editor.renderer.render(currentScene)) as string;
            const link = document.createElement('a');
            link.download = currentDesign.name;
            link.href = image;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Downloaded Successfully');
            setLoadingSave(false);
            setIsEditing(false)
            setLoadingDownload(false);
          } catch (error) {
            toast.error('Failed to download. Make sure you"re not using in-app browsers eg:facebook');
            setLoadingSave(false);
            setLoadingDownload(false);
          }
        }).catch(e => {
          setLoadingSave(false);
          setLoadingDownload(false);
          toast.error("Error, Please try again later")
        });
      }
    }
  }

  return (
    // @ts-ignore
    <ThemeProvider theme={DarkTheme}>

      {isLargeScreen ? <Container>
        <div style={{ color: '#ffffff' }}>

          <Link href="/" target="_blank">
            <Image alt='Logo' src={darkLogo} width={120} height={36} />
          </Link>
        </div>
        <DesignTitle />
        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <input
            multiple={false}
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          {/* <Button
            size="compact"
            onClick={handleInputFileRefClick}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
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
          </Button> */}

          <SaveButton
            onClick={handleSave}
            className='font-body mr-3 '
            // disabled={isLoadingMore}
            isLoading={loadingSave}

          >
            Save
          </SaveButton>

          <SaveButton
            onClick={handleSaveDownload}
            className='font-body'
            // disabled={isLoadingMore}
            isLoading={loadingDownload}

          >
            Download
          </SaveButton>


        </Block>
      </Container> :
        <div className="bg-black flex items-center justify-between h-14 px-3">
          <div className="flex items-center">
            <Link href="/" target="_blank">
              <Image alt="Logo" src={editorLogo} width={30} height={30} />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <MobileDesignTitle />
          </div>
          <div className="flex items-center space-x-2">
            <SaveButton
              onClick={handleSave}
              className="py-3 !px-2 md:px-5 font-body text-sm md:text-base bg-dark-500"
              isLoading={loadingSave}
            >
              Save
            </SaveButton>
            <SaveButton
              onClick={handleSaveDownload}
              className="py-3 !px-2 md:px-5 font-body text-sm md:text-base bg-dark-500"
              isLoading={loadingDownload}
            >
              Download
            </SaveButton>
          </div>
        </div>
      }

    </ThemeProvider>
  );
};

export default Navbar;
