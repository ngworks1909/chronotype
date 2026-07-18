"use server"
import ConfigBarRow from "./ConfigBarRow"
import TopicDropdown from "./TopicDropDown"
import { fetchTopics } from "@/actions/topics"

export default async function ConfigBar() {
    const topics = await fetchTopics()

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <ConfigBarRow />
      <div className="flex items-center gap-3">
        <TopicDropdown topics={topics.success ? topics.topics : []} />
      </div>
    </div>
  )
}