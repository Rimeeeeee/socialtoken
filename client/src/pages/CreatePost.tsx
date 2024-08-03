import React, { useState, useRef, ChangeEvent, FormEvent } from "react"
import { useDrop, DropTargetMonitor } from "react-dnd"
import { FaCloudUploadAlt } from "react-icons/fa"
import { IoCloudUploadOutline } from "react-icons/io5"
import { MdLibraryAdd } from "react-icons/md"
import Vanta from "../components/Vanta1"

interface FileItem {
  files: File[]
}

const CreatePost: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "FILE",
      drop: (item: FileItem) => handleDrop(item),
      collect: (monitor: DropTargetMonitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [file],
  )

  const handleDrop = (item: FileItem) => {
    // Handle only one file upload
    if (item.files.length > 0) {
      setFile(item.files[0])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission
    console.log({ file, caption, tags, location })
  }

  const renderFilePreview = () => {
    if (!file) return null

    const fileURL = URL.createObjectURL(file)

    if (file.type.startsWith("image/")) {
      return (
        <div className="mt-4">
          <img
            src={fileURL}
            alt="Preview"
            className="max-w-full h-auto border border-gray-300 rounded-md"
          />
          <p className="text-gray-600 mt-2">{file.name}</p>
        </div>
      )
    } else if (file.type.startsWith("video/")) {
      return (
        <div className="mt-4">
          <video
            controls
            className="max-w-full h-auto border border-gray-300 rounded-md"
          >
            <source src={fileURL} type={file.type} />
            Your browser does not support the video tag.
          </video>
          <p className="text-gray-600 mt-2">{file.name}</p>
        </div>
      )
    }
    return <p className="text-gray-600 mt-2">Unsupported file type</p>
  }

  return (
    <div className="relative">
      <Vanta />
      <div className="relative z-10 max-w-md mx-auto p-6 bg-black bg-opacity-50 border-2 border-white rounded-lg">
        <div className="mt-20">
          <h1 className="my-12 text-3xl font-extrabold text-white flex flex-row gap-2">
            <MdLibraryAdd className="mt-1 font-3xl" />
            Create Post
          </h1>
          <div
            ref={drop}
            onClick={triggerFileInput} // Trigger file input click
            className={`border-2 h-40 border-dashed border-gray-400 p-4 ${isOver ? "bg-gray-200" : "bg-white"} flex flex-col items-center cursor-pointer rounded-md`}
          >
            <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
            <p className="text-gray-600">
              Drag and drop a file here, or click to select one
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*" // Accept image and video files
            />
          </div>
          {renderFilePreview()}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label htmlFor="caption" className="block text-gray-300 mb-2">
                Caption
              </label>
              <input
                type="text"
                id="caption"
                value={caption}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCaption(e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter caption"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tags" className="block text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTags(e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter tags (comma separated)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter location"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-bold hover:bg-blue-700 w-full flex flex-row justify-center"
            >
              <IoCloudUploadOutline className="text-2xl mx-2 font-bold" />
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
