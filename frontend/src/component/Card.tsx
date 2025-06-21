import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import ShareIcon from '../icons/ShareIcon';
import YoutubeIcon from '../icons/YoutubeIcon';
import TwitterIcon from '@/icons/TwitterIcon';
import LinkIcon from '@/icons/LinkIcon';
import DocumentIcon from '@/icons/DocumentIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import ExternalLInk from '@/icons/ExternalLInk';
import { toast } from 'sonner';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { Button } from "@/components/ui/button";
import UseContent from '../hooks/UseContent'
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ContentType = "document" | "link" | "tweet" | "youtube";

interface cardProps {
  title: string;
  link: string;
  type: ContentType;
  id: number;
}

// Extend the Window interface to include twttr for TS
declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

function Card({ id, title, link, type }: cardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr.widgets?.load(containerRef.current);
    }
  }, [link]);

  const hanleShare = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to be logged in to delete content");
      return;
    }

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
        headers: { token },
      });
      toast.success("Content deleted successfully!", {
        className: "bg-green-100 border border-green-400 text-green-800 font-semibold",
      });
      setOpen(false);
      navigate("/");
    } catch {
      toast.error("Failed to delete content");
    }
  };

  const renderMedia = () => {
    if (type === 'youtube') {
      const embedUrl = link.includes('youtu.be/')
        ? `https://www.youtube.com/embed/${link.split('youtu.be/')[1].split('?')[0]}`
        : link.replace('watch?v=', 'embed/');

      return (
        <iframe
          className="w-full rounded-md mt-4"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      );
    }

    if (type === 'document') {
      const fileId = link.split("/d/")[1]?.split("/")[0];
      const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      return (
        <iframe
          className="w-full rounded-md mt-4"
          src={`https://docs.google.com/gview?url=${encodeURIComponent(directUrl)}&embedded=true`}
          title="Document viewer"
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    if (type === 'tweet') {
      return (
        <div ref={containerRef} className="mt-4">
          <blockquote className="twitter-tweet">
            <a href={link.replace('x.com', 'twitter.com')}></a>
          </blockquote>
        </div>
      );
    }

    if (type === 'link') {
      return (
        <div className="mt-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-words"
          >
            {link}
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4 bg-white rounded-md border-2 border-slate-300 max-w-72 min-h-48 min-w-72">
      <div className="flex justify-between items-center">
        <div className="flex items-center pr-2 text-md">
          {type === "youtube" && <YoutubeIcon className="pr-2 text-black size-5" />}
          {type === "tweet" && <TwitterIcon className="pr-2 text-black size-5" />}
          {type === "link" && <LinkIcon className="pr-2 text-black size-5" />}
          {type === "document" && <DocumentIcon className="pr-2 text-black size-5" />}
          <span className="font-medium text-black">{title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="pr-2 text-gray-500 cursor-pointer" onClick={hanleShare}>
            <ShareIcon />
          </div>

          <div className="pr-2 text-gray-500 cursor-pointer" onClick={() => setOpen(true)}>
            <DeleteIcon />
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="pr-2 text-gray-500 cursor-pointer"
          >
            <ExternalLInk />
          </a>
        </div>
      </div>

      {renderMedia()}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Do you really want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className='bg-black text-white' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-violet-700 text-white" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Card;