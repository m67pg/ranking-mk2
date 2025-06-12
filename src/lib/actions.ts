"use server"

import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"

export interface RankingItem {
  id: number
  accountName: string
  profileUrl: string | null
  followers: number
  imageUrl: string | null
  area: string | null
  storeName: string | null
}

export async function createRanking(data: Omit<RankingItem, "id">) {
  try {
    console.log("Creating ranking with data:", data)

    const cleanData = {
      accountName: String(data.accountName),
      profileUrl: data.profileUrl ? String(data.profileUrl) : null,
      followers: Number(data.followers),
      imageUrl: data.imageUrl ? String(data.imageUrl) : null,
      area: data.area ? String(data.area) : null,
      storeName: data.storeName ? String(data.storeName) : null,
    }

    const ranking = await prisma.ranking.create({
      data: cleanData,
    })

    console.log("Successfully created ranking:", ranking)
    revalidatePath("/")
    revalidatePath("/admin/ranking")

    return { success: true, data: ranking }
  } catch (error) {
    console.error("Failed to create ranking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function updateRanking(id: number, data: Omit<RankingItem, "id">) {
  try {
    const cleanData = {
      accountName: String(data.accountName),
      profileUrl: data.profileUrl ? String(data.profileUrl) : null,
      followers: Number(data.followers),
      imageUrl: data.imageUrl ? String(data.imageUrl) : null,
      area: data.area ? String(data.area) : null,
      storeName: data.storeName ? String(data.storeName) : null,
    }

    const ranking = await prisma.ranking.update({
      where: { id },
      data: cleanData,
    })

    revalidatePath("/")
    revalidatePath("/admin/ranking")

    return { success: true, data: ranking }
  } catch (error) {
    console.error("Failed to update ranking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function deleteRanking(id: number) {
  try {
    await prisma.ranking.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/admin/ranking")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete ranking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getRankings() {
  try {
    const rankings = await prisma.ranking.findMany({
      orderBy: {
        followers: "desc",
      },
    })

    return { success: true, data: rankings }
  } catch (error) {
    console.error("Failed to get rankings:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getRanking(id: number) {
  try {
    const ranking = await prisma.ranking.findUnique({
      where: { id },
    })

    if (!ranking) {
      return { success: false, error: "Ranking not found" }
    }

    return { success: true, data: ranking }
  } catch (error) {
    console.error("Failed to get ranking:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log("Database connection test:", result)
    return { success: true, data: result }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  } finally {
    await prisma.$disconnect()
  }
}
