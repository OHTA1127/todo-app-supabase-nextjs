import { GetServerSideProps, NextPage } from 'next'
import { supabase } from '../utils/supabase'
import { Notice, Task } from '../types/types'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import Link from 'next/link'

//SSRではGetServerSidePropsと記述する
export const getServerSideProps: GetServerSideProps = async () => {
  console.log('getServerSideProps/ssr invoked')
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
  return { props: { tasks, notices } }
}

//コンポーネントで受け取るpropsの型指定
type StaticProps = {
  tasks: Task[]
  notices: Notice[]
}

const Ssr: NextPage<StaticProps> = ({ tasks, notices }) => {
  const router = useRouter()
  return (
    <Layout title="SSR">
      <p className="mb-3 text-pink-500">SSR</p>
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
      {/* prefetchとは遷移先のページに必要なデータが事前に取得されることであり、trueの場合はviewportに表示された時に実行され、falseの時はクッリクされた時に実行される */}
      <Link href={'/ssg'} prefetch={false}>
        <a className="my-3 text-xs">Link to SSG</a>
      </Link>
      <Link href={'/isr'} prefetch={false}>
        <a className="mb-3 text-xs">Link to ISR</a>
      </Link>
      <button className="mb-3 text-xs" onClick={() => router.push('/ssg')}>
        Route to SSG
      </button>
      <button className="mb-3 text-xs" onClick={() => router.push('/isr')}>
        Route to ISR
      </button>
    </Layout>
  )
}

export default Ssr
