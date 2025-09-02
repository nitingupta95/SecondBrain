import * as React from 'react';

import Sidebaritem from './Sidebaritem';
import TwitterIcon from '../icons/TwitterIcon';
import  YoutubeIcon  from '../icons/YoutubeIcon';
import brainIcon from '../icons/brain.png';
import DocumentIcon from '@/icons/DocumentIcon';
import LinkIcon from '@/icons/LinkIcon';
import axios from 'axios';

function Sidebar() {
  const handleTwitter = () => {
     
  };
  return (
    <div className="h-screen bg-white border-r border-gray-200 w-64 fixed left-0 top-0">
       <div className="flex items-center p-4">
        <img 
          className="h-8 w-8 mr-2.5" 
          src={brainIcon} 
          alt="Brain Icon" 
        />
        <h1 className="text-2xl text-purple-600 font-bold">Brainly</h1>
      </div>

      <div className="pt-4">
        <Sidebaritem text={'Twitter'} icon={<TwitterIcon />} />
        <Sidebaritem text={'Youtube'} icon={<YoutubeIcon />} />
        <Sidebaritem text={'Document'} icon={<DocumentIcon />} />
        <Sidebaritem text={'Links'} icon={<LinkIcon/>} />

      </div>
    </div>
  );
}

export default Sidebar;