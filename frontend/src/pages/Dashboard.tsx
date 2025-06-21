import  { useEffect, useState } from 'react';
import * as React from 'react';

import Sidebar from '../component/Sidebar';
 
import Card from '../component/Card';
import UseContent from '../hooks/UseContent';
import { toast, Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
  DialogTitle
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button as ShadButton } from '../components/ui/button';
import ShareIcon from '../icons/ShareIcon';
import PlusIcon from '../icons/PlusIcon';
import { BACKEND_URL } from '@/config';
import axios from 'axios';

// ✅ Added `id` to the ContentItem interface
interface ContentItem {
  id: number;
  title: string;
  link: string;
  type: 'link' | 'tweet' | 'youtube' | 'document';
}
const isValidType = (t: string): t is ContentType => {
  return ["document", "link", "tweet", "youtube"].includes(t);
};
type ContentType = "document" | "link" | "tweet" | "youtube";

function Dashboard() {
  const { contents, refresh } = UseContent() as unknown as {
    contents: ContentItem[];
    refresh: () => void;
  };

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [type, setType] = useState<string>('');
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'Guest';

  useEffect(() => {
    refresh();
  }, [modalOpen]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    alert('You have logged out successfully!');
    navigate('/signin');
  };

  const handleSaveContent = async () => {
    if (!title || !link || !type) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        { id, title, link, type },
        {
         headers: {
           token: `${token}`,
         },
        }
      );

      toast.success('Content saved successfully!', {
        className: "bg-green-100 border border-green-400 text-green-800 font-semibold",
      });
      setModalOpen(false);
      refresh();
    } catch (error) {
      toast.error('Error saving content');
    }
  };

  return (
    <div className="flex">
      <Toaster />
      <Sidebar />
      <div className="p-4 ml-64 min-h-screen bg-gray-50 w-full border border-gray-200 box-border">
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-white p-6 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Add Content</DialogTitle>
                <DialogDescription className="mt-2 text-gray-600">
                  Enter content title, type and link to save it.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="id">Id</Label>
                  <Input
                    id="id"
                    value={id}
                    onChange={(e) => setId(Number(e.target.value))}
                    placeholder="Enter id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-[180px] ">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className='bg-black text-white'>
                      <SelectItem value="document">document</SelectItem>
                      <SelectItem value="tweet">tweet</SelectItem>
                      <SelectItem value="youtube">youtube</SelectItem>
                      <SelectItem value="link">link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <DialogFooter className="mt-8">
                <ShadButton onClick={handleSaveContent}>Save Content</ShadButton>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <PlusIcon /> Add Content
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors">
              <ShareIcon /> Share Brain
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contents.map(({ id, type, link, title }) =>
          isValidType(type) ? (
            <Card key={id} id={id} link={link} title={title} type={type} />
          ) : null
        )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;