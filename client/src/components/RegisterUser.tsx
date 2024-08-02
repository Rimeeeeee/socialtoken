import React, { useState } from "react"

// Placeholder function for uploading file to IPFS and getting a hash
const uploadToIPFS = async (file: File): Promise<string> => {
  // Simulate file upload and return a mock IPFS hash
  return new Promise((resolve) => {
    setTimeout(() => resolve("QmSomeHashFromIPFS"), 1000)
  })
}

const RegisterUser: React.FC = () => {
  // Define the initial state
  const [formState, setFormState] = useState({
    name: "",
    userID: "",
    profilePic: "", // Now a string for IPFS hash
    bio: "",
    location: "",
    gender: "", // Added gender
    link: "", // Added link
  })

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
        const ipfsHash = await uploadToIPFS(file) // Upload file and get IPFS hash
        setFormState((prevState) => ({
          ...prevState,
          profilePic: ipfsHash,
        }))
      } catch (error) {
        console.error("Error uploading file to IPFS:", error)
      }
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formState)
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
            <label htmlFor="userID" className="text-sm font-medium">
              User ID:
            </label>
            <input
              type="text"
              id="userID"
              name="userID"
              placeholder="Enter your User ID"
              value={formState.userID}
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

          <div className="flex flex-col">
            <label htmlFor="location" className="text-sm font-medium">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter your location"
              value={formState.location}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formState.gender}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="link" className="text-sm font-medium">
              Link:
            </label>
            <input
              type="url"
              id="link"
              name="link"
              placeholder="Enter your link"
              value={formState.link}
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
