import React from 'react'
import ReactQuill from 'react-quill'

function Editor({value, onChange}) {


  const modules = {
    'toolbar': [
      [{ 'font': [] }, { 'size': [] }],
      [ 'bold', 'italic', 'underline', 'strike' ],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'super' }, { 'script': 'sub' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
      [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
      [ 'direction', { 'align': [] }],
      [ 'link', 'image', 'video', 'formula' ],
      [ 'clean' ]
]
}


  return (
    <ReactQuill 
      value={value}
      onChange={onChange}
      modules={modules} />
  )
}

export default Editor
