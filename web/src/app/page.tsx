import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Album Video
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            写真とビデオを美しく管理・共有するプラットフォーム
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>写真一覧</CardTitle>
              <CardDescription>
                アップロードした写真を閲覧・管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                写真を見る
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>アップロード</CardTitle>
              <CardDescription>
                新しい写真やビデオをアップロード
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                ファイルを選択
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ログイン</CardTitle>
              <CardDescription>
                アカウントにアクセス
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                ログイン
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Next.js 14 + Tailwind CSS + shadcn/ui で構築
          </p>
        </div>
      </div>
    </div>
  );
}
