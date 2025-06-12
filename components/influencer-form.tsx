"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Eye, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface RankingItem {
  id?: number
  accountName: string
  profileUrl: string
  followers: number
  imageUrl: string
  area: string
  storeName: string
}

interface InfluencerFormProps {
  mode: "create" | "edit"
  initialData?: RankingItem
  onSubmit: (data: RankingItem) => Promise<void>
}

export default function InfluencerForm({ mode, initialData, onSubmit }: InfluencerFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<RankingItem>({
    accountName: "",
    profileUrl: "",
    followers: 0,
    imageUrl: "",
    area: "",
    storeName: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.accountName.trim()) {
      newErrors.accountName = "アカウント名は必須です"
    } else if (!formData.accountName.startsWith("@")) {
      newErrors.accountName = "アカウント名は@から始まる必要があります"
    }

    if (formData.followers <= 0) {
      newErrors.followers = "フォロワー数は1以上である必要があります"
    }

    if (formData.profileUrl && !formData.profileUrl.startsWith("http")) {
      newErrors.profileUrl = "有効なURLを入力してください"
    }

    if (formData.imageUrl && !formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "有効な画像URLを入力してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "入力エラー",
        description: "入力内容を確認してください",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(formData)
      toast({
        title: "成功",
        description: mode === "create" ? "インスタグラマーを登録しました" : "インスタグラマー情報を更新しました",
      })
      router.push("/admin/ranking")
    } catch (error) {
      toast({
        title: "エラー",
        description: "操作に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof RankingItem, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatFollowers = (count: number) => {
    return count.toLocaleString()
  }

  const handlePreview = () => {
    if (formData.profileUrl) {
      window.open(formData.profileUrl, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            {mode === "create" ? "インスタグラマー新規登録" : "インスタグラマー編集"}
          </h1>
          <p className="text-gray-600">
            {mode === "create"
              ? "新しいインスタグラマーの情報を入力してください"
              : "インスタグラマーの情報を編集してください"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* プロフィール画像プレビュー */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt={formData.accountName || "プロフィール画像"}
                  />
                  <AvatarFallback>
                    {formData.accountName ? formData.accountName.slice(1, 3).toUpperCase() : "IMG"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="imageUrl">プロフィール画像URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl ?? ""}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={errors.imageUrl ? "border-red-500" : ""}
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>}
                </div>
              </div>

              {/* アカウント名 */}
              <div className="space-y-2">
                <Label htmlFor="accountName">アカウント名 *</Label>
                <Input
                  id="accountName"
                  value={formData.accountName ?? ""}
                  onChange={(e) => handleInputChange("accountName", e.target.value)}
                  placeholder="@example_account"
                  className={errors.accountName ? "border-red-500" : ""}
                />
                {errors.accountName && <p className="text-sm text-red-500">{errors.accountName}</p>}
              </div>

              {/* プロフィールURL */}
              <div className="space-y-2">
                <Label htmlFor="profileUrl">InstagramプロフィールURL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="profileUrl"
                    value={formData.profileUrl ?? ""}
                    onChange={(e) => handleInputChange("profileUrl", e.target.value)}
                    placeholder="https://instagram.com/example_account"
                    className={errors.profileUrl ? "border-red-500" : ""}
                  />
                  <Button type="button" variant="outline" onClick={handlePreview} disabled={!formData.profileUrl}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                {errors.profileUrl && <p className="text-sm text-red-500">{errors.profileUrl}</p>}
              </div>

              {/* フォロワー数 */}
              <div className="space-y-2">
                <Label htmlFor="followers">フォロワー数 *</Label>
                <Input
                  id="followers"
                  type="number"
                  value={formData.followers}
                  onChange={(e) => handleInputChange("followers", Number.parseInt(e.target.value) || 0)}
                  placeholder="10000"
                  min="1"
                  className={errors.followers ? "border-red-500" : ""}
                />
                {formData.followers > 0 && (
                  <p className="text-sm text-gray-500">表示: {formatFollowers(formData.followers)}フォロワー</p>
                )}
                {errors.followers && <p className="text-sm text-red-500">{errors.followers}</p>}
              </div>

              {/* エリア */}
              <div className="space-y-2">
                <Label htmlFor="area">活動エリア</Label>
                <Input
                  id="area"
                  value={formData.area ?? ""}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="東京都渋谷区"
                />
              </div>

              {/* 店舗名 */}
              <div className="space-y-2">
                <Label htmlFor="storeName">関連店舗名</Label>
                <Input
                  id="storeName"
                  value={formData.storeName ?? ""}
                  onChange={(e) => handleInputChange("storeName", e.target.value)}
                  placeholder="カフェ・ド・パリ"
                />
              </div>
            </CardContent>
          </Card>

          {/* プレビューカード */}
          {formData.accountName && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>プレビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={formData.imageUrl || "/placeholder.svg"} alt={formData.accountName} />
                    <AvatarFallback>{formData.accountName.slice(1, 3).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{formData.accountName}</h3>
                    <p className="text-sm text-gray-600">{formatFollowers(formData.followers)}フォロワー</p>
                    {formData.area && <p className="text-sm text-gray-500">{formData.area}</p>}
                    {formData.storeName && <p className="text-sm text-gray-500">{formData.storeName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 送信ボタン */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "処理中..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "create" ? "登録" : "更新"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
