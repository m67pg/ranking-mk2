"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import InfluencerForm from "../../../../../components/influencer-form"
import { getRanking, updateRanking } from "../../../../../src/lib/actions"

interface RankingItem {
  id?: number
  accountName: string
  profileUrl: string
  followers: number
  imageUrl: string
  area: string
  storeName: string
}

export default function EditInfluencerPage() {
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const [influencer, setInfluencer] = useState<RankingItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const result = await getRanking(id)
        if (result.success) {
          setInfluencer(result.data)
        } else {
          console.error("Failed to fetch influencer:", result.error)
        }
      } catch (error) {
        console.error("Failed to fetch influencer:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchInfluencer()
    }
  }, [id])

  const handleSubmit = async (data: RankingItem) => {
    console.log("更新データ:", { ...data, id })

    // idフィールドを除外してServer Actionを呼び出し
    const { id: dataId, ...updateData } = data
    const result = await updateRanking(id, updateData)

    if (!result.success) {
      throw new Error(result.error || "Failed to update ranking")
    }

    return result.data
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">インスタグラマーが見つかりません</h1>
          <p className="text-gray-600">指定されたIDのインスタグラマーは存在しません。</p>
        </div>
      </div>
    )
  }

  return <InfluencerForm mode="edit" initialData={influencer} onSubmit={handleSubmit} />
}
