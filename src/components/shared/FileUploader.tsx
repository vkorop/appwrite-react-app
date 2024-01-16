import React, { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';

type FileUploaderProps = {
  onFileChange: (file: FileWithPath[]) => void;
  mediaUrl: string;
};

function FileUploader({ onFileChange, mediaUrl }: FileUploaderProps) {
  const [fileUrl, setFileUrl] = useState(mediaUrl || '');
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    setFile(acceptedFiles);
    onFileChange(acceptedFiles);
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.gif', '.jpg', '.jpeg', '.svg']
    }
  });

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      {
        fileUrl ? (
          <>
            <img
              src={fileUrl}
              alt='file-upload'
            />

            <p className='file_uploader-label'>Click or drag photo to replace</p>
          </>
        ) : (
          <div className='file_uploader-box rounded-xl'>
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt='file-upload'
            />

            <h3 className='base-medium mb-2'>Drag photo here</h3>

            <p className='small-regular text-light-3 mb-4'>SVG, PNG, JPG</p>

            <Button className="shad-button_dark_4">
              Select from computer
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader