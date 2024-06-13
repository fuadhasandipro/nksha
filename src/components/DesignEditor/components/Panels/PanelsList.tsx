import { useStyletron, styled } from 'baseui';
import {
  BASE_ITEMS,
  VIDEO_PANEL_ITEMS,
} from '@/components/DesignEditor/constants/app-options';
import useAppContext from '../../hooks/useAppContext';
import Icons from '@/components/DesignEditor/components/Icons';
import { useTranslation } from 'react-i18next';

import useEditorType from '@/components/DesignEditor/hooks/useEditorType';
import Scrollable from '@/components/DesignEditor/components/Scrollable';
import { Block } from 'baseui/block';
import useSetIsSidebarOpen from '../../hooks/useSetIsSidebarOpen';

const Container = styled('div', (props) => ({
  width: '80px',
  backgroundColor: props.$theme.colors.primary100,
  display: 'flex',
}));

const PanelsList = () => {
  const { activePanel } = useAppContext();
  const { t } = useTranslation('editor');
  const editorType = useEditorType();
  const PANEL_ITEMS = editorType === 'VIDEO' ? VIDEO_PANEL_ITEMS : BASE_ITEMS;
  return (
    <Container style={{ background: '#18191b' }}>
      <Scrollable autoHide={true}>
        {PANEL_ITEMS.map((panelListItem) => (
          <PanelListItem
            label={t(`panels.panelsList.${panelListItem.id}`)}
            name={panelListItem.name}
            key={panelListItem.name}
            icon={panelListItem.name}
            activePanel={activePanel}
          />
        ))}
      </Scrollable>
    </Container>
  );
};

const PanelListItem = ({ label, icon, activePanel, name }: any) => {
  const { setActivePanel } = useAppContext();
  const setIsSidebarOpen = useSetIsSidebarOpen();
  const [css, theme] = useStyletron();
  // @ts-ignore
  const Icon = Icons[icon];
  return (
    <Block
      id="EditorPanelList"
      onClick={() => {
        setIsSidebarOpen(true);
        setActivePanel(name);
      }}
      $style={{
        width: '80px',
        height: '80px',
        // backgroundColor: name === activePanel ? "#252627" : "#18191b",
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Uber Move Text',
        fontWeight: 500,
        fontSize: '0.8rem',
        userSelect: 'none',
        transition: 'all 0.5s',
        gap: '0.1rem',
        ':hover': {
          cursor: 'pointer',
          backgroundColor: '#252627',
          transition: 'all 0.2s ease',
        },
      }}
    >
      <Icon size={24} />
      <div>{label}</div>
    </Block>
  );
};

export default PanelsList;
