"use client"

import InfluencerForm from "../../../../components/influencer-form"
import { createRanking } from "../../../../src/lib/actions"

interface RankingItem {
  id?: number
  accountName: string
  profileUrl: string
  followers: number
  imageUrl: string
  area: string
  storeName: string
}

export default function CreateInfluencerPage() {
  const handleSubmit = async (data: RankingItem) => {
    console.log("新規登録データ:", data)

    const { id, ...createData } = data
    const result = await createRanking(createData)

    if (!result.success) {
      throw new Error(result.error || "Failed to create ranking")
    }

    return result.data
  }

  return <InfluencerForm mode="create" onSubmit={handleSubmit} />
}
