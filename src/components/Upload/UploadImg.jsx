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
          name: 'image.png',
          status: 'done',
          url: filterImages(value),
          storageUrl: filterImages(value),
        },
      ];
      setFileList(handleFileList);
    }
  }, []);

  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const uploadButton = (
    <div>
      <Icon type="plus" style={{ fontSize: '28px' }} />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    setPreviewVisible(true);
    if (file.response && file.response.resultData) {
      let imgPath = file.response.resultData.hostUr || file.response.resultData.url;
      setPreviewImage(imgPath);
    } else {
      let imgPath = file.storageUrl || file.url;
      setPreviewImage(imgPath);
    }
  };

  const handleChange = ({ fileList }) => {
    if (Array.isArray(fileList) && fileList.length > 0) {
      fileList = fileList.slice(fileList.length - 1, fileList.length);
    }

    const handleFileList = fileList;
    //上传图片
    if (onChange && handleFileList[0] && handleFileList[0].response) {
      try {
        onChange(handleFileList[0].response.resultData.url || '');
      } catch (error) {
        console.error('图片上传组件 response 错误', error);
      }
    } else {
      //删除图片
      onChange('');
    }

    setFileList(handleFileList);
  };

  return (
    <div className="clearfix">
      <Upload
        accept="image/*"
        name="file"
        data={{ path: 'files' }}
        action={`${uploadUrl}/api/Common/Upload`}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length === 0 ? uploadButton : null}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default forwardRef(UploadImg);
