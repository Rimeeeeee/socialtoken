import React, { useState, useRef, ChangeEvent, FormEvent } from "react"
import { FaCloudUploadAlt } from "react-icons/fa"
import { IoCloudUploadOutline } from "react-icons/io5"
import { MdLibraryAdd } from "react-icons/md"
import Vanta from "../components/Vanta1"
import { prepareContractCall, sendTransaction } from "thirdweb"
import { useSocialTokenContext } from "../context/context"
import { upload } from "thirdweb/storage"
import { createWallet } from "thirdweb/wallets"

const CreatePost: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [tags, setTags] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { SocialContract, client } = useSocialTokenContext()

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate inputs
    const newErrors: { [key: string]: string } = {}
    if (!file) newErrors.file = "Please upload a file."
    if (!caption) newErrors.caption = "Caption is required."
    if (!tags) newErrors.tags = "Tags are required."
    if (!location) newErrors.location = "Location is required."

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Clear previous errors
      setErrors({})
      if (file) {
        // Upload the file and get the hash
        const uris = await upload({
          client,
          files: [file],
        })
        console.log(uris)

        const fileHash = uris // Assuming single file upload

        // Assuming image and video are mutually exclusive
        //const isImage = file.type.startsWith("image/")
        // const isVideo = file.type.startsWith("video/")

        const imageHash = fileHash
        const videoHash = fileHash
        const wallet = createWallet("io.metamask")
        const account = await wallet.connect({ client })

        // Prepare and send the transaction to the smart contract
        const transaction = prepareContractCall({
          contract: SocialContract,
          method:
            "function createPost(string _title, string _description, string _imageHash, string _videoHash, string _tags)",
          params: [location, caption, imageHash, videoHash, tags],
        })

        const { transactionHash } = await sendTransaction({
          transaction,
          account,
        })

        console.log(
          "Post created successfully with transaction hash:",
          transactionHash,
        )
      }
    } catch (error) {
      console.error("Error creating post:", error)
    }
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
      <div className="relative z-10 max-w-md mx-auto p-6 bg-black bg-opacity-30 border-2 border-white rounded-lg">
        <div className="mt-20">
          <h1 className="my-12 text-3xl font-extrabold text-white flex flex-row gap-2">
            <MdLibraryAdd className="mt-1 font-3xl" />
            Create Post
          </h1>
          <div
            onClick={triggerFileInput}
            className="border-2 h-40 border-dashed border-gray-400 p-4 bg-white flex flex-col items-center cursor-pointer rounded-md"
          >
            <FaCloudUploadAlt className="text-4xl text-gray-600 mb-2" />
            <p className="text-gray-600">Click to select a file</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*"
            />
          </div>
          {errors.file && <p className="text-red-500 mt-2">{errors.file}</p>}
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
                className="w-full border border-gray-800 text-black rounded-md p-2"
                placeholder="Enter caption"
              />
              {errors.caption && (
                <p className="text-red-500 mt-2">{errors.caption}</p>
              )}
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
                className="w-full border text-black border-gray-800 rounded-md p-2"
                placeholder="Enter tags (comma separated)"
              />
              {errors.tags && (
                <p className="text-red-500 mt-2">{errors.tags}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
                className="w-full border border-gray-800 text-black rounded-md p-2"
                placeholder="Enter Title"
              />
              {errors.location && (
                <p className="text-red-500 mt-2">{errors.location}</p>
              )}
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
