import { ExternalLink } from "lucide-react"

export const ExternalLinkButton = ({href}: {href: string}) => {
  const style = "w-5 h-5 cursor-pointer"
  return (
    <a href={href} target="_blank">
      <ExternalLink className={style} />
    </a>
  )
}