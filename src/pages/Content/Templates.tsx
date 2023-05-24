import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Configuration, { Template } from "../../config/Configuration";

const config = new Configuration();

const Container = styled.div`
  display: flex;
  flex-flow: row;
  gap: 0.5em;
  padding: 5px;
  width: 700px;
`;

const Row = styled.div`
  display: flex;
  flex-flow: column;
  gap: 0.3em;
  width: 100%;
  border: 1px solid black;
  padding: 5px;
  box-sizing: border-box;
  margin: 5px;
`;

const BigContainer = styled.div`
  display: flex;
  flex-flow: row;
  gap: 0.5em;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const SelectContainer = styled.div`
  padding: 6px 12px 0px 6px;
  flex-grow: 1;
  margin: 4px 0;
`;

const Select = styled.select`
  width: 100%;
  height: 32px;
`;

const Sentences = styled.div`
  border: 1px solid black;
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
`;

const Sentence = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const SentenceName = styled.div`
  cursor: pointer;
  padding: 0.5em;
  width: 150px;
`;

const ColumnTitle = styled.div`
  font-weight: bold;
  line-height: 32PX;
`;

const SentenceText = styled.div`
  flex-grow: 1;
  cursor: pointer;
  padding: 0.5em;
`;

const SentenceGame = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  gap: 0.3em;
  padding-left: 20px;
  & > label {
    padding: 1.1em 0.3em 0em 0em;
  }
`;

const SentenceAction = styled.div`
  padding: 0.5em;
`;

const HorizontalButtons = styled.div`
  display: flex;
  flex-flow: row;
  gap: 1em;
  justify-content: flex-end;
  padding-right: 2em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5em;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5em;
  resize: none;
  height: 100px;
`;

const Check = styled.input`
  position: absolute;
  top: 16px;
  left: 0px;
`;

const NoTemplate = styled.div`
  width: 100%;
  text-align: right;
  font-style: italic;
  line-height: 32px;
`;

interface TemplatesProps {
  gameName: string,
}

const Templates = (props: TemplatesProps) => {
  const [configMode, setConfigMode] = useState(false);
  const [templates, setTemplates] = useState<Template[]>();

  useEffect(() => {
    try {
      config.init().then(() => {
        setTemplates(config.listTemplates());
      });
    }
    catch (error) { }
  }, []);

  const toggleConfig = () => setConfigMode(!configMode);
  const getTemplates = () => templates ? templates.filter(t => [props.gameName, 'all'].includes(t.game)) : [];

  const addTemplate = () => {
    setTemplates(config.addTemplate({ name: 'my sentence name', text: 'my sentence text', game: props.gameName }));
  };

  const useTemplate = () => {
    const textArea = document.getElementById('report_log') as any;
    const templateInput = document.getElementById('templates_input') as any;

    if (textArea && templateInput && templateInput.value) {
      const selectionStart = textArea.selectionStart;
      const selectionEnd = textArea.selectionEnd;
      const text = textArea.value;

      const newText = `${text.substring(0, selectionStart)}${templateInput.value}${text.substring(selectionEnd)}`;
      textArea.value = newText;
    }
  };

  const getOptions = () => {
    if (!templates) {
      return <></>;
    }

    return getTemplates().map((t, index) => {
      return <option key={`o_${index}`} value={t.text}>{t.name}</option>;
    });
  };

  const getSentences = () => {
    if (!templates) {
      return <></>;
    }

    return getTemplates().map((t, index) => {
      const updateTemplate = (name: string, text: string, game: string) => {
        setTemplates(config.updateTemplate(t.name, t.game, { game, name, text }));
      };

      const removeTemplate = () => {
        setTemplates(config.removeTemplate(t));
      };

      const checkId = `c_${index}`;

      return (
        <Sentence key={`s_${index}`}>
          <SentenceName><Input value={t.name} onChange={(evt) => updateTemplate(evt.target.value as string, t.text, t.game)} /></SentenceName>
          <SentenceText><TextArea value={t.text} onChange={(evt) => updateTemplate(t.name, evt.target.value as string, t.game)} /></SentenceText>
          <SentenceGame>
            <Check type='checkbox' checked={t.game === 'all'} id={checkId} onChange={(evt) => updateTemplate(t.name, t.text, evt.target.checked ? 'all' : props.gameName)} />
            <label htmlFor={checkId}>all games</label>
          </SentenceGame>
          <SentenceAction>
            <a className="bgabutton bgabutton_blue" style={{ margin: '0px' }} onClick={removeTemplate}>remove</a>
          </SentenceAction>
        </Sentence>
      );
    });
  }

  const existsTemplates = getTemplates().length > 0;

  if (configMode) {
    return (
      <Row>
        <h3 className="pagesection__title" style={{ paddingLeft: '2em' }}>Template messages</h3>
        <BigContainer>
          {existsTemplates && <Sentences>
            <Sentence>
              <SentenceName><ColumnTitle>Name</ColumnTitle></SentenceName>
              <SentenceText><ColumnTitle>Text</ColumnTitle></SentenceText>
              <SentenceGame></SentenceGame>
              <SentenceAction></SentenceAction>
            </Sentence>
            {getSentences()}
          </Sentences>}
          {!existsTemplates && <span>No templates found</span>}
        </BigContainer>
        <HorizontalButtons>
          <a className="bgabutton bgabutton_blue" onClick={addTemplate}>add new template</a>
          <a className="bgabutton bgabutton_blue" onClick={toggleConfig}>close</a>
        </HorizontalButtons>
      </Row>
    );
  }

  return (
    <Container>
      <SelectContainer>
        {existsTemplates && <Select id='templates_input'>{getOptions()}</Select>}
        {!existsTemplates && <NoTemplate>No templates found</NoTemplate>}
      </SelectContainer>
      {existsTemplates && <a className="bgabutton bgabutton_blue" onClick={useTemplate}>insert this template</a>}
      <a className="bgabutton bgabutton_blue" onClick={toggleConfig}>config</a>
    </Container>
  );

};

export default Templates;