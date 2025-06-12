"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Store, Users, ExternalLink, Crown, Medal, Award, Download } from "lucide-react"
import { getRankings } from "./src/lib/actions"

interface RankingItem {
  id: number
  accountName: string
  profileUrl: string | null
  followers: number
  imageUrl: string | null
  area: string | null
  storeName: string | null
}

export default function RankingList() {
  const [rankings, setRankings] = useState<RankingItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRankings, setFilteredRankings] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        const result = await getRankings()

        if (result.success) {
          setRankings(result.data as RankingItem[])
          setFilteredRankings(result.data as RankingItem[])
        } else {
          setError(result.error || "データの取得に失敗しました")
        }
      } catch (error) {
        console.error("Failed to fetch rankings:", error)
        setError("データの取得に失敗しました")
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  useEffect(() => {
    const filtered = rankings.filter(
      (item) =>
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.area && item.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.storeName && item.storeName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredRankings(filtered)
    setCurrentPage(1) // 検索時はページを1に戻す
  }, [searchTerm, rankings])

  const formatFollowers = (count: number) => {
    if (count >= 100000) {
      return `${(count / 10000).toFixed(1)}万`
    } else if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-gray-500">#{rank}</span>
    }
  }

  const handleProfileClick = (profileUrl: string | null) => {
    if (profileUrl) {
      window.open(profileUrl, "_blank")
    }
  }

  const downloadCSV = () => {
    const csvContent = [
      ["順位", "アカウント名", "フォロワー数", "エリア", "店舗名", "プロフィールURL"],
      ...filteredRankings.map((item, index) => [
        index + 1,
        item.accountName,
        item.followers,
        item.area || "",
        item.storeName || "",
        item.profileUrl || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "ranking-mk2-data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ページネーション計算
  const totalPages = Math.ceil(filteredRankings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRankings = filteredRankings.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ランキングデータを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>再読み込み</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">インスタグラマーランキング</h1>
          <p className="text-gray-600 text-center">フォロワー数順のランキングです</p>
          <p className="text-sm text-gray-500 text-center mt-1">Ranking MK2</p>
        </div>

        {/* 検索バーとCSVダウンロード */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="アカウント名、エリア、店舗名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={downloadCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            CSV ダウンロード
          </Button>
        </div>

        {/* 結果数表示 */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredRankings.length} 件中 {startIndex + 1} - {Math.min(endIndex, filteredRankings.length)} 件を表示
        </div>

        {/* ランキングリスト */}
        <div className="space-y-4">
          {currentRankings.map((item, index) => {
            const globalRank = startIndex + index + 1
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* ランキング番号 */}
                    <div className="flex-shrink-0 w-12 flex justify-center">{getRankIcon(globalRank)}</div>

                    {/* プロフィール画像 */}
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={item.imageUrl || "/placeholder.svg"} alt={item.accountName} />
                      <AvatarFallback>{item.accountName.slice(1, 3).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    {/* メイン情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold truncate">{item.accountName}</h3>
                        {item.profileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProfileClick(item.profileUrl)}
                            className="p-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{formatFollowers(item.followers)}フォロワー</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {item.area && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{item.area}</span>
                          </div>
                        )}
                        {item.storeName && (
                          <div className="flex items-center space-x-1">
                            <Store className="h-4 w-4" />
                            <span>{item.storeName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* フォロワー数バッジ */}
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {item.followers.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              前へ
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              次へ
            </Button>
          </div>
        )}

        {filteredRankings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">検索結果が見つかりませんでした</h3>
            <p className="text-gray-500">別のキーワードで検索してみてください。</p>
          </div>
        )}

        {rankings.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ランキングデータがありません</h3>
            <p className="text-gray-500">管理者がデータを追加するまでお待ちください。</p>
          </div>
        )}
      </div>
    </div>
  )
}
