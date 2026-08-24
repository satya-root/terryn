import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardImageSell() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdWQ3qneKPgjUpBshhWCQA8BX47qw2Lh4FiJDA4F5SiXrEyDBiwUx2HfWD&s=10"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover  "
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Odisha</Badge>
        </CardAction>
        <CardTitle>#421</CardTitle>
        <CardDescription>
          <p>District : Angul</p>
          <p>Landmark : Bus Stand</p>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full"><Link href="/list">View</Link></Button>
      </CardFooter>
    </Card>
  )
}
