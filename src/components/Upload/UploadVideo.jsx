import React, { forwardRef, useState, useEffect } from 'react';
import { Upload, Icon, Modal, message } from 'antd';

import { genID, filterImages } from '@/utils/utils.js';

import { uploadUrl, imagesUrl } from '@/utils/config.js';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const UploadImg = (props, ref) => {
  const { style, onChange, value } = props;

  useEffect(() => {
    if (value) {
      const handleFileList = [
        {
          uid: genID(),
          name: 'video.mp4',
          status: 'done',
          url: filterImages(value),
          storageUrl: filterImages(value),
        },
      ];
      setFileList(handleFileList);
    }
  }, []);

  // console.log('props',props);

  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const uploadButton = (
    <div>
      <Icon type="plus" style={{ fontSize: '28px' }} />
      {/* <div className="ant-upload-text">上传</div> */}
    </div>
  );

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    // if (!file.url && !file.preview) {
    //     file.preview = await getBase64(file.originFileObj);
    // }

    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
  };

  const handleChange = ({ fileList }) => {
    if (Array.isArray(fileList) && fileList.length > 0) {
      fileList = fileList.slice(fileList.length - 1, fileList.length);
    }

    // console.log('fileList', fileList);

    const handleFileList = formatFilst(fileList);
    if (onChange && handleFileList[0] && handleFileList[0].response) {
      try {
        onChange(handleFileList[0].response.resultData.url || '');
      } catch (error) {
        console.error('图片上传组件 response 错误', error);
      }
    }

    setFileList(handleFileList);
  };

  const formatFilst = arr => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      const { uid, status, response, name } = item;
      if (response && response.body) {
        let bigPathList = response.body[0];
        let bigPath = bigPathList.sourcePath;
        return {
          uid,
          status,
          name,
          storageUrl: bigPath,
          url: filterImages(bigPath),
        };
      }
      return item;
    });
  };

  return (
    <div className="clearfix">
      <Upload
        accept="video/*"
        name="file"
        data={{ path: 'files' }}
        action={`${uploadUrl}/api/Common/Upload`}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length > 5 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <video controls alt="example" style={{ width: '100%' }} src={previewImage}></video>
      </Modal>
    </div>
  );
};

export default forwardRef(UploadImg);
