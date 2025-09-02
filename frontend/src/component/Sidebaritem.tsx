import  { ReactElement, MouseEventHandler } from "react";
import * as React from 'react';

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  onClick?: MouseEventHandler<HTMLDivElement>;  
}

function Sidebaritem({ text, icon, onClick }: SidebarItemProps) {
  return (
    <div
      className="flex items-center mx-3 text-gray-700 pr-14 py-1 cursor-pointer hover:bg-gray-200 hover:rounded-sm transition-all"
      onClick={onClick}
    >
      <div className="px-2">{icon}</div>
      <div className="px-2">{text}</div>
    </div>
  );
}

export default Sidebaritem;
