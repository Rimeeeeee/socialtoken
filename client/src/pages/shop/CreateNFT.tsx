import React, { useEffect, useState } from "react"
import { useActiveAccount } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"
import { prepareContractCall, sendTransaction } from "thirdweb"
import { upload } from "thirdweb/storage"
import { useSocialTokenContext } from "../../context/context"
import { ethers } from "ethers"

const CreateToken: React.FC = () => {
  const [formState, setFormState] = useState({
    token_image: "",
    price: "",
    tokenValue: "",
  })
  const [createTokenSuccess, setCreateTokenSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { account, ICSContract, MarketContract, client } =
    useSocialTokenContext()
  const address = useActiveAccount()?.address

  const approve = async (tokenValue: string) => {
    try {
      if (!ICSContract?.address || !MarketContract?.address || !address) {
        throw new Error("Invalid contract or account address.")
      }

      const transaction = await prepareContractCall({
        contract: ICSContract,
        method:
          "function approve(address spender, uint256 value) returns (bool)",
        params: [MarketContract.address, BigInt(Number(tokenValue) * 1e18)],
      })

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })

      console.log("Approval successful, transaction hash:", transactionHash)
      return transactionHash
    } catch (error) {
      console.error("Error during approval:", error)
      setError("Failed to approve tokens.")
      throw error
    }
  }

  const createToken = async () => {
    try {
      if (!MarketContract?.address || !address) {
        throw new Error("Invalid contract or account address.")
      }
      await approve(formState.tokenValue)

      const transaction = await prepareContractCall({
        contract: MarketContract,
        method:
          "function createToken(string tokenURI, uint256 price, uint256 tokenValue)",
        params: [
          formState.token_image,
          BigInt(formState.price),
          BigInt(formState.tokenValue),
        ],
      })

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })

      console.log(
        "Token creation successful, transaction hash:",
        transactionHash,
      )
      return transactionHash
    } catch (error) {
      console.error("Error during token creation:", error)
      setError("Failed to create token.")
      throw error
    }
  }

  const handleTokenCreation = async () => {
    try {
      if (
        formState.token_image &&
        formState.price &&
        Number(formState.tokenValue) >= 10
      ) {
        await approve(formState.tokenValue)
        await createToken()

        setCreateTokenSuccess(true)
        alert("Token created successfully!")
        setTimeout(() => setCreateTokenSuccess(false), 3000)
        setFormState({
          token_image: "",
          price: "",
          tokenValue: "",
        })
      } else {
        setError("Please fill all fields correctly.")
      }
    } catch (err) {
      console.error("Error creating token:", err)
      setError("Failed to create token.")
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

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

    if (name === "tokenValue" && Number(value) < 10) {
      setError("Token value must be at least 10.")
    } else {
      setError(null)
    }
  }

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
          token_image: uris[0], // Set the first URI as token_image
        }))
      } catch (error) {
        console.error("Error uploading file to IPFS:", error)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleTokenCreation()
  }

  return (
    <div className="flex items-center justify-center h-[85vh] bg-transparent text-white p-4">
      <div className="bg-transparent hover:bg-zinc-900 bg-opacity-100 border-white border-2 p-4 md:p-8 rounded-lg shadow-lg max-w-sm md:max-w-2xl lg:max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Token
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="token_image" className="text-sm font-medium">
              Token Image:
            </label>
            <input
              type="file"
              id="token_image"
              name="token_image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 border border-gray-800 bg-zinc-950 text-white rounded-lg file:py-2 file:px-4 file:border-0 file:text-white file:bg-blue-600 hover:file:bg-blue-700"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-medium">
              Price:
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Enter the price"
              value={formState.price}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="tokenValue" className="text-sm font-medium">
              Token Value:
            </label>
            <input
              type="text"
              id="tokenValue"
              name="tokenValue"
              placeholder="Enter the token value (min 10)"
              value={formState.tokenValue}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-800 bg-zinc-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="mt-20 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Create Token
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateToken
