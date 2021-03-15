import React from 'react';
import RichTextEditor from 'react-rte';

import './style.scss';
 
const MyStatefulEditor = ({ value="", onChange=()=>{}, maxLength=450, defaultValue="", error }) => {
  const textValue = RichTextEditor.createValueFromString(defaultValue || "", "html");
  const [editorValue, setValue] = React.useState(textValue);
  const editorState = editorValue.getEditorState();
  const contentState = editorState.getCurrentContent();
  const editorTextLength = contentState.getPlainText().length;

  let options = {
    defaultBlockTag: null,
    inlineStyles: {
      BOLD: {element: 'b'},
      ITALIC: {
        element: 'i'
      },
    },
  }
 
  const handleChange = (newValue) => {
    let editorState = newValue.getEditorState();
    const contentState = editorState.getCurrentContent();
    if (contentState.getPlainText().length > maxLength) {
      setValue(RichTextEditor.createValueFromString(editorValue.toString('html') || "", "html"));
      return;
    }
    if (!contentState.getPlainText().length) {
      onChange(null);
    } else {
      // console.log(newValue.toString('html', options));
      onChange(newValue.toString('html', options));
    }
    // console.log(newValue);
    setValue(newValue);
  };

  React.useEffect(() => {
    setValue(RichTextEditor.createValueFromString(defaultValue || "", "html"));
  }, [defaultValue]);
 
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_ALIGNMENT_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'}
    ],
    // BLOCK_ALIGNMENT_BUTTONS: [
    //   {label: 'Align Left', style: 'ALIGN_LEFT'},
    //   {label: 'Align Center', style: 'ALIGN_CENTER'},
    //   {label: 'Align Right', style: 'ALIGN_RIGHT'},
    //   {label: 'Align Justify', style: 'ALIGN_JUSTIFY'}
    // ]
  };
  return (
    <div className="oe-rte">
      <RichTextEditor
        value={editorValue}
        onChange={handleChange}
        toolbarConfig={toolbarConfig}
        toolbarClassName="oe-rte-toolbar"
        editorClassName="oe-rte-editor"
        className={`oe-rte-root ${!!error && 'oe-form-error'}`}
      />
      <p className="oe-rte-text-count">{`${+(maxLength - editorTextLength)} characters remaining of ${maxLength} characters`}</p>
    </div>
  );
}

export default MyStatefulEditor;
