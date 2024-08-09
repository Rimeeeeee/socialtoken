import React, { useEffect, useState } from "react"
import { useSocialTokenContext } from "../context/context"
import { useActiveAccount } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"
import { prepareContractCall, sendTransaction } from "thirdweb"
import { upload } from "thirdweb/storage"

const RegisterUser: React.FC = () => {
  // Define the initial state
  const [formState, setFormState] = useState({
    name: "",
    caption: "",
    profilePic: "", // Now a string for IPFS hash
    bio: "",
  })
  const [createUserSuccess, setCreateUserSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { SocialContract, wallets, account, client } = useSocialTokenContext()
  const address = useActiveAccount()?.address
  const OWNER = import.meta.env.VITE_OWNER as string

  const handleRegister = async () => {
    try {
      if (
        formState.name &&
        formState.caption &&
        formState.profilePic &&
        formState.bio
      ) {
        const wallet = createWallet("io.metamask")
        const connectedAccount = await wallet.connect({ client })

        const transaction = await prepareContractCall({
          contract: SocialContract,
          method:
            "function register(string _name, string _bio, string _image_hash, string _caption)",
          params: [
            formState.name,
            formState.bio,
            formState.profilePic,
            formState.caption,
          ],
        })

        const { transactionHash } = await sendTransaction({
          transaction,
          account: connectedAccount,
        })

        if (transactionHash) {
          setCreateUserSuccess(true)
          alert("Registered Successfully")
          setTimeout(() => setCreateUserSuccess(false), 3000)
          setFormState({
            name: "",
            caption: "",
            profilePic: "",
            bio: "",
          })
        }
      } else {
        setError("Please fill all fields correctly.")
      }
    } catch (err) {
      console.error("Error creating user:", err)
      setError("Failed to create user.")
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const uris = await upload({
          client,
          files: [file],
        })
        setFormState((prevState) => ({
          ...prevState,
          profilePic: uris, // Set the first URI
        }))
      } catch (error) {
        console.error("Error uploading file to IPFS:", error)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleRegister()
  }

  return (
    <div className="flex items-center justify-center h-[85vh] bg-transparent text-white p-4">
      <div className="bg-transparent hover:bg-zinc-900 bg-opacity-100 border-white border-2 p-4 md:p-8 rounded-lg shadow-lg max-w-sm md:max-w-2xl lg:max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formState.name}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="caption" className="text-sm font-medium">
              Caption:
            </label>
            <input
              type="text"
              id="caption"
              name="caption"
              placeholder="Enter a caption for viewers"
              value={formState.caption}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="profilePic" className="text-sm font-medium">
              Profile Picture:
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 border border-gray-800 bg-zinc-950 text-white rounded-lg file:py-2 file:px-4 file:border-0 file:text-white file:bg-blue-600 hover:file:bg-blue-700"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              value={formState.bio}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-20 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterUser
