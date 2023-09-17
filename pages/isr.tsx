import { GetStaticProps, NextPage } from 'next'
import { supabase } from '../utils/supabase'
import { Notice, Task } from '../types/types'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async () => {
  console.log('getStaticProps/isr invoked')
  //取得したデータをtasksという変数に格納している
  const { data: tasks } = await supabase
    //データベース指定
    .from('todos')

    //SQLのセレクトで*にすることで全てのtaskを取得する
    .select('*')

    //古いものから新しいものを取得する (新しいものが下に来る)
    .order('created_at', { ascending: true })

  const { data: notices } = await supabase
    //データベース指定
    .from('notices')

    //SQLのセレクトで*にすることで全てのtaskを取得する
    .select('*')

    //古いものから新しいものを取得する
    .order('created_at', { ascending: true })

  //returnでpropsの形で値を返す必要がある
  //基本的にはSSGと記述方法は同じだが、ISRではrevalidateをつかする必要がある(下の内容は、”HTML再生成は５秒間で最大一回だけ”ということを意味する)
  return { props: { tasks, notices }, revalidate: 5 }
}

//コンポーネントで受け取るpropsの型指定
type StaticProps = {
  tasks: Task[]
  notices: Notice[]
}

const Isr: NextPage<StaticProps> = ({ tasks, notices }) => {
  const router = useRouter()
  return (
    <Layout title="ISR">
      <p className="mb-3 text-indigo-500">ISR</p>
      {/* task一覧表示 */}
      <ul className="mb-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <p className="text-lg font-extrabold">{task.title}</p>
          </li>
        ))}
      </ul>
      {/* notices一覧表示 */}
      <ul className="mb-3">
        {notices.map((notice) => (
          <li key={notice.id}>
            <p className="text-lg font-extrabold">{notice.content}</p>
          </li>
        ))}
      </ul>
      <Link href={'/ssr'} prefetch={false}>
        <a className="my-3 text-xs">Link to SSR</a>
      </Link>
      <button className="mb-3 text-xs" onClick={() => router.push('/ssr')}>
        Route to SSR
      </button>
    </Layout>
  )
}

export default Isr
