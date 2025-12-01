import { useState } from 'react';
import { Tooltip } from 'antd';
import { message } from 'antd';
import { MdContentCopy } from "react-icons/md";

const CopyToClipboard = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      message.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy'}>
      <span>
        <MdContentCopy 
          style={{ cursor: 'pointer', marginLeft: '8px' }} 
          onClick={handleCopy} 
        />
      </span>
    </Tooltip>
  );
};

export default CopyToClipboard;
