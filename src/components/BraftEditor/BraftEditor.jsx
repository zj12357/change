import React, { forwardRef, useState, useEffect } from 'react';
import { Upload, Icon, Modal, message } from 'antd';

import { genID, filterImages } from '@/utils/utils.js';

import { uploadUrl, imagesUrl } from '@/utils/config.js';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';

import Table from 'braft-extensions/dist/table';

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const options = {
  defaultColumns: 4, // 默认列数
  defaultRows: 4, // 默认行数
  withDropdown: false, // 插入表格前是否弹出下拉菜单
  columnResizable: false, // 是否允许拖动调整列宽，默认false
  exportAttrString: "border='1'", // 指定输出HTML时附加到table标签上的属性字符串
  includeEditors: ['editor-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  excludeEditors: ['editor-id-2'], // 指定该模块对哪些BraftEditor无效
};

BraftEditor.use(Table(options));

function aliysa(str) {
  let objs = {};
  try {
    objs = JSON.parse(str);
  } catch (error) {
    objs = {};
    console.log('富文本上传信息解析json失败', error);
  }
  if (Object.prototype.toString.call(objs) === '[object Object]') {
    return objs;
  }
  return {};
}

const BraftEditors = (props, ref) => {
  const { onChange, value } = props;
  const [editorState, setEditorState] = useState(
    BraftEditor.createEditorState(null, { editorId: 'editor-1' }),
  );

  useEffect(() => {
    if (value) {
      setEditorState(BraftEditor.createEditorState(value, { editorId: 'editor-1' }));
    }
  }, []);

  // console.log('props',value,props);

  //富文本媒体信息上传
  const myUploadFn = param => {
    const serverURL = uploadUrl + '/api/Common/Upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = response => {
      let fileObj = aliysa(xhr.responseText);
      console.log(fileObj, response);
      if (fileObj.resultData) {
        fileObj = fileObj.resultData;
      } else return;
      const fileName = fileObj.name;
      const sourcePath = fileObj.url;
      // console.log('假设商品端直接返回文件上传后的地址',fileObj)
      // 假设商品端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: filterImages(sourcePath),
        meta: {
          id: fileName,
          title: fileName,
          alt: fileName,
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: null, // 指定视频播放器的封面
        },
      });
    };

    const progressFn = event => {
      // console.log('上传进度发生变化时调用param',event)
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = response => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    fd.append('path', 'files');
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

  //富文本输入赋给form value
  const handleEditorChange = editorStates => {
    if (onChange) {
      const htmlString = editorStates.toHTML();
      // console.log('htmlString',htmlString)
      // if ( htmlString === '<p></p>') return;
      onChange(htmlString);
    }
    setEditorState(editorStates);
  };

  const submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到商品端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.editorState.toHTML()
    // const result = await saveEditorContent(htmlContent)
  };

  return (
    <div
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        minHeight: '320px',
      }}
    >
      <BraftEditor
        value={editorState}
        media={{ uploadFn: myUploadFn }}
        onChange={handleEditorChange}
        placeholder={'请输入内容'}
        style={{ minHeight: '320px' }}
        id="editor-1"
        // onSave={submitContent}
      />
    </div>
  );
};

export default forwardRef(BraftEditors);
